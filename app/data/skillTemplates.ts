/**
 * Prompt Templates for Rnai.io Skills
 * 5 templates per skill, each with an example output image/text
 */

export interface PromptTemplate {
  id: string;
  label: string;        // Short chip label
  prompt: string;       // Full prompt text pre-filled into input
  exampleImage?: string; // URL showing expected output (for image skills)
  exampleCaption: string; // Short description of expected result
  /** Thai localization. prompt is omitted for image skills — English prompts
   *  produce better results from image models. */
  th?: { label: string; prompt?: string; caption: string };
}

/** Return a template localized for the given language. */
export function localizeTemplate(tmpl: PromptTemplate, lang: string): PromptTemplate {
  if (lang === 'th' && tmpl.th) {
    return {
      ...tmpl,
      label: tmpl.th.label,
      prompt: tmpl.th.prompt ?? tmpl.prompt,
      exampleCaption: tmpl.th.caption,
    };
  }
  return tmpl;
}

export interface SkillTemplateData {
  skillId: string;
  templates: PromptTemplate[];
}

export const SKILL_TEMPLATES: Record<string, PromptTemplate[]> = {

  // ─── 1. GENERATE IMAGE ────────────────────────────────────────────────────
  'image-gen': [
    {
      id: 'ig-1',
      label: '🐉 Fantasy Dragon',
      prompt: 'A majestic dragon soaring over snow-capped mountains at dawn, epic fantasy art, dramatic lighting, 4K ultra detailed',
      exampleImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
      exampleCaption: 'Epic fantasy landscape with dramatic lighting',
      th: { label: '🐉 มังกรแฟนตาซี', caption: 'ภาพแฟนตาซีอลังการ แสงเงาดราม่าติก' },
    },
    {
      id: 'ig-2',
      label: '🏙️ Cyberpunk City',
      prompt: 'Cyberpunk city street at night with neon lights reflecting in rain puddles, flying cars, futuristic billboards, cinematic',
      exampleImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
      exampleCaption: 'Neon-lit futuristic cityscape at night',
      th: { label: '🏙️ เมืองไซเบอร์พังก์', caption: 'เมืองอนาคตแสงนีออนยามค่ำคืน' },
    },
    {
      id: 'ig-3',
      label: '🌸 Anime Style',
      prompt: 'A young girl sitting under cherry blossom trees, Studio Ghibli anime art style, soft warm colors, magical atmosphere',
      exampleImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
      exampleCaption: 'Soft anime-style cherry blossom scene',
      th: { label: '🌸 สไตล์อนิเมะ', caption: 'ฉากซากุระโทนอนิเมะละมุนตา' },
    },
    {
      id: 'ig-4',
      label: '☕ Minimal Logo',
      prompt: 'Minimalist logo design for a modern coffee shop, clean vector art, black and gold color scheme, professional branding',
      exampleImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
      exampleCaption: 'Clean minimalist coffee shop branding',
      th: { label: '☕ โลโก้มินิมอล', caption: 'แบรนด์ร้านกาแฟสไตล์มินิมอลสะอาดตา' },
    },
    {
      id: 'ig-5',
      label: '🌊 Abstract Art',
      prompt: 'Abstract fluid art with deep purple and gold swirls, macro photography style, luxurious and ethereal, high contrast',
      exampleImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80',
      exampleCaption: 'Vibrant abstract fluid artwork',
      th: { label: '🌊 ศิลปะนามธรรม', caption: 'งานศิลป์ของไหลสีม่วงทองหรูหรา' },
    },
  ],

  // ─── 2. EDIT IMAGE ────────────────────────────────────────────────────────
  'image-edit': [
    {
      id: 'ie-1',
      label: '🌅 Sunset Glow',
      prompt: 'Apply a warm golden sunset lighting to the entire scene, add lens flare, make the colors rich and cinematic',
      exampleImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      exampleCaption: 'Warm golden hour color grading',
      th: { label: '🌅 แสงอาทิตย์ตก', caption: 'เกรดสีโทนทองอบอุ่นแบบ golden hour' },
    },
    {
      id: 'ie-2',
      label: '🏖️ Beach Background',
      prompt: 'Replace the background with a tropical beach at sunset, crystal clear turquoise water, soft sand, seamless blend',
      exampleImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      exampleCaption: 'Natural-looking beach background swap',
      th: { label: '🏖️ พื้นหลังชายหาด', caption: 'เปลี่ยนพื้นหลังเป็นชายหาดแบบเนียนธรรมชาติ' },
    },
    {
      id: 'ie-3',
      label: '🌙 Night Scene',
      prompt: 'Transform the scene to nighttime, add city lights in the background, moody blue atmosphere, stars in the sky',
      exampleImage: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&q=80',
      exampleCaption: 'Dramatic nighttime transformation',
      th: { label: '🌙 ฉากกลางคืน', caption: 'แปลงฉากเป็นกลางคืนสุดดราม่าติก' },
    },
    {
      id: 'ie-4',
      label: '🍂 Autumn Colors',
      prompt: 'Change the season to autumn, add warm orange and red leaves, misty morning atmosphere, cozy fall feeling',
      exampleImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      exampleCaption: 'Beautiful autumn season transformation',
      th: { label: '🍂 โทนใบไม้ร่วง', caption: 'เปลี่ยนฤดูเป็นใบไม้ร่วงสวยอบอุ่น' },
    },
    {
      id: 'ie-5',
      label: '📸 Studio Look',
      prompt: 'Make it look like a professional studio photograph, clean white background, soft box lighting, sharp focus, commercial quality',
      exampleImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
      exampleCaption: 'Professional studio photography style',
      th: { label: '📸 ลุคสตูดิโอ', caption: 'สไตล์ภาพถ่ายสตูดิโอระดับมืออาชีพ' },
    },
  ],

  // ─── 3. REMOVE BACKGROUND ─────────────────────────────────────────────────
  'remove-bg': [
    {
      id: 'rb-1',
      label: '🛍️ Product Photo',
      prompt: 'Remove background completely for clean product photography, perfect transparent edges, ready for e-commerce',
      exampleImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      exampleCaption: 'Clean product cutout for online store',
      th: { label: '🛍️ รูปสินค้า', caption: 'ไดคัทสินค้าสะอาดพร้อมลงร้านออนไลน์' },
    },
    {
      id: 'rb-2',
      label: '🪪 ID Photo',
      prompt: 'Remove background for passport or ID photo, maintain natural hair edges, clean professional result',
      exampleImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
      exampleCaption: 'Perfect portrait background removal',
      th: { label: '🪪 รูปติดบัตร', caption: 'ลบพื้นหลังรูปบุคคลเก็บขอบผมเนียน' },
    },
    {
      id: 'rb-3',
      label: '🎨 Sticker Art',
      prompt: 'Remove background to create a transparent sticker-ready image with clean edges and no artifacts',
      exampleImage: 'https://images.unsplash.com/photo-1608889175638-9322300c46e8?w=600&q=80',
      exampleCaption: 'Transparent sticker-ready cutout',
      th: { label: '🎨 สติกเกอร์', caption: 'ไดคัทพื้นใสพร้อมทำสติกเกอร์' },
    },
    {
      id: 'rb-4',
      label: '👔 LinkedIn Photo',
      prompt: 'Remove background for professional headshot, replace with clean white or light gradient, business profile ready',
      exampleImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
      exampleCaption: 'Professional headshot background removal',
      th: { label: '👔 รูปโปรไฟล์งาน', caption: 'รูปโปรไฟล์ธุรกิจพื้นหลังขาวสะอาด' },
    },
    {
      id: 'rb-5',
      label: '🌿 Nature Object',
      prompt: 'Remove background from a natural object like a flower or leaf, preserve fine details and textures',
      exampleImage: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9d?w=600&q=80',
      exampleCaption: 'Detailed natural object isolation',
      th: { label: '🌿 วัตถุธรรมชาติ', caption: 'แยกวัตถุธรรมชาติเก็บรายละเอียดครบ' },
    },
  ],

  // ─── 4. UPSCALE IMAGE ─────────────────────────────────────────────────────
  'upscale': [
    {
      id: 'up-1',
      label: '🖼️ 4K Enhance',
      prompt: 'Upscale to 4K resolution, enhance sharpness and detail, improve clarity without artifacts',
      exampleImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      exampleCaption: 'Crisp 4K upscaled landscape',
      th: { label: '🖼️ ขยายเป็น 4K', caption: 'ขยายภาพคมชัดระดับ 4K' },
    },
    {
      id: 'up-2',
      label: '👴 Old Photo Restore',
      prompt: 'Restore old blurry photograph to HD quality, remove grain and noise, sharpen facial features',
      exampleImage: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600&q=80',
      exampleCaption: 'Restored vintage photo clarity',
      th: { label: '👴 ฟื้นฟูรูปเก่า', caption: 'กู้รูปเก่าเบลอให้กลับมาคมชัด' },
    },
    {
      id: 'up-3',
      label: '🌃 Night Photo',
      prompt: 'Enhance low-light night photo, reduce noise, upscale resolution, bring out hidden details in shadows',
      exampleImage: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&q=80',
      exampleCaption: 'Enhanced low-light night photograph',
      th: { label: '🌃 รูปกลางคืน', caption: 'ฟื้นรายละเอียดภาพถ่ายแสงน้อย' },
    },
    {
      id: 'up-4',
      label: '🖨️ Print Quality',
      prompt: 'Upscale small social media image to print-ready quality, 300 DPI equivalent, sharp and detailed',
      exampleImage: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
      exampleCaption: 'Print-quality image upscaling',
      th: { label: '🖨️ คุณภาพงานพิมพ์', caption: 'ขยายภาพให้พร้อมพิมพ์คมชัด' },
    },
    {
      id: 'up-5',
      label: '😊 Portrait HD',
      prompt: 'Upscale portrait photo, enhance skin texture naturally, sharpen eyes and hair detail, professional quality',
      exampleImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
      exampleCaption: 'High-definition portrait enhancement',
      th: { label: '😊 พอร์ตเทรต HD', caption: 'ขยายรูปบุคคลผิวเนียนตาคมธรรมชาติ' },
    },
  ],

  // ─── 5. STYLIZE IMAGE ─────────────────────────────────────────────────────
  'stylize': [
    {
      id: 'st-1',
      label: '🎌 Ghibli Style',
      prompt: 'Transform into Studio Ghibli anime art style, soft warm colors, hand-painted feel, magical and dreamlike atmosphere',
      exampleImage: 'https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=600&q=80',
      exampleCaption: 'Magical Studio Ghibli art transformation',
      th: { label: '🎌 สไตล์จิบลิ', caption: 'แปลงภาพเป็นอาร์ตอนิเมะจิบลิสุดละมุน' },
    },
    {
      id: 'st-2',
      label: '🖌️ Oil Painting',
      prompt: 'Convert to classic oil painting style, rich textures, brushstroke details, Old Masters technique, museum quality',
      exampleImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
      exampleCaption: 'Classic oil painting transformation',
      th: { label: '🖌️ ภาพสีน้ำมัน', caption: 'แปลงเป็นภาพวาดสีน้ำมันคลาสสิก' },
    },
    {
      id: 'st-3',
      label: '🎨 Watercolor',
      prompt: 'Apply soft watercolor illustration style, gentle color bleeds, paper texture visible, artistic and delicate',
      exampleImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
      exampleCaption: 'Soft watercolor illustration style',
      th: { label: '🎨 สีน้ำ', caption: 'สไตล์ภาพวาดสีน้ำอ่อนโยนมีศิลปะ' },
    },
    {
      id: 'st-4',
      label: '📷 Film Vintage',
      prompt: 'Make it look like an authentic vintage 35mm film photograph, film grain, muted tones, light leaks, nostalgic 1970s feel',
      exampleImage: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=600&q=80',
      exampleCaption: 'Authentic vintage film photograph',
      th: { label: '📷 ฟิล์มวินเทจ', caption: 'ภาพถ่ายฟิล์ม 35mm ย้อนยุคขนานแท้' },
    },
    {
      id: 'st-5',
      label: '🌆 Cyberpunk',
      prompt: 'Apply cyberpunk neon art style, electric blue and magenta colors, glitch effects, futuristic dystopian atmosphere',
      exampleImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      exampleCaption: 'Neon cyberpunk stylized artwork',
      th: { label: '🌆 ไซเบอร์พังก์', caption: 'อาร์ตนีออนไซเบอร์พังก์สุดล้ำ' },
    },
  ],

  // ─── 6. GENERATE TEXT ─────────────────────────────────────────────────────
  'text-gen': [
    {
      id: 'tg-1',
      label: '💼 LinkedIn Post',
      prompt: 'Write a professional and engaging LinkedIn post about the impact of AI on the creative industry in 2025, include 3 key insights and end with a question to spark discussion',
      exampleImage: undefined,
      exampleCaption: '📝 Professional LinkedIn post with insights, hashtags, and engagement hook',
      th: {
        label: '💼 โพสต์ LinkedIn',
        prompt: 'เขียนโพสต์ LinkedIn ภาษาไทยแบบมืออาชีพและน่าติดตาม เกี่ยวกับผลกระทบของ AI ต่อวงการครีเอทีฟในปี 2025 ใส่ข้อคิดสำคัญ 3 ข้อ และจบด้วยคำถามชวนคิดเพื่อกระตุ้นการแสดงความเห็น',
        caption: '📝 โพสต์ LinkedIn มืออาชีพ พร้อมข้อคิดและประโยคชวนคุย',
      },
    },
    {
      id: 'tg-2',
      label: '🛒 Product Copy',
      prompt: 'Write a compelling product description for a premium wireless noise-canceling headphone. Highlight: 40-hour battery, studio-quality sound, foldable design. Target audience: remote workers and music lovers.',
      exampleImage: undefined,
      exampleCaption: '📝 Persuasive e-commerce product description with features and benefits',
      th: {
        label: '🛒 ก็อปปี้ขายสินค้า',
        prompt: 'เขียนคำอธิบายสินค้าภาษาไทยที่ชวนซื้อ สำหรับหูฟังไร้สายตัดเสียงรบกวนระดับพรีเมียม จุดเด่น: แบตเตอรี่ 40 ชั่วโมง เสียงระดับสตูดิโอ พับเก็บได้ กลุ่มเป้าหมาย: คนทำงานทางไกลและคนรักเสียงเพลง',
        caption: '📝 คำอธิบายสินค้าโน้มน้าวใจ ครบฟีเจอร์และประโยชน์',
      },
    },
    {
      id: 'tg-3',
      label: '📖 Short Story',
      prompt: 'Write a captivating 200-word short story about a robot who discovers music for the first time and begins to feel emotions. Make it heartwarming and thought-provoking.',
      exampleImage: undefined,
      exampleCaption: '📝 Heartwarming 200-word short story with emotional arc',
      th: {
        label: '📖 เรื่องสั้น',
        prompt: 'เขียนเรื่องสั้นภาษาไทยความยาวประมาณ 200 คำ เกี่ยวกับหุ่นยนต์ที่ค้นพบเสียงดนตรีเป็นครั้งแรกแล้วเริ่มรู้สึกถึงอารมณ์ ให้อบอุ่นหัวใจและชวนขบคิด',
        caption: '📝 เรื่องสั้นอบอุ่นหัวใจ 200 คำ มีพัฒนาการทางอารมณ์',
      },
    },
    {
      id: 'tg-4',
      label: '🚀 App Taglines',
      prompt: 'Generate 5 creative and memorable taglines for a mobile AI image generation app called "Rnai". The app lets anyone create stunning visuals instantly. Make each tagline unique and punchy.',
      exampleImage: undefined,
      exampleCaption: '📝 5 unique, punchy taglines for a mobile app',
      th: {
        label: '🚀 สโลแกนแอป',
        prompt: 'คิดสโลแกนภาษาไทย 5 แบบที่สร้างสรรค์และจำง่าย สำหรับแอปสร้างภาพด้วย AI ชื่อ "Rnai" ที่ให้ทุกคนสร้างภาพสวยๆ ได้ในพริบตา แต่ละสโลแกนต้องไม่ซ้ำกันและกระชับโดนใจ',
        caption: '📝 สโลแกน 5 แบบ สั้น กระชับ จำง่าย',
      },
    },
    {
      id: 'tg-5',
      label: '✉️ Business Email',
      prompt: 'Write a formal email to request a 30-minute meeting with a potential investor at a tech conference. Express genuine interest in their portfolio, briefly introduce the company Rnai.io, and propose 3 available time slots.',
      exampleImage: undefined,
      exampleCaption: '📝 Professional investor outreach email with clear CTA',
      th: {
        label: '✉️ อีเมลธุรกิจ',
        prompt: 'เขียนอีเมลภาษาไทยแบบทางการ เพื่อขอนัดประชุม 30 นาทีกับนักลงทุนที่งานสัมมนาเทคโนโลยี แสดงความสนใจในพอร์ตการลงทุนของเขาอย่างจริงใจ แนะนำบริษัท Rnai.io สั้นๆ และเสนอช่วงเวลานัด 3 ตัวเลือก',
        caption: '📝 อีเมลติดต่อนักลงทุนแบบมืออาชีพ พร้อมข้อเสนอชัดเจน',
      },
    },
  ],

  // ─── 7. SUMMARIZE TEXT ────────────────────────────────────────────────────
  'text-sum': [
    {
      id: 'ts-1',
      label: '📰 3 Bullet Points',
      prompt: 'Summarize the following text into exactly 3 clear and concise bullet points. Focus on the most important facts and key takeaways. Start each point with an action verb.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 3 focused bullet points capturing main ideas',
      th: {
        label: '📰 สรุป 3 ข้อ',
        prompt: 'สรุปข้อความต่อไปนี้ให้เหลือ 3 ข้อสั้นกระชับ เน้นข้อเท็จจริงและประเด็นสำคัญที่สุด ขึ้นต้นแต่ละข้อด้วยคำกริยา\n\n[วางข้อความของคุณที่นี่]',
        caption: '📋 สรุปประเด็นหลัก 3 ข้อ ชัดเจนตรงจุด',
      },
    },
    {
      id: 'ts-2',
      label: '⚡ TL;DR',
      prompt: 'Create a TL;DR (Too Long; Didn\'t Read) summary of the following text in 2-3 sentences maximum. Make it punchy and capture the absolute essence.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 Ultra-short 2-3 sentence summary',
      th: {
        label: '⚡ สรุปสั้นสุดๆ',
        prompt: 'สรุปแบบสั้นที่สุด (TL;DR) ของข้อความต่อไปนี้ ไม่เกิน 2-3 ประโยค ให้กระชับและเก็บใจความสำคัญที่สุดไว้ครบ\n\n[วางข้อความของคุณที่นี่]',
        caption: '📋 สรุปจบใน 2-3 ประโยค',
      },
    },
    {
      id: 'ts-3',
      label: '📊 Executive Summary',
      prompt: 'Write a one-paragraph executive summary of the following content. Suitable for a business audience. Include: main purpose, key findings, and recommended action.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 Business-ready executive summary paragraph',
      th: {
        label: '📊 บทสรุปผู้บริหาร',
        prompt: 'เขียนบทสรุปผู้บริหาร (Executive Summary) หนึ่งย่อหน้าจากเนื้อหาต่อไปนี้ ให้เหมาะกับผู้อ่านสายธุรกิจ ครอบคลุม: วัตถุประสงค์หลัก ข้อค้นพบสำคัญ และข้อเสนอแนะ\n\n[วางข้อความของคุณที่นี่]',
        caption: '📋 บทสรุปย่อหน้าเดียวพร้อมนำเสนอผู้บริหาร',
      },
    },
    {
      id: 'ts-4',
      label: '✅ Action Items',
      prompt: 'Extract all action items and next steps from the following meeting notes or document. Format as a numbered checklist with owner names if mentioned and deadlines if specified.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 Numbered checklist of action items and owners',
      th: {
        label: '✅ สิ่งที่ต้องทำ',
        prompt: 'ดึงรายการสิ่งที่ต้องทำ (action items) และขั้นตอนถัดไปทั้งหมดจากบันทึกการประชุมหรือเอกสารต่อไปนี้ จัดเป็นเช็คลิสต์แบบมีลำดับเลข ระบุชื่อผู้รับผิดชอบและกำหนดส่งถ้ามี\n\n[วางข้อความของคุณที่นี่]',
        caption: '📋 เช็คลิสต์งานพร้อมผู้รับผิดชอบ',
      },
    },
    {
      id: 'ts-5',
      label: '🔑 Key Insights',
      prompt: 'Identify and explain the 5 most important insights from the following research or article. For each insight, explain WHY it matters in one sentence.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 5 key insights with explanation of impact',
      th: {
        label: '🔑 ประเด็นสำคัญ',
        prompt: 'ระบุและอธิบายข้อค้นพบสำคัญที่สุด 5 ประการจากงานวิจัยหรือบทความต่อไปนี้ พร้อมอธิบายว่าแต่ละข้อ "สำคัญเพราะอะไร" ในหนึ่งประโยค\n\n[วางข้อความของคุณที่นี่]',
        caption: '📋 5 ข้อค้นพบสำคัญพร้อมเหตุผล',
      },
    },
  ],

  // ─── 8. TRANSLATE TEXT ────────────────────────────────────────────────────
  'text-trans': [
    {
      id: 'tt-1',
      label: '🇹🇭 → 🇺🇸 Thai to English',
      prompt: 'Translate the following Thai text to English. Maintain natural phrasing and professional tone. If there are cultural references, add a brief explanation in brackets.\n\n[วางข้อความภาษาไทยที่นี่]',
      exampleImage: undefined,
      exampleCaption: '🌐 Natural English translation with cultural context preserved',
      th: {
        label: '🇹🇭 → 🇺🇸 ไทยเป็นอังกฤษ',
        prompt: 'แปลข้อความภาษาไทยต่อไปนี้เป็นภาษาอังกฤษ ใช้สำนวนที่เป็นธรรมชาติและโทนมืออาชีพ หากมีบริบททางวัฒนธรรมให้เพิ่มคำอธิบายสั้นๆ ในวงเล็บ\n\n[วางข้อความภาษาไทยที่นี่]',
        caption: '🌐 แปลอังกฤษลื่นไหล เก็บบริบทวัฒนธรรมครบ',
      },
    },
    {
      id: 'tt-2',
      label: '🇺🇸 → 🇹🇭 English to Thai',
      prompt: 'Translate the following English text to Thai. Use natural Thai phrasing that sounds like it was written by a native speaker, not a literal translation.\n\n[Paste English text here]',
      exampleImage: undefined,
      exampleCaption: '🌐 Natural-sounding Thai translation',
      th: {
        label: '🇺🇸 → 🇹🇭 อังกฤษเป็นไทย',
        prompt: 'แปลข้อความภาษาอังกฤษต่อไปนี้เป็นภาษาไทย ใช้ภาษาที่เป็นธรรมชาติเหมือนคนไทยเขียนเอง ไม่ใช่การแปลตรงตัวคำต่อคำ\n\n[วางข้อความภาษาอังกฤษที่นี่]',
        caption: '🌐 แปลไทยอ่านลื่นเหมือนเจ้าของภาษาเขียน',
      },
    },
    {
      id: 'tt-3',
      label: '🇯🇵 Japanese',
      prompt: 'Translate the following text to Japanese (日本語). Use appropriate formality level (です/ます form for business, casual for informal). Include furigana for complex kanji.\n\n[Paste text here]',
      exampleImage: undefined,
      exampleCaption: '🌐 Proper Japanese with correct formality level',
      th: {
        label: '🇯🇵 ภาษาญี่ปุ่น',
        prompt: 'แปลข้อความต่อไปนี้เป็นภาษาญี่ปุ่น (日本語) เลือกระดับความสุภาพให้เหมาะสม (รูป です/ます สำหรับงานธุรกิจ, ภาษาพูดสำหรับบริบทสบายๆ) ใส่ฟุริงานะกำกับคันจิที่อ่านยาก\n\n[วางข้อความที่นี่]',
        caption: '🌐 ภาษาญี่ปุ่นถูกระดับความสุภาพ',
      },
    },
    {
      id: 'tt-4',
      label: '🇨🇳 Chinese',
      prompt: 'Translate the following text to Simplified Chinese (简体中文). Ensure idiomatic Chinese expressions are used rather than direct translations.\n\n[Paste text here]',
      exampleImage: undefined,
      exampleCaption: '🌐 Idiomatic Simplified Chinese translation',
      th: {
        label: '🇨🇳 ภาษาจีน',
        prompt: 'แปลข้อความต่อไปนี้เป็นภาษาจีนตัวย่อ (简体中文) ใช้สำนวนจีนแท้ที่เจ้าของภาษาใช้จริง ไม่ใช่การแปลตรงตัว\n\n[วางข้อความที่นี่]',
        caption: '🌐 ภาษาจีนตัวย่อสำนวนเจ้าของภาษา',
      },
    },
    {
      id: 'tt-5',
      label: '🇪🇸 Spanish',
      prompt: 'Translate the following marketing text to Latin American Spanish. Use modern, engaging language that resonates with a young adult audience. Keep brand voice consistent.\n\n[Paste text here]',
      exampleImage: undefined,
      exampleCaption: '🌐 Engaging Latin American Spanish marketing copy',
      th: {
        label: '🇪🇸 ภาษาสเปน',
        prompt: 'แปลข้อความการตลาดต่อไปนี้เป็นภาษาสเปนแบบลาตินอเมริกา ใช้ภาษาทันสมัยที่โดนใจกลุ่มวัยรุ่น-วัยทำงาน คงน้ำเสียงของแบรนด์ไว้\n\n[วางข้อความที่นี่]',
        caption: '🌐 ก็อปปี้การตลาดภาษาสเปนโดนใจวัยรุ่น',
      },
    },
  ],

  // ─── 9. REWRITE TEXT ──────────────────────────────────────────────────────
  'text-rewrite': [
    {
      id: 'tr-1',
      label: '💼 More Professional',
      prompt: 'Rewrite the following text in a more professional and formal tone. Eliminate casual language, improve vocabulary, and ensure it sounds polished for a business setting.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ Polished, business-ready professional version',
      th: {
        label: '💼 เป็นทางการขึ้น',
        prompt: 'เรียบเรียงข้อความต่อไปนี้ใหม่ให้เป็นทางการและมืออาชีพมากขึ้น ตัดภาษาพูดออก ยกระดับการใช้คำ ให้เหมาะกับบริบทธุรกิจ\n\n[วางข้อความของคุณที่นี่]',
        caption: '✏️ ฉบับขัดเกลา พร้อมใช้ในงานธุรกิจ',
      },
    },
    {
      id: 'tr-2',
      label: '😊 More Friendly',
      prompt: 'Rewrite the following text to be warmer, more conversational and approachable. Keep the information but make it feel like a friendly conversation, not a formal document.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ Warm, conversational rewrite that connects with readers',
      th: {
        label: '😊 เป็นกันเองขึ้น',
        prompt: 'เรียบเรียงข้อความต่อไปนี้ใหม่ให้อบอุ่น เป็นกันเอง และเข้าถึงง่ายขึ้น คงข้อมูลเดิมไว้ครบ แต่ให้อ่านแล้วรู้สึกเหมือนคุยกับเพื่อน ไม่ใช่เอกสารทางการ\n\n[วางข้อความของคุณที่นี่]',
        caption: '✏️ ฉบับอ่านสบาย เข้าถึงใจผู้อ่าน',
      },
    },
    {
      id: 'tr-3',
      label: '✂️ Shorter (50%)',
      prompt: 'Rewrite the following text to be at least 50% shorter. Remove redundancy, combine sentences, and keep only the essential information. Every word must earn its place.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ Concise rewrite with 50% fewer words, same meaning',
      th: {
        label: '✂️ สั้นลง 50%',
        prompt: 'เรียบเรียงข้อความต่อไปนี้ให้สั้นลงอย่างน้อย 50% ตัดความซ้ำซ้อน รวมประโยค เก็บเฉพาะใจความจำเป็น ทุกคำต้องมีเหตุผลที่อยู่\n\n[วางข้อความของคุณที่นี่]',
        caption: '✏️ สั้นลงครึ่งหนึ่ง ความหมายครบเดิม',
      },
    },
    {
      id: 'tr-4',
      label: '🎯 SEO Optimized',
      prompt: 'Rewrite the following text to be SEO-optimized. Add relevant keywords naturally, improve readability with short paragraphs, include a compelling intro and CTA at the end.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ SEO-friendly version with keywords and better structure',
      th: {
        label: '🎯 ปรับ SEO',
        prompt: 'เรียบเรียงข้อความต่อไปนี้ให้เป็นมิตรกับ SEO แทรกคีย์เวิร์ดที่เกี่ยวข้องอย่างเป็นธรรมชาติ แบ่งย่อหน้าสั้นอ่านง่าย ใส่บทนำที่ดึงดูดและ CTA ปิดท้าย\n\n[วางข้อความของคุณที่นี่]',
        caption: '✏️ ฉบับ SEO มีคีย์เวิร์ดและโครงสร้างดีขึ้น',
      },
    },
    {
      id: 'tr-5',
      label: '🚀 Marketing Style',
      prompt: 'Rewrite the following text in an exciting, persuasive marketing style. Use power words, create urgency, highlight benefits not features, and inspire the reader to take action.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ High-energy marketing copy that drives action',
      th: {
        label: '🚀 สไตล์การตลาด',
        prompt: 'เรียบเรียงข้อความต่อไปนี้ใหม่ในสไตล์การตลาดที่เร้าใจและโน้มน้าว ใช้คำทรงพลัง สร้างความรู้สึกเร่งด่วน เน้นประโยชน์มากกว่าฟีเจอร์ และกระตุ้นให้ผู้อ่านลงมือทำ\n\n[วางข้อความของคุณที่นี่]',
        caption: '✏️ ก็อปปี้การตลาดพลังสูง กระตุ้นการตัดสินใจ',
      },
    },
  ],

  // ─── 10. GENERATE WEBSITE ─────────────────────────────────────────────────
  'website-gen': [
    {
      id: 'wg-1',
      label: '🎨 Designer Portfolio',
      prompt: 'Modern dark-theme portfolio website for a UX/UI designer. Sections: Hero with animated tagline, About, Skills (with progress bars), Featured Projects (3 case studies), and Contact form. Use purple and cyan accent colors.',
      exampleImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
      exampleCaption: 'Dark-themed designer portfolio with modern UI',
      th: {
        label: '🎨 พอร์ตดีไซเนอร์',
        prompt: 'เว็บไซต์พอร์ตโฟลิโอธีมมืดสมัยใหม่สำหรับนักออกแบบ UX/UI ประกอบด้วย: Hero พร้อมสโลแกนแบบแอนิเมชัน, เกี่ยวกับฉัน, ทักษะ (มีแถบความชำนาญ), ผลงานเด่น 3 ชิ้น และฟอร์มติดต่อ ใช้สีม่วงและฟ้าน้ำทะเลเป็นสีหลัก เนื้อหาภาษาไทย',
        caption: 'พอร์ตโฟลิโอธีมมืด UI ทันสมัย',
      },
    },
    {
      id: 'wg-2',
      label: '🍽️ Restaurant Page',
      prompt: 'Elegant restaurant landing page for an Italian fine dining restaurant called "La Cucina". Include: hero with food photography, featured menu section, chef story, reservation form, and Google Maps embed. Warm earthy tones.',
      exampleImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
      exampleCaption: 'Elegant restaurant website with reservation system',
      th: {
        label: '🍽️ เว็บร้านอาหาร',
        prompt: 'หน้าเว็บร้านอาหารไทยไฟน์ไดนิ่งชื่อ "เรือนไทย" สไตล์หรูหรา ประกอบด้วย: Hero รูปอาหารสวยๆ, เมนูแนะนำ, เรื่องราวของเชฟ, ฟอร์มจองโต๊ะ และแผนที่ Google Maps โทนสีอบอุ่นแบบเอิร์ธโทน เนื้อหาภาษาไทย',
        caption: 'เว็บร้านอาหารหรูพร้อมระบบจองโต๊ะ',
      },
    },
    {
      id: 'wg-3',
      label: '💻 SaaS Landing',
      prompt: 'High-converting SaaS landing page for an AI writing tool. Include: hero with product demo GIF, 3 key features, social proof (testimonials + logos), pricing table (3 tiers), FAQ, and signup CTA. Clean white and blue design.',
      exampleImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      exampleCaption: 'Conversion-optimized SaaS product landing page',
      th: {
        label: '💻 หน้า SaaS',
        prompt: 'หน้า Landing Page สำหรับ SaaS เครื่องมือเขียนด้วย AI ที่เน้นการแปลงผู้เข้าชมเป็นลูกค้า ประกอบด้วย: Hero พร้อมเดโมสินค้า, ฟีเจอร์เด่น 3 ข้อ, รีวิวจากผู้ใช้และโลโก้ลูกค้า, ตารางราคา 3 แพ็กเกจ, FAQ และปุ่มสมัคร ดีไซน์ขาว-น้ำเงินสะอาดตา เนื้อหาภาษาไทย',
        caption: 'Landing Page SaaS เน้นปิดการขาย',
      },
    },
    {
      id: 'wg-4',
      label: '📸 Photo Blog',
      prompt: 'Personal photography blog for a travel photographer. Masonry grid photo gallery, travel stories blog section, destination map, Instagram feed widget, and newsletter signup. Light airy aesthetic with serif fonts.',
      exampleImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80',
      exampleCaption: 'Beautiful travel photography blog with gallery',
      th: {
        label: '📸 บล็อกภาพถ่าย',
        prompt: 'บล็อกภาพถ่ายส่วนตัวของช่างภาพสายท่องเที่ยว มีแกลเลอรีแบบ masonry grid, บทความเล่าเรื่องการเดินทาง, แผนที่จุดหมายปลายทาง, วิดเจ็ตฟีด Instagram และฟอร์มรับจดหมายข่าว สไตล์โปร่งสบายใช้ฟอนต์ serif เนื้อหาภาษาไทย',
        caption: 'บล็อกท่องเที่ยวพร้อมแกลเลอรีสวยงาม',
      },
    },
    {
      id: 'wg-5',
      label: '🛍️ Product Store',
      prompt: 'E-commerce product page for handmade artisan ceramic jewelry. Product image gallery, size/color selector, customer reviews (4.8 stars), related products, and secure checkout section. Minimalist warm beige theme.',
      exampleImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
      exampleCaption: 'Elegant product page with reviews and gallery',
      th: {
        label: '🛍️ หน้าร้านค้า',
        prompt: 'หน้าสินค้าอีคอมเมิร์ซสำหรับเครื่องประดับเซรามิกแฮนด์เมด มีแกลเลอรีรูปสินค้า, ตัวเลือกขนาด/สี, รีวิวลูกค้า (4.8 ดาว), สินค้าที่เกี่ยวข้อง และส่วนชำระเงินปลอดภัย ธีมมินิมอลโทนเบจอบอุ่น เนื้อหาภาษาไทย',
        caption: 'หน้าสินค้าสวยหรูพร้อมรีวิวและแกลเลอรี',
      },
    },
  ],

  // ─── 12. DESCRIBE / ANALYZE IMAGE ────────────────────────────────────────
  'image-describe': [
    {
      id: 'id-1', label: '🔍 Full Analysis',
      prompt: 'Describe everything you see in this image in detail: objects, people, colors, composition, mood, and any text visible.',
      exampleCaption: '📋 Detailed scene analysis covering all visual elements',
      th: { label: '🔍 วิเคราะห์ครบ', caption: 'อธิบายทุกองค์ประกอบในภาพอย่างละเอียด' },
    },
    {
      id: 'id-2', label: '🏷️ Identify Objects',
      prompt: 'List all objects, items, and elements you can identify in this image with their approximate positions.',
      exampleCaption: '📋 Object inventory with positions',
      th: { label: '🏷️ ระบุวัตถุ', caption: 'ระบุวัตถุและตำแหน่งในภาพทั้งหมด' },
    },
    {
      id: 'id-3', label: '🎨 Color & Style',
      prompt: 'Analyze the color palette, artistic style, composition techniques, and overall aesthetic of this image.',
      exampleCaption: '📋 Color palette and artistic style breakdown',
      th: { label: '🎨 สีและสไตล์', caption: 'วิเคราะห์จานสีและสไตล์ศิลปะ' },
    },
    {
      id: 'id-4', label: '📝 Read Text',
      prompt: 'Extract and transcribe all text visible in this image exactly as it appears, including signs, labels, and captions.',
      exampleCaption: '📋 All text extracted from the image',
      th: { label: '📝 อ่านข้อความ', caption: 'ถอดข้อความทั้งหมดที่มองเห็นในภาพ' },
    },
    {
      id: 'id-5', label: '📊 Product Review',
      prompt: 'Analyze this product image for e-commerce: describe the product, its condition, key features visible, and suggest improvements for the listing photo.',
      exampleCaption: '📋 E-commerce product image analysis',
      th: { label: '📊 วิเคราะห์สินค้า', caption: 'วิเคราะห์ภาพสินค้าเพื่อ e-commerce' },
    },
  ],

  // ─── 13. FACE RESTORE ─────────────────────────────────────────────────────
  'face-restore': [
    {
      id: 'fr-1', label: '👴 Old Photo',
      prompt: 'Restore and enhance faces in this old, damaged, or faded photograph to crisp, clear HD quality.',
      exampleImage: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600&q=80',
      exampleCaption: '✨ Old photograph face restoration to HD clarity',
      th: { label: '👴 รูปเก่า', caption: 'ฟื้นฟูใบหน้าในรูปเก่าให้คมชัด HD' },
    },
    {
      id: 'fr-2', label: '🌫️ Blurry Portrait',
      prompt: 'Sharpen and restore blurry or out-of-focus faces in this portrait photo.',
      exampleImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
      exampleCaption: '✨ Blurry portrait sharpened and restored',
      th: { label: '🌫️ รูปเบลอ', caption: 'แก้รูปบุคคลเบลอให้คมชัด' },
    },
    {
      id: 'fr-3', label: '📸 Low Resolution',
      prompt: 'Enhance and upscale the faces in this low-resolution photo to high definition quality.',
      exampleImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      exampleCaption: '✨ Low-res face enhanced to high definition',
      th: { label: '📸 รูปความละเอียดต่ำ', caption: 'ขยายใบหน้าในรูปความละเอียดต่ำให้ HD' },
    },
    {
      id: 'fr-4', label: '🌙 Dark/Night Photo',
      prompt: 'Restore faces that are poorly lit, dark, or taken in low-light conditions.',
      exampleImage: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&q=80',
      exampleCaption: '✨ Dark photo face brightened and restored',
      th: { label: '🌙 รูปมืด', caption: 'ฟื้นฟูใบหน้าในรูปแสงน้อย' },
    },
    {
      id: 'fr-5', label: '👨‍👩‍👧 Group Photo',
      prompt: 'Restore and enhance all faces in this group photo, improving clarity and detail for every person.',
      exampleImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
      exampleCaption: '✨ Group photo with all faces restored',
      th: { label: '👨‍👩‍👧 รูปหมู่', caption: 'ฟื้นฟูทุกใบหน้าในรูปถ่ายหมู่' },
    },
  ],

  // ─── 14. GRAMMAR CHECK ────────────────────────────────────────────────────
  'text-grammar': [
    {
      id: 'tgr-1', label: '✏️ Quick Fix',
      prompt: 'Check and correct all grammar, spelling, and punctuation errors in the following text. Show the corrected version.\n\n[Paste your text here]',
      exampleCaption: '✅ Corrected text with all errors fixed',
      th: {
        label: '✏️ แก้ด่วน',
        prompt: 'ตรวจสอบและแก้ไขข้อผิดพลาดด้านไวยากรณ์ การสะกดคำ และเครื่องหมายวรรคตอนทั้งหมดในข้อความต่อไปนี้\n\n[วางข้อความของคุณที่นี่]',
        caption: '✅ ข้อความที่ได้รับการแก้ไขครบทุกข้อผิดพลาด',
      },
    },
    {
      id: 'tgr-2', label: '📋 With Explanations',
      prompt: 'Correct this text and explain each grammar error found. List the corrections with the rule that was violated.\n\n[Paste your text here]',
      exampleCaption: '✅ Corrected text plus explanation of each mistake',
      th: {
        label: '📋 พร้อมคำอธิบาย',
        prompt: 'แก้ไขข้อความนี้และอธิบายข้อผิดพลาดทางไวยากรณ์ที่พบ พร้อมระบุกฎที่ถูกละเมิด\n\n[วางข้อความของคุณที่นี่]',
        caption: '✅ ข้อความที่แก้ไขพร้อมคำอธิบายแต่ละข้อผิดพลาด',
      },
    },
    {
      id: 'tgr-3', label: '🇹🇭 Thai Language',
      prompt: 'ตรวจสอบข้อความภาษาไทยต่อไปนี้ แก้ไขการสะกด วรรคตอน และไวยากรณ์ให้ถูกต้อง\n\n[วางข้อความภาษาไทยที่นี่]',
      exampleCaption: '✅ Thai text corrected and polished',
      th: {
        label: '🇹🇭 ภาษาไทย',
        prompt: 'ตรวจสอบข้อความภาษาไทยต่อไปนี้ แก้ไขการสะกด วรรคตอน และไวยากรณ์ให้ถูกต้อง\n\n[วางข้อความภาษาไทยที่นี่]',
        caption: '✅ ข้อความภาษาไทยถูกต้องและขัดเกลา',
      },
    },
    {
      id: 'tgr-4', label: '📧 Email Polish',
      prompt: 'Fix all grammar and spelling in this email, and also improve the overall professional tone while keeping the original meaning.\n\n[Paste email here]',
      exampleCaption: '✅ Professional email with perfect grammar',
      th: {
        label: '📧 ขัดเกลาอีเมล',
        prompt: 'แก้ไขไวยากรณ์และการสะกดในอีเมลนี้ และปรับโทนให้เป็นมืออาชีพมากขึ้น โดยยังคงความหมายเดิมไว้\n\n[วางอีเมลที่นี่]',
        caption: '✅ อีเมลมืออาชีพไวยากรณ์สมบูรณ์',
      },
    },
    {
      id: 'tgr-5', label: '📝 Essay Review',
      prompt: 'Review this essay for grammar, coherence, and clarity. Fix errors and suggest improvements for sentence structure and flow.\n\n[Paste essay here]',
      exampleCaption: '✅ Essay reviewed with grammar and flow improvements',
      th: {
        label: '📝 ตรวจเรียงความ',
        prompt: 'ตรวจสอบเรียงความนี้ด้านไวยากรณ์ ความต่อเนื่อง และความชัดเจน แก้ไขข้อผิดพลาดและเสนอการปรับปรุงโครงสร้างประโยค\n\n[วางเรียงความที่นี่]',
        caption: '✅ เรียงความที่ผ่านการตรวจและปรับปรุงแล้ว',
      },
    },
  ],

  // ─── 15. CODE GENERATOR ───────────────────────────────────────────────────
  'text-code': [
    {
      id: 'tc-1', label: '⚛️ React Component',
      prompt: 'Write a React functional component for a responsive card with an image, title, description, and "Learn More" button. Use Tailwind CSS for styling. Include TypeScript types.',
      exampleCaption: '💻 Clean TypeScript React card component with Tailwind',
      th: {
        label: '⚛️ React Component',
        prompt: 'เขียน React functional component สำหรับการ์ดแบบ responsive มีรูปภาพ ชื่อ คำอธิบาย และปุ่ม "เรียนรู้เพิ่มเติม" ใช้ Tailwind CSS สำหรับ styling รวม TypeScript types',
        caption: '💻 React card component TypeScript พร้อม Tailwind',
      },
    },
    {
      id: 'tc-2', label: '🐍 Python Script',
      prompt: 'Write a Python script that reads a CSV file, calculates the average of a specified column, and generates a bar chart using matplotlib. Include error handling and docstrings.',
      exampleCaption: '💻 Python CSV analyzer with matplotlib chart',
      th: {
        label: '🐍 Python Script',
        prompt: 'เขียน Python script ที่อ่านไฟล์ CSV คำนวณค่าเฉลี่ยของคอลัมน์ที่กำหนด และสร้าง bar chart ด้วย matplotlib รวม error handling และ docstrings',
        caption: '💻 Python วิเคราะห์ CSV พร้อมกราฟ matplotlib',
      },
    },
    {
      id: 'tc-3', label: '🌐 REST API',
      prompt: 'Write a Node.js/Express REST API with GET, POST, PUT, DELETE endpoints for a "products" resource. Include middleware for error handling and input validation. Use async/await.',
      exampleCaption: '💻 Complete Express REST API with CRUD operations',
      th: {
        label: '🌐 REST API',
        prompt: 'เขียน Node.js/Express REST API พร้อม endpoint GET POST PUT DELETE สำหรับ "products" มี middleware สำหรับ error handling และ input validation ใช้ async/await',
        caption: '💻 Express REST API ครบ CRUD operations',
      },
    },
    {
      id: 'tc-4', label: '🗃️ SQL Query',
      prompt: 'Write SQL queries for an e-commerce database: 1) Get top 10 customers by total spend, 2) Find products with low stock (< 10 units), 3) Monthly revenue report for the past 12 months.',
      exampleCaption: '💻 E-commerce analytics SQL queries',
      th: {
        label: '🗃️ SQL Query',
        prompt: 'เขียน SQL queries สำหรับฐานข้อมูล e-commerce: 1) ลูกค้า 10 อันดับแรกตามยอดซื้อรวม 2) สินค้าที่ stock ต่ำ (< 10 ชิ้น) 3) รายงานรายได้รายเดือน 12 เดือนย้อนหลัง',
        caption: '💻 SQL queries วิเคราะห์ข้อมูล e-commerce',
      },
    },
    {
      id: 'tc-5', label: '📱 Expo Screen',
      prompt: 'Write a complete React Native / Expo screen for a user profile page with: avatar, name, email, edit button, and a settings list. Use StyleSheet for styling. TypeScript.',
      exampleCaption: '💻 Complete Expo profile screen component',
      th: {
        label: '📱 Expo Screen',
        prompt: 'เขียน React Native / Expo screen สมบูรณ์สำหรับหน้าโปรไฟล์ผู้ใช้ มี: avatar ชื่อ อีเมล ปุ่มแก้ไข และรายการตั้งค่า ใช้ StyleSheet TypeScript',
        caption: '💻 Expo profile screen component สมบูรณ์',
      },
    },
  ],

  // ─── 16. HASHTAG GENERATOR ────────────────────────────────────────────────
  'text-hashtag': [
    {
      id: 'th-1', label: '📸 Instagram Food',
      prompt: 'Generate 25 highly relevant and trending Instagram hashtags for a food photo at a Thai restaurant. Mix popular, medium, and niche hashtags. Include both English and Thai hashtags.',
      exampleCaption: '#️⃣ 25 food hashtags for maximum Instagram reach',
      th: {
        label: '📸 อาหาร Instagram',
        prompt: 'สร้าง hashtag Instagram ที่เกี่ยวข้องและกำลังเทรนด์ 25 อัน สำหรับรูปอาหารที่ร้านอาหารไทย ผสมระหว่าง hashtag ยอดนิยม ปานกลาง และเฉพาะกลุ่ม รวมทั้งภาษาไทยและอังกฤษ',
        caption: '#️⃣ 25 hashtag อาหารเพิ่มการเข้าถึง Instagram สูงสุด',
      },
    },
    {
      id: 'th-2', label: '💼 LinkedIn Business',
      prompt: 'Generate 15 professional LinkedIn hashtags for a post about startup entrepreneurship and AI technology trends in Southeast Asia.',
      exampleCaption: '#️⃣ 15 professional LinkedIn hashtags for business content',
      th: {
        label: '💼 LinkedIn ธุรกิจ',
        prompt: 'สร้าง hashtag LinkedIn แบบมืออาชีพ 15 อัน สำหรับโพสต์เกี่ยวกับ startup ผู้ประกอบการและเทรนด์เทคโนโลยี AI ในเอเชียตะวันออกเฉียงใต้',
        caption: '#️⃣ 15 hashtag LinkedIn มืออาชีพสำหรับเนื้อหาธุรกิจ',
      },
    },
    {
      id: 'th-3', label: '🎵 TikTok Viral',
      prompt: 'Generate 20 viral and trending TikTok hashtags for a travel video filmed in Thailand. Focus on hashtags with the potential to go viral with a younger audience.',
      exampleCaption: '#️⃣ 20 TikTok travel hashtags optimized for virality',
      th: {
        label: '🎵 TikTok ไวรัล',
        prompt: 'สร้าง hashtag TikTok ที่กำลังเทรนด์และมีโอกาสไวรัล 20 อัน สำหรับวิดีโอท่องเที่ยวที่ถ่ายในประเทศไทย เน้น hashtag ที่มีโอกาสเข้าถึงผู้ชมรุ่นใหม่',
        caption: '#️⃣ 20 hashtag TikTok ท่องเที่ยวที่มีโอกาสไวรัล',
      },
    },
    {
      id: 'th-4', label: '🛍️ E-Commerce Product',
      prompt: 'Generate hashtags for an e-commerce product post about handmade organic skincare. Include hashtags for: beauty, organic, skincare, sustainable, and Thai-made products.',
      exampleCaption: '#️⃣ Product hashtags covering beauty and organic niches',
      th: {
        label: '🛍️ สินค้า E-Commerce',
        prompt: 'สร้าง hashtag สำหรับโพสต์สินค้า e-commerce เกี่ยวกับสกินแคร์ออร์แกนิกแฮนด์เมด รวม hashtag สำหรับ: ความงาม ออร์แกนิก สกินแคร์ ยั่งยืน และสินค้าไทย',
        caption: '#️⃣ Hashtag สินค้าครอบคลุมกลุ่มความงามและออร์แกนิก',
      },
    },
    {
      id: 'th-5', label: '🎨 Creative Art',
      prompt: 'Generate hashtags for sharing AI-generated digital artwork on social media platforms. Include artist communities, AI art, and digital art hashtags.',
      exampleCaption: '#️⃣ Art hashtags for the AI and creative communities',
      th: {
        label: '🎨 งานศิลปะ Creative',
        prompt: 'สร้าง hashtag สำหรับแชร์งานศิลปะดิจิทัลที่สร้างด้วย AI บน social media รวม hashtag ชุมชนศิลปิน AI art และ digital art',
        caption: '#️⃣ Hashtag ศิลปะสำหรับชุมชน AI และครีเอทีฟ',
      },
    },
  ],

  // ─── 11. TEXT TO SPEECH ───────────────────────────────────────────────────
  'audio-tts': [
    {
      id: 'at-1',
      label: '📢 App Welcome',
      prompt: 'Welcome to Rnai! Your AI-powered creative assistant is ready to help you generate stunning images, write compelling content, and build beautiful websites — all with a single tap.',
      exampleImage: undefined,
      exampleCaption: '🔊 Warm welcome message for app onboarding (~8 sec)',
      th: {
        label: '📢 ต้อนรับผู้ใช้แอป',
        prompt: 'ยินดีต้อนรับสู่ Rnai! ผู้ช่วยสร้างสรรค์ด้วย AI ของคุณพร้อมแล้ว ที่จะช่วยสร้างภาพสวยตระการตา เขียนคอนเทนต์โดนใจ และสร้างเว็บไซต์สวยงาม ทั้งหมดนี้ในแตะเดียว',
        caption: '🔊 ข้อความต้อนรับอบอุ่นสำหรับเปิดแอป (~8 วินาที)',
      },
    },
    {
      id: 'at-2',
      label: '📦 Order Update',
      prompt: 'Great news! Your order number 12345 has been confirmed and is now being prepared. Estimated delivery is within 3 to 5 business days. You will receive a tracking link via email shortly.',
      exampleImage: undefined,
      exampleCaption: '🔊 Clear e-commerce order confirmation (~7 sec)',
      th: {
        label: '📦 แจ้งสถานะออเดอร์',
        prompt: 'ข่าวดีค่ะ! คำสั่งซื้อหมายเลข 12345 ของคุณได้รับการยืนยันแล้ว และกำลังจัดเตรียมสินค้า คาดว่าจะจัดส่งถึงภายใน 3 ถึง 5 วันทำการ คุณจะได้รับลิงก์ติดตามพัสดุทางอีเมลเร็วๆ นี้',
        caption: '🔊 เสียงยืนยันคำสั่งซื้อชัดเจน (~7 วินาที)',
      },
    },
    {
      id: 'at-3',
      label: '📖 Story Narration',
      prompt: 'Chapter One: In a world where technology and nature coexisted in perfect harmony, there lived a young inventor named Aria. Every morning, she would climb to the top of her glass workshop and watch the solar drones tend to the ancient forest below.',
      exampleImage: undefined,
      exampleCaption: '🔊 Engaging audiobook-style story narration (~12 sec)',
      th: {
        label: '📖 เสียงเล่าเรื่อง',
        prompt: 'บทที่หนึ่ง: ในโลกที่เทคโนโลยีและธรรมชาติอยู่ร่วมกันอย่างกลมกลืน มีนักประดิษฐ์สาวคนหนึ่งชื่ออาริยา ทุกเช้าเธอจะปีนขึ้นไปบนยอดเวิร์กช็อปกระจกของเธอ เฝ้ามองโดรนพลังแสงอาทิตย์ดูแลผืนป่าโบราณเบื้องล่าง',
        caption: '🔊 เสียงเล่าเรื่องสไตล์หนังสือเสียง (~12 วินาที)',
      },
    },
    {
      id: 'at-4',
      label: '📣 Ad Voiceover',
      prompt: 'Stop wasting time. Start creating. With Rnai, turn any idea into a stunning image in seconds. No design skills needed. No limits. Just your imagination. Try Rnai free today.',
      exampleImage: undefined,
      exampleCaption: '🔊 High-energy 15-second advertisement voiceover',
      th: {
        label: '📣 เสียงโฆษณา',
        prompt: 'หยุดเสียเวลา แล้วเริ่มสร้างสรรค์ กับ Rnai เปลี่ยนทุกไอเดียให้เป็นภาพสุดปังในไม่กี่วินาที ไม่ต้องมีพื้นฐานออกแบบ ไม่มีขีดจำกัด มีแค่จินตนาการของคุณ ลองใช้ Rnai ฟรีวันนี้',
        caption: '🔊 เสียงโฆษณาพลังสูง 15 วินาที',
      },
    },
    {
      id: 'at-5',
      label: '🎓 Course Intro',
      prompt: 'Welcome to Advanced AI Design Fundamentals. In this course, you will learn how to harness the power of artificial intelligence to create professional-grade visuals, automate your workflow, and stay ahead in the rapidly evolving creative industry.',
      exampleImage: undefined,
      exampleCaption: '🔊 Professional e-learning course introduction (~10 sec)',
      th: {
        label: '🎓 เปิดคอร์สเรียน',
        prompt: 'ยินดีต้อนรับสู่คอร์สพื้นฐานการออกแบบด้วย AI ขั้นสูง ในคอร์สนี้คุณจะได้เรียนรู้วิธีใช้พลังของปัญญาประดิษฐ์ เพื่อสร้างงานภาพระดับมืออาชีพ ทำงานอัตโนมัติ และก้าวนำในวงการครีเอทีฟที่เปลี่ยนแปลงอย่างรวดเร็ว',
        caption: '🔊 เสียงเปิดคอร์สออนไลน์มืออาชีพ (~10 วินาที)',
      },
    },
  ],
};

// Helper to get skill type category
export const getSkillCategory = (skillId: string): 'image' | 'text' | 'audio' | 'web' => {
  const imageSkills = ['image-gen', 'image-edit', 'remove-bg', 'upscale', 'stylize', 'image-describe', 'face-restore'];
  const textSkills  = ['text-gen', 'text-sum', 'text-trans', 'text-rewrite', 'text-grammar', 'text-code', 'text-hashtag', 'text-extract'];
  const audioSkills = ['audio-tts', 'audio-stt'];
  if (imageSkills.includes(skillId)) return 'image';
  if (textSkills.includes(skillId)) return 'text';
  if (audioSkills.includes(skillId)) return 'audio';
  return 'web';
};
