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
    },
    {
      id: 'ig-2',
      label: '🏙️ Cyberpunk City',
      prompt: 'Cyberpunk city street at night with neon lights reflecting in rain puddles, flying cars, futuristic billboards, cinematic',
      exampleImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
      exampleCaption: 'Neon-lit futuristic cityscape at night',
    },
    {
      id: 'ig-3',
      label: '🌸 Anime Style',
      prompt: 'A young girl sitting under cherry blossom trees, Studio Ghibli anime art style, soft warm colors, magical atmosphere',
      exampleImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
      exampleCaption: 'Soft anime-style cherry blossom scene',
    },
    {
      id: 'ig-4',
      label: '☕ Minimal Logo',
      prompt: 'Minimalist logo design for a modern coffee shop, clean vector art, black and gold color scheme, professional branding',
      exampleImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
      exampleCaption: 'Clean minimalist coffee shop branding',
    },
    {
      id: 'ig-5',
      label: '🌊 Abstract Art',
      prompt: 'Abstract fluid art with deep purple and gold swirls, macro photography style, luxurious and ethereal, high contrast',
      exampleImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80',
      exampleCaption: 'Vibrant abstract fluid artwork',
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
    },
    {
      id: 'ie-2',
      label: '🏖️ Beach Background',
      prompt: 'Replace the background with a tropical beach at sunset, crystal clear turquoise water, soft sand, seamless blend',
      exampleImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      exampleCaption: 'Natural-looking beach background swap',
    },
    {
      id: 'ie-3',
      label: '🌙 Night Scene',
      prompt: 'Transform the scene to nighttime, add city lights in the background, moody blue atmosphere, stars in the sky',
      exampleImage: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&q=80',
      exampleCaption: 'Dramatic nighttime transformation',
    },
    {
      id: 'ie-4',
      label: '🍂 Autumn Colors',
      prompt: 'Change the season to autumn, add warm orange and red leaves, misty morning atmosphere, cozy fall feeling',
      exampleImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
      exampleCaption: 'Beautiful autumn season transformation',
    },
    {
      id: 'ie-5',
      label: '📸 Studio Look',
      prompt: 'Make it look like a professional studio photograph, clean white background, soft box lighting, sharp focus, commercial quality',
      exampleImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
      exampleCaption: 'Professional studio photography style',
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
    },
    {
      id: 'rb-2',
      label: '🪪 ID Photo',
      prompt: 'Remove background for passport or ID photo, maintain natural hair edges, clean professional result',
      exampleImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
      exampleCaption: 'Perfect portrait background removal',
    },
    {
      id: 'rb-3',
      label: '🎨 Sticker Art',
      prompt: 'Remove background to create a transparent sticker-ready image with clean edges and no artifacts',
      exampleImage: 'https://images.unsplash.com/photo-1608889175638-9322300c46e8?w=600&q=80',
      exampleCaption: 'Transparent sticker-ready cutout',
    },
    {
      id: 'rb-4',
      label: '👔 LinkedIn Photo',
      prompt: 'Remove background for professional headshot, replace with clean white or light gradient, business profile ready',
      exampleImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
      exampleCaption: 'Professional headshot background removal',
    },
    {
      id: 'rb-5',
      label: '🌿 Nature Object',
      prompt: 'Remove background from a natural object like a flower or leaf, preserve fine details and textures',
      exampleImage: 'https://images.unsplash.com/photo-1490750967868-88df5691cc9d?w=600&q=80',
      exampleCaption: 'Detailed natural object isolation',
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
    },
    {
      id: 'up-2',
      label: '👴 Old Photo Restore',
      prompt: 'Restore old blurry photograph to HD quality, remove grain and noise, sharpen facial features',
      exampleImage: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600&q=80',
      exampleCaption: 'Restored vintage photo clarity',
    },
    {
      id: 'up-3',
      label: '🌃 Night Photo',
      prompt: 'Enhance low-light night photo, reduce noise, upscale resolution, bring out hidden details in shadows',
      exampleImage: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&q=80',
      exampleCaption: 'Enhanced low-light night photograph',
    },
    {
      id: 'up-4',
      label: '🖨️ Print Quality',
      prompt: 'Upscale small social media image to print-ready quality, 300 DPI equivalent, sharp and detailed',
      exampleImage: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
      exampleCaption: 'Print-quality image upscaling',
    },
    {
      id: 'up-5',
      label: '😊 Portrait HD',
      prompt: 'Upscale portrait photo, enhance skin texture naturally, sharpen eyes and hair detail, professional quality',
      exampleImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80',
      exampleCaption: 'High-definition portrait enhancement',
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
    },
    {
      id: 'st-2',
      label: '🖌️ Oil Painting',
      prompt: 'Convert to classic oil painting style, rich textures, brushstroke details, Old Masters technique, museum quality',
      exampleImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
      exampleCaption: 'Classic oil painting transformation',
    },
    {
      id: 'st-3',
      label: '🎨 Watercolor',
      prompt: 'Apply soft watercolor illustration style, gentle color bleeds, paper texture visible, artistic and delicate',
      exampleImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80',
      exampleCaption: 'Soft watercolor illustration style',
    },
    {
      id: 'st-4',
      label: '📷 Film Vintage',
      prompt: 'Make it look like an authentic vintage 35mm film photograph, film grain, muted tones, light leaks, nostalgic 1970s feel',
      exampleImage: 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=600&q=80',
      exampleCaption: 'Authentic vintage film photograph',
    },
    {
      id: 'st-5',
      label: '🌆 Cyberpunk',
      prompt: 'Apply cyberpunk neon art style, electric blue and magenta colors, glitch effects, futuristic dystopian atmosphere',
      exampleImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      exampleCaption: 'Neon cyberpunk stylized artwork',
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
    },
    {
      id: 'tg-2',
      label: '🛒 Product Copy',
      prompt: 'Write a compelling product description for a premium wireless noise-canceling headphone. Highlight: 40-hour battery, studio-quality sound, foldable design. Target audience: remote workers and music lovers.',
      exampleImage: undefined,
      exampleCaption: '📝 Persuasive e-commerce product description with features and benefits',
    },
    {
      id: 'tg-3',
      label: '📖 Short Story',
      prompt: 'Write a captivating 200-word short story about a robot who discovers music for the first time and begins to feel emotions. Make it heartwarming and thought-provoking.',
      exampleImage: undefined,
      exampleCaption: '📝 Heartwarming 200-word short story with emotional arc',
    },
    {
      id: 'tg-4',
      label: '🚀 App Taglines',
      prompt: 'Generate 5 creative and memorable taglines for a mobile AI image generation app called "Rnai". The app lets anyone create stunning visuals instantly. Make each tagline unique and punchy.',
      exampleImage: undefined,
      exampleCaption: '📝 5 unique, punchy taglines for a mobile app',
    },
    {
      id: 'tg-5',
      label: '✉️ Business Email',
      prompt: 'Write a formal email to request a 30-minute meeting with a potential investor at a tech conference. Express genuine interest in their portfolio, briefly introduce the company Rnai.io, and propose 3 available time slots.',
      exampleImage: undefined,
      exampleCaption: '📝 Professional investor outreach email with clear CTA',
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
    },
    {
      id: 'ts-2',
      label: '⚡ TL;DR',
      prompt: 'Create a TL;DR (Too Long; Didn\'t Read) summary of the following text in 2-3 sentences maximum. Make it punchy and capture the absolute essence.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 Ultra-short 2-3 sentence summary',
    },
    {
      id: 'ts-3',
      label: '📊 Executive Summary',
      prompt: 'Write a one-paragraph executive summary of the following content. Suitable for a business audience. Include: main purpose, key findings, and recommended action.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 Business-ready executive summary paragraph',
    },
    {
      id: 'ts-4',
      label: '✅ Action Items',
      prompt: 'Extract all action items and next steps from the following meeting notes or document. Format as a numbered checklist with owner names if mentioned and deadlines if specified.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 Numbered checklist of action items and owners',
    },
    {
      id: 'ts-5',
      label: '🔑 Key Insights',
      prompt: 'Identify and explain the 5 most important insights from the following research or article. For each insight, explain WHY it matters in one sentence.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '📋 5 key insights with explanation of impact',
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
    },
    {
      id: 'tt-2',
      label: '🇺🇸 → 🇹🇭 English to Thai',
      prompt: 'Translate the following English text to Thai. Use natural Thai phrasing that sounds like it was written by a native speaker, not a literal translation.\n\n[Paste English text here]',
      exampleImage: undefined,
      exampleCaption: '🌐 Natural-sounding Thai translation',
    },
    {
      id: 'tt-3',
      label: '🇯🇵 Japanese',
      prompt: 'Translate the following text to Japanese (日本語). Use appropriate formality level (です/ます form for business, casual for informal). Include furigana for complex kanji.\n\n[Paste text here]',
      exampleImage: undefined,
      exampleCaption: '🌐 Proper Japanese with correct formality level',
    },
    {
      id: 'tt-4',
      label: '🇨🇳 Chinese',
      prompt: 'Translate the following text to Simplified Chinese (简体中文). Ensure idiomatic Chinese expressions are used rather than direct translations.\n\n[Paste text here]',
      exampleImage: undefined,
      exampleCaption: '🌐 Idiomatic Simplified Chinese translation',
    },
    {
      id: 'tt-5',
      label: '🇪🇸 Spanish',
      prompt: 'Translate the following marketing text to Latin American Spanish. Use modern, engaging language that resonates with a young adult audience. Keep brand voice consistent.\n\n[Paste text here]',
      exampleImage: undefined,
      exampleCaption: '🌐 Engaging Latin American Spanish marketing copy',
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
    },
    {
      id: 'tr-2',
      label: '😊 More Friendly',
      prompt: 'Rewrite the following text to be warmer, more conversational and approachable. Keep the information but make it feel like a friendly conversation, not a formal document.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ Warm, conversational rewrite that connects with readers',
    },
    {
      id: 'tr-3',
      label: '✂️ Shorter (50%)',
      prompt: 'Rewrite the following text to be at least 50% shorter. Remove redundancy, combine sentences, and keep only the essential information. Every word must earn its place.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ Concise rewrite with 50% fewer words, same meaning',
    },
    {
      id: 'tr-4',
      label: '🎯 SEO Optimized',
      prompt: 'Rewrite the following text to be SEO-optimized. Add relevant keywords naturally, improve readability with short paragraphs, include a compelling intro and CTA at the end.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ SEO-friendly version with keywords and better structure',
    },
    {
      id: 'tr-5',
      label: '🚀 Marketing Style',
      prompt: 'Rewrite the following text in an exciting, persuasive marketing style. Use power words, create urgency, highlight benefits not features, and inspire the reader to take action.\n\n[Paste your text here]',
      exampleImage: undefined,
      exampleCaption: '✏️ High-energy marketing copy that drives action',
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
    },
    {
      id: 'wg-2',
      label: '🍽️ Restaurant Page',
      prompt: 'Elegant restaurant landing page for an Italian fine dining restaurant called "La Cucina". Include: hero with food photography, featured menu section, chef story, reservation form, and Google Maps embed. Warm earthy tones.',
      exampleImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
      exampleCaption: 'Elegant restaurant website with reservation system',
    },
    {
      id: 'wg-3',
      label: '💻 SaaS Landing',
      prompt: 'High-converting SaaS landing page for an AI writing tool. Include: hero with product demo GIF, 3 key features, social proof (testimonials + logos), pricing table (3 tiers), FAQ, and signup CTA. Clean white and blue design.',
      exampleImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      exampleCaption: 'Conversion-optimized SaaS product landing page',
    },
    {
      id: 'wg-4',
      label: '📸 Photo Blog',
      prompt: 'Personal photography blog for a travel photographer. Masonry grid photo gallery, travel stories blog section, destination map, Instagram feed widget, and newsletter signup. Light airy aesthetic with serif fonts.',
      exampleImage: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80',
      exampleCaption: 'Beautiful travel photography blog with gallery',
    },
    {
      id: 'wg-5',
      label: '🛍️ Product Store',
      prompt: 'E-commerce product page for handmade artisan ceramic jewelry. Product image gallery, size/color selector, customer reviews (4.8 stars), related products, and secure checkout section. Minimalist warm beige theme.',
      exampleImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
      exampleCaption: 'Elegant product page with reviews and gallery',
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
    },
    {
      id: 'at-2',
      label: '📦 Order Update',
      prompt: 'Great news! Your order number 12345 has been confirmed and is now being prepared. Estimated delivery is within 3 to 5 business days. You will receive a tracking link via email shortly.',
      exampleImage: undefined,
      exampleCaption: '🔊 Clear e-commerce order confirmation (~7 sec)',
    },
    {
      id: 'at-3',
      label: '📖 Story Narration',
      prompt: 'Chapter One: In a world where technology and nature coexisted in perfect harmony, there lived a young inventor named Aria. Every morning, she would climb to the top of her glass workshop and watch the solar drones tend to the ancient forest below.',
      exampleImage: undefined,
      exampleCaption: '🔊 Engaging audiobook-style story narration (~12 sec)',
    },
    {
      id: 'at-4',
      label: '📣 Ad Voiceover',
      prompt: 'Stop wasting time. Start creating. With Rnai, turn any idea into a stunning image in seconds. No design skills needed. No limits. Just your imagination. Try Rnai free today.',
      exampleImage: undefined,
      exampleCaption: '🔊 High-energy 15-second advertisement voiceover',
    },
    {
      id: 'at-5',
      label: '🎓 Course Intro',
      prompt: 'Welcome to Advanced AI Design Fundamentals. In this course, you will learn how to harness the power of artificial intelligence to create professional-grade visuals, automate your workflow, and stay ahead in the rapidly evolving creative industry.',
      exampleImage: undefined,
      exampleCaption: '🔊 Professional e-learning course introduction (~10 sec)',
    },
  ],
};

// Helper to get skill type category
export const getSkillCategory = (skillId: string): 'image' | 'text' | 'audio' | 'web' => {
  const imageSkills = ['image-gen', 'image-edit', 'remove-bg', 'upscale', 'stylize'];
  const textSkills = ['text-gen', 'text-sum', 'text-trans', 'text-rewrite'];
  const audioSkills = ['audio-tts'];
  if (imageSkills.includes(skillId)) return 'image';
  if (textSkills.includes(skillId)) return 'text';
  if (audioSkills.includes(skillId)) return 'audio';
  return 'web';
};
