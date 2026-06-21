"""
Rnai AI — Backup inference on Modal (scale-to-zero GPU)
=======================================================
Two services, matched EXACTLY to what the integrated backend failover calls
(rnai-platform → src/lib/ai/providers/selfhosted.ts):

  serve (vLLM, GPU)   GET  /health
                      POST /v1/chat/completions       ← SELF_VLLM_URL
  media (GPU)         GET  /health
                      POST /generate   { prompt }      → { url }  ← SELF_SDXL_URL + /generate
                      POST /transcribe { audio }       → { text } ← SELF_STT_URL  + /transcribe
                      POST /tts        { text }        → { url }  ← SELF_TTS_URL  + /tts

So after `modal deploy`, set in the backend (Vercel):
  SELF_VLLM_URL = https://<you>--rnai-backup-serve.modal.run
  SELF_SDXL_URL = https://<you>--rnai-backup-media-web.modal.run   (image)
  SELF_STT_URL  = https://<you>--rnai-backup-media-web.modal.run   (SAME url)
  SELF_TTS_URL  = https://<you>--rnai-backup-media-web.modal.run   (SAME url)
  SELF_VLLM_MODEL = rnai-llm

Quick start
-----------
  pip install modal
  python3 -m modal setup
  # create a Modal secret named "huggingface" with key HUGGING_FACE_HUB_TOKEN
  python3 -m modal deploy modal_app.py

NOTE: image/STT/TTS all live in one GPU container (cheaper). TTS uses MMS-TTS
(English) as a backup voice. Verify Modal/vLLM versions against current docs.
"""

import subprocess

import modal

MINUTES = 60
app = modal.App("rnai-backup")

hf_cache = modal.Volume.from_name("rnai-hf-cache", create_if_missing=True)
HF_SECRET = modal.Secret.from_name("huggingface")


# ── 1) LLM — vLLM (native /v1/... + /health) ─────────────────────────────────
LLM_MODEL = "Qwen/Qwen2.5-7B-Instruct"  # ungated; swap for your trained rnai-llm later

vllm_image = (
    modal.Image.debian_slim(python_version="3.12")
    .pip_install("vllm==0.6.6", "huggingface_hub[hf_transfer]==0.27.0")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
)


@app.function(
    image=vllm_image,
    gpu="A10G:1",
    scaledown_window=10 * MINUTES,
    timeout=20 * MINUTES,
    volumes={"/root/.cache/huggingface": hf_cache},
    secrets=[HF_SECRET],
)
@modal.concurrent(max_inputs=64)
@modal.web_server(port=8000, startup_timeout=15 * MINUTES)
def serve():
    subprocess.Popen([
        "vllm", "serve", LLM_MODEL,
        "--served-model-name", "rnai-llm",
        "--host", "0.0.0.0", "--port", "8000",
        "--max-model-len", "8192",
    ])


# ── 2) Media (GPU) — SDXL image + Whisper STT + MMS TTS, one FastAPI app ──────
media_image = (
    modal.Image.debian_slim(python_version="3.12")
    .apt_install("ffmpeg")
    .pip_install(
        "diffusers==0.31.0", "transformers==4.46.0", "accelerate==1.1.0",
        "torch==2.5.1", "pillow==11.0.0", "faster-whisper==1.0.3",
        "numpy<2", "fastapi[standard]==0.115.0",
    )
)


@app.cls(
    image=media_image,
    gpu="A10G:1",
    scaledown_window=5 * MINUTES,
    volumes={"/root/.cache/huggingface": hf_cache},
    secrets=[HF_SECRET],
)
class Media:
    @modal.enter()
    def load(self):
        import torch
        from diffusers import StableDiffusionXLPipeline
        from faster_whisper import WhisperModel
        from transformers import VitsModel, AutoTokenizer

        self.pipe = StableDiffusionXLPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16,
        ).to("cuda")
        self.whisper = WhisperModel("large-v3", device="cuda", compute_type="float16")
        self.tts_model = VitsModel.from_pretrained("facebook/mms-tts-eng").to("cuda")
        self.tts_tok = AutoTokenizer.from_pretrained("facebook/mms-tts-eng")

    @modal.asgi_app()
    def web(self):
        import base64, io, tempfile, wave
        import numpy as np
        import torch
        from fastapi import FastAPI

        api = FastAPI()

        @api.get("/health")
        def health():
            return {"ok": True}

        @api.post("/generate")
        def generate(item: dict):
            prompt = item.get("prompt") or "a high quality photo"
            img = self.pipe(prompt=prompt, num_inference_steps=30).images[0]
            buf = io.BytesIO(); img.save(buf, format="PNG")
            return {"url": "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()}

        @api.post("/transcribe")
        def transcribe(item: dict):
            audio_b64 = item.get("audio") or ""
            if "," in audio_b64:
                audio_b64 = audio_b64.split(",", 1)[1]
            with tempfile.NamedTemporaryFile(suffix=".m4a", delete=False) as f:
                f.write(base64.b64decode(audio_b64)); path = f.name
            segments, _ = self.whisper.transcribe(path)
            return {"text": "".join(s.text for s in segments).strip()}

        @api.post("/tts")
        def tts(item: dict):
            text = item.get("text") or ""
            inputs = self.tts_tok(text, return_tensors="pt").to("cuda")
            with torch.no_grad():
                wav = self.tts_model(**inputs).waveform.squeeze().detach().cpu().numpy()
            peak = float(np.abs(wav).max()) or 1.0
            pcm = (wav / peak * 32767).astype(np.int16)
            buf = io.BytesIO()
            with wave.open(buf, "wb") as w:
                w.setnchannels(1); w.setsampwidth(2)
                w.setframerate(int(self.tts_model.config.sampling_rate))
                w.writeframes(pcm.tobytes())
            return {"url": "data:audio/wav;base64," + base64.b64encode(buf.getvalue()).decode()}

        return api


@app.local_entrypoint()
def main():
    print("Deploy:  python3 -m modal deploy modal_app.py")
    print("Set SELF_VLLM_URL = serve URL ; SELF_SDXL_URL = SELF_STT_URL = SELF_TTS_URL = media-web URL")
