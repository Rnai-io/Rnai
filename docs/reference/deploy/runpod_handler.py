"""
Rnai AI — RunPod Serverless custom worker (image + TTS backup)
==============================================================
For the LLM backup, DON'T write code — use RunPod's official OpenAI-compatible
worker image `runpod/worker-vllm` (see runpod-deploy.md). This custom handler is
for the NON-LLM backups (image generation + TTS) which the official worker
doesn't cover.

RunPod Serverless scales to zero and bills per request; it requires a handler
function wrapped with `runpod.serverless.start({"handler": ...})`.

Build & deploy
--------------
  # Dockerfile (same dir):
  #   FROM runpod/base:0.6.2-cuda12.1.0
  #   RUN pip install runpod diffusers transformers accelerate torch piper-tts pillow
  #   COPY runpod_handler.py /handler.py
  #   CMD ["python", "-u", "/handler.py"]
  docker build -t <you>/rnai-backup-worker .
  docker push <you>/rnai-backup-worker
  # → RunPod console: New Endpoint → Custom → your image → pick GPU → deploy
  # Endpoint runs at:  https://api.runpod.ai/v2/<endpoint_id>/runsync  (Bearer RUNPOD_API_KEY)

Input contract (matches the gateway's self-hosted providers):
  { "input": { "task": "image" | "tts", "prompt": "...", "text": "..." } }
Output:
  { "url": "data:..." }
"""

import base64
import tempfile
from io import BytesIO

import runpod

_pipe = None       # lazy-loaded SDXL pipeline
_voice = None      # lazy-loaded Piper voice


def _get_pipe():
    global _pipe
    if _pipe is None:
        import torch
        from diffusers import StableDiffusionXLPipeline
        _pipe = StableDiffusionXLPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            torch_dtype=torch.float16,
        ).to("cuda")
    return _pipe


def _get_voice():
    global _voice
    if _voice is None:
        from piper.voice import PiperVoice
        _voice = PiperVoice.load("en_US-amy-medium")
    return _voice


def handler(job):
    data = job.get("input", {}) or {}
    task = data.get("task", "image")

    if task == "image":
        prompt = data.get("prompt") or "a high quality photo"
        img = _get_pipe()(prompt=prompt, num_inference_steps=30).images[0]
        buf = BytesIO()
        img.save(buf, format="PNG")
        return {"url": "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()}

    if task == "tts":
        text = data.get("text") or ""
        with tempfile.NamedTemporaryFile(suffix=".wav") as f:
            with open(f.name, "wb") as wav:
                _get_voice().synthesize(text, wav)
            audio = open(f.name, "rb").read()
        return {"url": "data:audio/wav;base64," + base64.b64encode(audio).decode()}

    return {"error": f"unknown task '{task}'"}


runpod.serverless.start({"handler": handler})
