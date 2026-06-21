/**
 * Rnai.io — Internationalization (i18n)
 * Supported: th, en, ja, zh, ko, fr, de, es
 * ASEAN:     id, ms, vi, fil, km, lo, my
 */

export type LangCode =
  | 'th' | 'en' | 'ja' | 'zh' | 'ko' | 'fr' | 'de' | 'es'
  | 'id' | 'ms' | 'vi' | 'fil' | 'km' | 'lo' | 'my';

export interface Translations {
  tabs:    { home: string; create: string; library: string; ai: string; profile: string };
  common:  {
    save: string; cancel: string; back: string; close: string;
    search: string; clear: string; viewAll: string; seeAll: string;
    tapToUse: string; newCreation: string; execute: string; processing: string;
    yes: string; no: string; ok: string; confirm: string;
    loading: string; error: string; success: string;
  };
  home: {
    greeting: { morning: string; afternoon: string; evening: string };
    poweredBy: string; tagline: string; taglineHighlight: string;
    startCreating: string; generateBtn: string;
    creditsLabel: string;
    stats: { generations: string; creditsUsed: string; dayStreak: string };
    sections: { aiTools: string; allSkills: string; history: string; recentCreations: string };
    skillBadges: { hot: string; new: string; top: string };
    promo: { badge: string; title: string; desc: string; btn: string };
  };
  create: {
    title: string; subtitle: string;
    searchPlaceholder: string; availableSkills: string; noSkills: string;
  };
  profile: {
    editBtn: string; tapToChange: string; emailNote: string;
    plans: { free: string; pro: string; enterprise: string };
    credits: { available: string; of: string; remaining: string; resets: string; topUp: string };
    stats: { monthly: string; total: string; streak: string };
    sections: {
      account: string; preferences: string; storage: string;
      security: string; support: string; about: string; actions: string;
    };
    fields: {
      displayName: string; email: string; subscription: string; billing: string;
      language: string; theme: string; imageQuality: string;
      pushNotifications: string; emailUpdates: string;
      autoSave: string; wifiOnly: string; clearCache: string;
      changePassword: string; twoFA: string; loginActivity: string;
      helpCenter: string; rateApp: string; feedback: string;
      privacy: string; terms: string; appVersion: string; apiStatus: string;
      signOut: string; deleteAccount: string;
    };
    quality: { standard: string; standardDesc: string; hd: string; hdDesc: string; ultra: string; ultraDesc: string };
    themes: { vibrant: string; brand: string; modern: string };
    modals: { editTitle: string; languageTitle: string; qualityTitle: string };
    signOutDialog:  { title: string; message: string; confirm: string };
    deleteDialog:   { title: string; message: string; confirm: string };
    alerts: {
      emailCannotChange: string; billingMsg: string; upgradeMsg: string;
      clearCacheMsg: string; loginActivityMsg: string; rateMsg: string;
      feedbackEmail: string; helpUrl: string; privacyUrl: string; termsUrl: string;
      passwordMsg: string; apiOperational: string;
    };
    proStatusLabel: string; operationalLabel: string;
  };
  skill: {
    inputLabel: string; quickPrompts: string; examplesLabel: string;
    placeholders: { image: string; audio: string; text: string };
    chars: string; execute: string; processing: string;
    templatesCount: string; aiProcessing: string;
    resultLabel: string;
  };
  skills: Record<string, { name: string; description: string; tagline: string }>;
  languages: Record<LangCode, { label: string; name: string; flag: string }>;
  library: {
    subtitle: string; title: string;
    items: string; favorites: string;
    noItems: string; noItemsDesc: string;
    localStorage: string;
    cloudStorage: string; connectSync: string;
    filters: { all: string; images: string; text: string; website: string; audio: string };
    sections: { images: string; docs: string };
    share: { title: string; via: string; deleteFromLib: string };
    cloud: { rnaiDesc: string; otherDesc: string; upgrade: string; soon: string };
    alerts: {
      savedToRoll: string; permDenied: string;
      deleteTitle: string; deleteMsg: string;
      rnaiCloud: string; rnaiUpgrade: string; rnaiLater: string;
      comingSoon: string; comingOk: string;
    };
  };
  aiManager: {
    subtitle: string; title: string; activeLabel: string;
    tabs: { models: string; wallet: string };
    soonBadge: string;
    activeModel: string; quickChat: string;
    chatPlaceholder: string; send: string; thinking: string; demoResponse: string;
    ollamaTitle: string; ollamaDesc: string; ollamaPlaceholder: string; ollamaConnect: string;
    modelStatus: { connect: string; featured: string; available: string };
    modelDownload: string; modelConnected: string;
    wallet: {
      title: string; totalBalance: string;
      receive: string; send: string; scan: string;
      assets: string; comingSoon: string;
      selfCustodialTitle: string; selfCustodialDesc: string;
      createBtn: string; addressCopied: string; displayOnly: string;
      truemoney: {
        sectionTitle: string; tagline: string;
        inputLabel: string; inputPlaceholder: string; redeemBtn: string;
        redeeming: string;
        successTitle: string; successDesc: string;
        alreadyUsed: string; invalidVoucher: string;
        howToTitle: string; step1: string; step2: string; step3: string;
        howToNote: string;
      };
    };
    legal: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 Shared language selector metadata (label = native, name = English)
// ─────────────────────────────────────────────────────────────────────────────
const LANGUAGES_MAP: Record<LangCode, { label: string; name: string; flag: string }> = {
  th:  { label: 'ภาษาไทย',           name: 'Thai',       flag: '🇹🇭' },
  en:  { label: 'English',           name: 'English',    flag: '🇺🇸' },
  ja:  { label: '日本語',             name: 'Japanese',   flag: '🇯🇵' },
  zh:  { label: '中文',               name: 'Chinese',    flag: '🇨🇳' },
  ko:  { label: '한국어',             name: 'Korean',     flag: '🇰🇷' },
  fr:  { label: 'Français',          name: 'French',     flag: '🇫🇷' },
  de:  { label: 'Deutsch',           name: 'German',     flag: '🇩🇪' },
  es:  { label: 'Español',           name: 'Spanish',    flag: '🇪🇸' },
  id:  { label: 'Bahasa Indonesia',  name: 'Indonesian', flag: '🇮🇩' },
  ms:  { label: 'Bahasa Melayu',     name: 'Malay',      flag: '🇲🇾' },
  vi:  { label: 'Tiếng Việt',        name: 'Vietnamese', flag: '🇻🇳' },
  fil: { label: 'Filipino',          name: 'Filipino',   flag: '🇵🇭' },
  km:  { label: 'ខ្មែរ',              name: 'Khmer',      flag: '🇰🇭' },
  lo:  { label: 'ລາວ',               name: 'Lao',        flag: '🇱🇦' },
  my:  { label: 'မြန်မာ',             name: 'Burmese',    flag: '🇲🇲' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇹🇭 THAI
// ─────────────────────────────────────────────────────────────────────────────
const th: Translations = {
  tabs: { home: 'หน้าหลัก', create: 'สร้างงาน', library: 'คลัง', ai: 'AI', profile: 'โปรไฟล์' },
  common: {
    save: 'บันทึก', cancel: 'ยกเลิก', back: 'ย้อนกลับ', close: 'ปิด',
    search: 'ค้นหา', clear: 'ล้าง', viewAll: 'ดูทั้งหมด', seeAll: 'ดูทั้งหมด',
    tapToUse: 'แตะเพื่อใช้', newCreation: 'สร้างใหม่',
    execute: 'ประมวลผล', processing: 'กำลังประมวลผล...',
    yes: 'ใช่', no: 'ไม่', ok: 'ตกลง', confirm: 'ยืนยัน',
    loading: 'กำลังโหลด...', error: 'ข้อผิดพลาด', success: 'สำเร็จ',
  },
  home: {
    greeting: { morning: 'สวัสดีตอนเช้า', afternoon: 'สวัสดีตอนบ่าย', evening: 'สวัสดีตอนเย็น' },
    poweredBy: 'ขับเคลื่อนด้วย AI',
    tagline: 'สร้างได้ทุกอย่าง',
    taglineHighlight: 'ทันที',
    startCreating: 'เริ่มสร้างงาน',
    generateBtn: '🎨 สร้างรูปภาพ',
    creditsLabel: 'เครดิต',
    stats: { generations: 'งานที่สร้าง', creditsUsed: 'เครดิตที่ใช้', dayStreak: 'วันต่อเนื่อง' },
    sections: { aiTools: 'เครื่องมือ AI', allSkills: 'ทักษะทั้งหมด', history: 'ประวัติ', recentCreations: 'งานล่าสุด' },
    skillBadges: { hot: 'ฮิต 🔥', new: 'ใหม่ ✨', top: 'ยอดนิยม' },
    promo: { badge: 'โปรโมชั่นพิเศษ', title: 'อัปเกรดเป็น Pro ⭐', desc: 'สร้างได้ไม่จำกัด · คุณภาพ HD', btn: 'ดูแพ็คเกจ →' },
  },
  create: {
    title: 'สนามทดลอง',
    subtitle: 'เลือกทักษะที่ต้องการ',
    searchPlaceholder: '🔍  ค้นหาทักษะ...',
    availableSkills: 'ทักษะที่พร้อมใช้งาน',
    noSkills: 'ไม่พบทักษะที่ค้นหา',
  },
  profile: {
    editBtn: 'แก้ไขโปรไฟล์',
    tapToChange: 'แตะเพื่อเปลี่ยนรูป',
    emailNote: 'ติดต่อฝ่ายสนับสนุนเพื่อเปลี่ยนอีเมล',
    plans: { free: 'ฟรี', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'เครดิตคงเหลือ', of: 'จาก', remaining: 'เหลืออยู่', resets: 'รีเซ็ต', topUp: 'เติมเครดิต' },
    stats: { monthly: 'งานที่สร้าง\nเดือนนี้', total: 'ทั้งหมด\nที่สร้าง', streak: 'วัน\nต่อเนื่อง 🔥' },
    sections: {
      account: 'บัญชีผู้ใช้', preferences: 'การตั้งค่า', storage: 'พื้นที่และข้อมูล',
      security: 'ความปลอดภัย', support: 'ช่วยเหลือ', about: 'เกี่ยวกับ', actions: 'การจัดการบัญชี',
    },
    fields: {
      displayName: 'ชื่อที่แสดง', email: 'อีเมล', subscription: 'แพ็คเกจ', billing: 'การชำระเงิน',
      language: 'ภาษา', theme: 'ธีม', imageQuality: 'คุณภาพรูปภาพ',
      pushNotifications: 'การแจ้งเตือน', emailUpdates: 'อัปเดตทางอีเมล',
      autoSave: 'บันทึกผลลัพธ์อัตโนมัติ', wifiOnly: 'ใช้ Wi-Fi เท่านั้น (HD)',
      clearCache: 'ล้างแคช', changePassword: 'เปลี่ยนรหัสผ่าน',
      twoFA: 'ยืนยันตัวตนสองชั้น', loginActivity: 'ประวัติการเข้าสู่ระบบ',
      helpCenter: 'ศูนย์ช่วยเหลือ', rateApp: 'ให้คะแนนแอป',
      feedback: 'ส่งความคิดเห็น', privacy: 'นโยบายความเป็นส่วนตัว',
      terms: 'ข้อกำหนดการใช้งาน', appVersion: 'เวอร์ชั่นแอป',
      apiStatus: 'สถานะระบบ', signOut: 'ออกจากระบบ', deleteAccount: 'ลบบัญชี',
    },
    quality: { standard: 'มาตรฐาน', standardDesc: '512×512 · รวดเร็ว', hd: 'HD', hdDesc: '1024×1024 · สมดุล', ultra: 'Ultra HD', ultraDesc: '2048×2048 · ช้า' },
    themes: { vibrant: 'สีสดใส 🎨', brand: 'แบรนด์', modern: 'โมเดิร์น' },
    modals: { editTitle: 'แก้ไขโปรไฟล์', languageTitle: 'เลือกภาษา', qualityTitle: 'คุณภาพรูปภาพ' },
    signOutDialog:  { title: 'ออกจากระบบ', message: 'คุณต้องการออกจากระบบใช่หรือไม่?', confirm: 'ออกจากระบบ' },
    deleteDialog:   { title: '⚠️ ลบบัญชี', message: 'การดำเนินการนี้จะลบบัญชีและข้อมูลทั้งหมดอย่างถาวร ไม่สามารถกู้คืนได้', confirm: 'ลบบัญชี' },
    alerts: {
      emailCannotChange: 'ไม่สามารถเปลี่ยนอีเมลได้ในขณะนี้',
      billingMsg: 'จัดการวิธีการชำระเงิน', upgradeMsg: 'ดูตัวเลือกแพ็คเกจ',
      clearCacheMsg: 'ล้างแคชเรียบร้อยแล้ว',
      loginActivityMsg: 'เข้าสู่ระบบล่าสุด: วันนี้ เวลา 10:42 น.\nอุปกรณ์: iPhone 15 Pro\nสถานที่: กรุงเทพมหานคร',
      rateMsg: 'ขอบคุณสำหรับการสนับสนุน! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'ลิงก์รีเซ็ตจะถูกส่งไปยังอีเมลของคุณ',
      apiOperational: '🟢 ระบบปกติ',
    },
    proStatusLabel: '⭐ แพ็คเกจ Pro',
    operationalLabel: '🟢 ระบบปกติ',
  },
  skill: {
    inputLabel: 'ข้อมูลนำเข้า',
    quickPrompts: '⚡ Prompt สำเร็จรูป',
    examplesLabel: '✨ ตัวอย่างผลลัพธ์',
    placeholders: { image: 'อธิบายรูปภาพที่ต้องการสร้าง...', audio: 'พิมพ์ข้อความที่ต้องการแปลงเป็นเสียง...', text: 'พิมพ์ข้อความหรือคำสั่งของคุณ...' },
    chars: 'ตัวอักษร', execute: 'ประมวลผล', processing: 'กำลังประมวลผล...',
    templatesCount: 'เทมเพลต', aiProcessing: 'AI กำลังประมวลผล...',
    resultLabel: 'ผลลัพธ์',
  },
  skills: {
    'image-gen':    { name: 'สร้างรูปภาพ',          description: 'สร้างรูปภาพจากคำอธิบายข้อความ',     tagline: 'ข้อความ → รูปภาพ' },
    'image-edit':   { name: 'แก้ไขรูปภาพ',          description: 'ปรับแต่งและตกแต่งรูปภาพด้วย AI',    tagline: 'ปรับแต่งรูปภาพ' },
    'remove-bg':    { name: 'ลบพื้นหลัง',            description: 'ตัดพื้นหลังออกจากรูปภาพอย่างแม่นยำ',  tagline: 'ตัดแยกวัตถุ' },
    'upscale':      { name: 'เพิ่มความละเอียด',      description: 'เพิ่มความชัดเจนและความละเอียดภาพ',    tagline: 'เพิ่มความคมชัด' },
    'stylize':      { name: 'แต่งสไตล์รูปภาพ',      description: 'แปลงรูปภาพเป็นสไตล์ศิลปะต่างๆ',      tagline: 'สไตล์ศิลปะ' },
    'text-gen':     { name: 'สร้างข้อความ',          description: 'เขียนเนื้อหาที่น่าสนใจด้วย AI',       tagline: 'AI นักเขียน' },
    'text-sum':     { name: 'สรุปข้อความ',           description: 'สรุปเนื้อหายาวให้กระชับและชัดเจน',    tagline: 'สรุปอย่างฉลาด' },
    'text-trans':   { name: 'แปลภาษา',               description: 'แปลข้อความอย่างเป็นธรรมชาติกว่า 50 ภาษา', tagline: '50+ ภาษา' },
    'text-rewrite': { name: 'เขียนใหม่',             description: 'เปลี่ยนโทนและสไตล์ข้อความตามต้องการ', tagline: 'ทุกโทนและสไตล์' },
    'website-gen':    { name: 'สร้างเว็บไซต์',          description: 'สร้างเว็บไซต์สวยงามด้วย AI',                tagline: 'สร้างด้วย AI' },
    'audio-tts':      { name: 'แปลงข้อความเป็นเสียง',  description: 'แปลงข้อความเป็นเสียงพูดที่เป็นธรรมชาติ',      tagline: 'เสียงพูดธรรมชาติ' },
    'image-describe': { name: 'วิเคราะห์รูปภาพ',        description: 'ให้ AI อธิบายและวิเคราะห์รูปภาพอย่างละเอียด',  tagline: 'Vision AI' },
    'face-restore':   { name: 'ฟื้นฟูใบหน้า',           description: 'ฟื้นฟูและเพิ่มความคมชัดใบหน้าในรูปเก่าหรือเบลอ', tagline: 'ฟื้นฟูใบหน้า HD' },
    'text-grammar':   { name: 'ตรวจสอบไวยากรณ์',        description: 'ตรวจและแก้ไขไวยากรณ์ การสะกด และวรรคตอน',     tagline: 'ข้อความสมบูรณ์' },
    'text-code':      { name: 'สร้างโค้ด',               description: 'สร้างโค้ดโปรแกรมจากคำอธิบายภาษาพูด',           tagline: 'AI Coder' },
    'text-hashtag':   { name: 'สร้าง Hashtag',           description: 'สร้าง hashtag ที่เหมาะกับ platform และเนื้อหา', tagline: 'เพิ่มการเข้าถึง' },
  },
  languages: LANGUAGES_MAP,
  library: {
    subtitle: 'พื้นที่ทำงาน', title: 'คลัง',
    items: 'รายการ', favorites: 'รายการโปรด',
    noItems: 'ยังไม่มีรายการ', noItemsDesc: 'สร้างงานแล้วบันทึก เพื่อดูที่นี่',
    localStorage: 'พื้นที่บนอุปกรณ์',
    cloudStorage: 'จัดเก็บบนคลาวด์', connectSync: 'เชื่อมต่อและซิงค์',
    filters: { all: 'ทั้งหมด', images: 'รูปภาพ', text: 'ข้อความ', website: 'เว็บไซต์', audio: 'เสียง' },
    sections: { images: '🖼️ รูปภาพ', docs: '📄 เอกสารและอื่นๆ' },
    share: { title: 'แชร์', via: 'แชร์ผ่าน', deleteFromLib: 'ลบออกจากคลัง' },
    cloud: { rnaiDesc: 'พื้นที่ไม่จำกัด · สำรองอัตโนมัติ · ลิงก์แชร์', otherDesc: 'ซิงค์งานสร้างของคุณอัตโนมัติ', upgrade: 'อัปเกรด', soon: 'เร็วๆ นี้' },
    alerts: {
      savedToRoll: '✅ บันทึกลงรูปภาพแล้ว', permDenied: 'กรุณาอนุญาตเข้าถึงรูปภาพในการตั้งค่า',
      deleteTitle: 'ลบรายการ', deleteMsg: 'ลบ',
      rnaiCloud: 'อัปเกรดเป็น Pro เพื่อรับพื้นที่ไม่จำกัด สำรองข้อมูลอัตโนมัติ และลิงก์แชร์',
      rnaiUpgrade: 'อัปเกรด', rnaiLater: 'ภายหลัง',
      comingSoon: 'เร็วๆ นี้! กำลังพัฒนาการรองรับนี้', comingOk: 'ตกลง',
    },
  },
  aiManager: {
    subtitle: 'ศูนย์ปัญญาประดิษฐ์', title: 'AI Manager', activeLabel: 'ใช้งานอยู่',
    tabs: { models: 'AI Models', wallet: 'กระเป๋าเงิน' },
    soonBadge: 'เร็วๆ นี้',
    activeModel: 'โมเดลที่ใช้งาน', quickChat: 'แชทด่วน',
    chatPlaceholder: 'ถามอะไรก็ได้...', send: 'ส่ง', thinking: 'กำลังคิด...', demoResponse: 'นี่คือตัวอย่างการตอบ เชื่อมต่อ Ollama หรือดาวน์โหลดโมเดลเพื่อรับการตอบจริง',
    ollamaTitle: 'เชื่อมต่อ Ollama', ollamaDesc: 'ใส่ URL ของเซิร์ฟเวอร์ Ollama บน LAN', ollamaPlaceholder: 'http://192.168.x.x:11434', ollamaConnect: 'เชื่อมต่อ',
    modelStatus: { connect: 'LAN Connect', featured: '⭐ แนะนำ', available: 'พร้อมใช้' },
    modelDownload: 'ดาวน์โหลด', modelConnected: 'เชื่อมต่อแล้ว',
    wallet: {
      title: 'กระเป๋าเงินดิจิทัล', totalBalance: 'ยอดรวม',
      receive: 'รับ', send: 'ส่ง', scan: 'สแกน',
      assets: 'สินทรัพย์', comingSoon: 'เร็วๆ นี้',
      selfCustodialTitle: 'Self-Custodial Wallet', selfCustodialDesc: 'กระเป๋าที่คุณควบคุมเองทั้งหมด · Private Key เก็บบนอุปกรณ์ · ไม่มีตัวกลาง',
      createBtn: '✨ สร้างกระเป๋าใหม่', addressCopied: 'คัดลอกที่อยู่แล้ว', displayOnly: 'แสดงเพื่อดูเท่านั้น — ต้องยืนยันตัวตนก่อนเปิดใช้งานจริง',
      truemoney: {
        sectionTitle: 'เติมเครดิตผ่านทรูวอเล็ต',
        tagline: 'ใช้ Gift Voucher ทรูวอเล็ตจาก 7-Eleven',
        inputLabel: 'วางลิงก์หรือโค้ด Gift Voucher',
        inputPlaceholder: 'https://gift.truemoney.com/campaign/?v=... หรือโค้ด 16 หลัก',
        redeemBtn: '🎁 แลกเครดิตเลย',
        redeeming: 'กำลังแลก...',
        successTitle: '✅ แลกสำเร็จ!',
        successDesc: 'ได้รับ {credits} เครดิต (฿{baht})',
        alreadyUsed: 'Voucher นี้ถูกใช้ไปแล้ว หรือหมดอายุ',
        invalidVoucher: 'โค้ดไม่ถูกต้อง — ตรวจสอบแล้วลองอีกครั้ง',
        howToTitle: 'วิธีซื้อ Gift Voucher',
        step1: '1. ซื้อ TrueMoney Gift Card ที่ 7-Eleven หรือ TrueMoney App',
        step2: '2. รับลิงก์ Gift Voucher หรือ PIN 16 หลัก',
        step3: '3. วางในช่องด้านบน แล้วกด "แลกเครดิต"',
        howToNote: '1 บาท ≈ 10 เครดิต AI · ไม่มีวันหมดอายุ',
      },
    },
    legal: 'Self-Custodial: คุณรับผิดชอบ Private Key เอง แอปนี้ไม่ได้ให้บริการแลกเปลี่ยนหรือรับฝากเงิน',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇺🇸 ENGLISH
// ─────────────────────────────────────────────────────────────────────────────
const en: Translations = {
  tabs: { home: 'Home', create: 'Create', library: 'Library', ai: 'AI', profile: 'Profile' },
  common: {
    save: 'Save', cancel: 'Cancel', back: 'Back', close: 'Close',
    search: 'Search', clear: 'Clear', viewAll: 'View All', seeAll: 'See All',
    tapToUse: 'Tap to use', newCreation: 'New Creation',
    execute: 'Execute', processing: 'Processing...',
    yes: 'Yes', no: 'No', ok: 'OK', confirm: 'Confirm',
    loading: 'Loading...', error: 'Error', success: 'Success',
  },
  home: {
    greeting: { morning: 'Good Morning', afternoon: 'Good Afternoon', evening: 'Good Evening' },
    poweredBy: 'Powered by AI',
    tagline: 'Create Anything',
    taglineHighlight: 'Instantly',
    startCreating: 'Start Creating',
    generateBtn: '🎨 Generate',
    creditsLabel: 'Credits',
    stats: { generations: 'Generations', creditsUsed: 'Credits Used', dayStreak: 'Day Streak' },
    sections: { aiTools: 'AI Tools', allSkills: 'All Skills', history: 'History', recentCreations: 'Recent Creations' },
    skillBadges: { hot: 'HOT 🔥', new: 'NEW ✨', top: 'TOP' },
    promo: { badge: 'Limited Offer', title: 'Upgrade to Pro ⭐', desc: 'Unlimited generations · HD quality', btn: 'View →' },
  },
  create: {
    title: 'Playground',
    subtitle: 'Select a skill to get started',
    searchPlaceholder: '🔍  Search skills...',
    availableSkills: 'Available Skills',
    noSkills: 'No skills found',
  },
  profile: {
    editBtn: 'Edit Profile',
    tapToChange: 'Tap to change photo',
    emailNote: 'Contact support to change your email address.',
    plans: { free: 'Free', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'AVAILABLE CREDITS', of: 'of', remaining: '% remaining', resets: 'Resets', topUp: 'Top Up' },
    stats: { monthly: 'Generations\nThis Month', total: 'Total\nCreations', streak: 'Day\nStreak 🔥' },
    sections: {
      account: 'Account', preferences: 'Preferences', storage: 'Storage & Data',
      security: 'Security', support: 'Support', about: 'About', actions: 'Account Actions',
    },
    fields: {
      displayName: 'Display Name', email: 'Email', subscription: 'Subscription', billing: 'Billing & Payments',
      language: 'Language', theme: 'Theme', imageQuality: 'Image Quality',
      pushNotifications: 'Push Notifications', emailUpdates: 'Email Updates',
      autoSave: 'Auto-save Results', wifiOnly: 'Wi-Fi Only (HD Generation)',
      clearCache: 'Clear Cache', changePassword: 'Change Password',
      twoFA: 'Two-Factor Authentication', loginActivity: 'Login Activity',
      helpCenter: 'Help Center', rateApp: 'Rate Rnai',
      feedback: 'Send Feedback', privacy: 'Privacy Policy',
      terms: 'Terms of Service', appVersion: 'App Version',
      apiStatus: 'API Status', signOut: 'Sign Out', deleteAccount: 'Delete Account',
    },
    quality: { standard: 'Standard', standardDesc: '512×512 · Fast', hd: 'HD', hdDesc: '1024×1024 · Balanced', ultra: 'Ultra HD', ultraDesc: '2048×2048 · Slow' },
    themes: { vibrant: 'Vibrant 🎨', brand: 'Brand', modern: 'Modern' },
    modals: { editTitle: 'Edit Profile', languageTitle: 'Language', qualityTitle: 'Image Quality' },
    signOutDialog:  { title: 'Sign Out', message: 'Are you sure you want to sign out?', confirm: 'Sign Out' },
    deleteDialog:   { title: '⚠️ Delete Account', message: 'This will permanently delete your account and all data. This cannot be undone.', confirm: 'Delete' },
    alerts: {
      emailCannotChange: 'Email cannot be changed at this time',
      billingMsg: 'Manage payment methods', upgradeMsg: 'View plan options',
      clearCacheMsg: 'Cache cleared successfully',
      loginActivityMsg: 'Last login: Today, 10:42 AM\nDevice: iPhone 15 Pro\nLocation: Bangkok, Thailand',
      rateMsg: 'Thank you for your support! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'A reset link will be sent to your email',
      apiOperational: '🟢 Operational',
    },
    proStatusLabel: '⭐ Pro Plan',
    operationalLabel: '🟢 Operational',
  },
  skill: {
    inputLabel: 'Input',
    quickPrompts: '⚡ Quick Prompts',
    examplesLabel: '✨ Example Results',
    placeholders: { image: 'Describe the image you want to create...', audio: 'Enter the text to convert to speech...', text: 'Enter your text or instructions...' },
    chars: 'chars', execute: 'Execute', processing: 'Processing...',
    templatesCount: 'Templates', aiProcessing: 'AI is processing...',
    resultLabel: 'Result',
  },
  skills: {
    'image-gen':    { name: 'Generate Image',      description: 'Create unique images from text descriptions',      tagline: 'Text → Image' },
    'image-edit':   { name: 'Edit Image',           description: 'Modify and enhance your images with AI',           tagline: 'Modify & Enhance' },
    'remove-bg':    { name: 'Remove Background',    description: 'Cleanly isolate subjects from any background',     tagline: 'Clean Cutout' },
    'upscale':      { name: 'Upscale Image',        description: 'Enhance resolution and restore fine detail',       tagline: 'HD Enhance' },
    'stylize':      { name: 'Stylize Image',        description: 'Transform photos into stunning art styles',        tagline: 'Art Styles' },
    'text-gen':     { name: 'Generate Text',        description: 'Write compelling content with AI assistance',      tagline: 'AI Copywriter' },
    'text-sum':     { name: 'Summarize Text',       description: 'Condense long content into clear summaries',       tagline: 'Smart Summary' },
    'text-trans':   { name: 'Translate Text',       description: 'Translate naturally across 50+ languages',         tagline: '50+ Languages' },
    'text-rewrite': { name: 'Rewrite Text',         description: 'Transform any text into the perfect tone & style', tagline: 'Any Tone & Style' },
    'website-gen':    { name: 'Generate Website',    description: 'Build beautiful websites with AI',                  tagline: 'Build with AI' },
    'audio-tts':      { name: 'Text to Speech',     description: 'Convert text to natural-sounding audio',            tagline: 'Natural Voice' },
    'image-describe': { name: 'Analyze Image',       description: 'Get AI to describe and analyze any image in detail', tagline: 'Vision AI' },
    'face-restore':   { name: 'Face Restore',        description: 'Restore and enhance faces in old or blurry photos',  tagline: 'HD Face Repair' },
    'text-grammar':   { name: 'Grammar Check',       description: 'Fix grammar, spelling, and punctuation with AI',    tagline: 'Perfect Text' },
    'text-code':      { name: 'Code Generator',      description: 'Generate code from plain language descriptions',     tagline: 'AI Coder' },
    'text-hashtag':   { name: 'Hashtag Generator',   description: 'Create the perfect hashtags for any platform',      tagline: 'Boost Reach' },
  },
  languages: LANGUAGES_MAP,
  library: {
    subtitle: 'My Workspace', title: 'Library',
    items: 'Items', favorites: 'Favorites',
    noItems: 'No items yet', noItemsDesc: 'Create something and save it to see it here',
    localStorage: 'Local Storage',
    cloudStorage: 'Cloud Storage', connectSync: 'Connect & Sync',
    filters: { all: 'All', images: 'Images', text: 'Text', website: 'Website', audio: 'Audio' },
    sections: { images: '🖼️ Images', docs: '📄 Documents & More' },
    share: { title: 'Share', via: 'Share Via', deleteFromLib: 'Delete from Library' },
    cloud: { rnaiDesc: 'Unlimited storage · Auto backup · Share links', otherDesc: 'Sync your creations automatically', upgrade: 'Upgrade', soon: 'Soon' },
    alerts: {
      savedToRoll: '✅ Saved to Camera Roll', permDenied: 'Please allow access to your photos in Settings',
      deleteTitle: 'Delete', deleteMsg: 'Delete',
      rnaiCloud: 'Upgrade to Pro for unlimited storage, auto-backup and share links',
      rnaiUpgrade: 'Upgrade', rnaiLater: 'Later',
      comingSoon: 'Coming soon! We\'re working on this integration.', comingOk: 'OK',
    },
  },
  aiManager: {
    subtitle: 'Intelligence Hub', title: 'AI Manager', activeLabel: 'Active',
    tabs: { models: 'AI Models', wallet: 'Wallet' },
    soonBadge: 'SOON',
    activeModel: 'Active Model', quickChat: 'Quick Chat',
    chatPlaceholder: 'Ask something...', send: 'Send', thinking: 'is thinking...', demoResponse: 'This is a demo response. Connect to Ollama or download a model to get real AI responses.',
    ollamaTitle: 'Connect Ollama', ollamaDesc: 'Enter your Ollama server URL on LAN', ollamaPlaceholder: 'http://192.168.x.x:11434', ollamaConnect: 'Connect',
    modelStatus: { connect: 'LAN Connect', featured: '⭐ Featured', available: 'Available' },
    modelDownload: 'Download', modelConnected: 'Connected',
    wallet: {
      title: 'Digital Wallet', totalBalance: 'Total Balance',
      receive: 'Receive', send: 'Send', scan: 'Scan',
      assets: 'Assets', comingSoon: 'Coming Soon',
      selfCustodialTitle: 'Self-Custodial Wallet', selfCustodialDesc: 'You control everything · Private Key on device · No intermediary',
      createBtn: '✨ Create New Wallet', addressCopied: 'Address copied', displayOnly: 'Display only — identity verification required before activation',
      truemoney: {
        sectionTitle: 'Top Up via TrueMoney',
        tagline: 'Use a TrueMoney Gift Voucher from 7-Eleven',
        inputLabel: 'Paste Gift Voucher link or code',
        inputPlaceholder: 'https://gift.truemoney.com/campaign/?v=... or 16-digit code',
        redeemBtn: '🎁 Redeem Credits',
        redeeming: 'Redeeming...',
        successTitle: '✅ Redeemed!',
        successDesc: 'You received {credits} credits (฿{baht})',
        alreadyUsed: 'This voucher has already been used or has expired',
        invalidVoucher: 'Invalid code — please check and try again',
        howToTitle: 'How to get a Gift Voucher',
        step1: '1. Buy a TrueMoney Gift Card at 7-Eleven or the TrueMoney App',
        step2: '2. Get the Gift Voucher link or 16-digit PIN',
        step3: '3. Paste it above and tap "Redeem Credits"',
        howToNote: '฿1 ≈ 10 AI Credits · No expiration',
      },
    },
    legal: 'Self-Custodial: You are responsible for your own Private Key. This app does not offer exchange or deposit services.',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇯🇵 JAPANESE
// ─────────────────────────────────────────────────────────────────────────────
const ja: Translations = {
  tabs: { home: 'ホーム', create: '作成', library: 'ライブラリ', ai: 'AI', profile: 'プロフィール' },

  common: {
    save: '保存', cancel: 'キャンセル', back: '戻る', close: '閉じる',
    search: '検索', clear: 'クリア', viewAll: 'すべて表示', seeAll: 'すべて見る',
    tapToUse: 'タップして使用', newCreation: '新規作成',
    execute: '実行', processing: '処理中...',
    yes: 'はい', no: 'いいえ', ok: 'OK', confirm: '確認',
    loading: '読み込み中...', error: 'エラー', success: '成功',
  },
  home: {
    greeting: { morning: 'おはようございます', afternoon: 'こんにちは', evening: 'こんばんは' },
    poweredBy: 'AI搭載',
    tagline: '何でも作れる',
    taglineHighlight: '瞬時に',
    startCreating: '作成を始める',
    generateBtn: '🎨 画像生成',
    creditsLabel: 'クレジット',
    stats: { generations: '生成数', creditsUsed: '使用クレジット', dayStreak: '連続日数' },
    sections: { aiTools: 'AIツール', allSkills: 'すべてのスキル', history: '履歴', recentCreations: '最近の作品' },
    skillBadges: { hot: '人気 🔥', new: '新着 ✨', top: 'TOP' },
    promo: { badge: '期間限定', title: 'Proにアップグレード ⭐', desc: '無制限生成 · HD品質', btn: '詳細 →' },
  },
  create: {
    title: 'プレイグラウンド',
    subtitle: 'スキルを選んで始めましょう',
    searchPlaceholder: '🔍  スキルを検索...',
    availableSkills: '利用可能なスキル',
    noSkills: 'スキルが見つかりません',
  },
  profile: {
    editBtn: 'プロフィール編集',
    tapToChange: 'タップして写真を変更',
    emailNote: 'メールアドレスの変更はサポートにお問い合わせください。',
    plans: { free: '無料', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: '利用可能クレジット', of: '/', remaining: '% 残り', resets: 'リセット', topUp: '追加' },
    stats: { monthly: '今月の\n生成数', total: '合計\n作品数', streak: '連続\n日数 🔥' },
    sections: {
      account: 'アカウント', preferences: '設定', storage: 'ストレージとデータ',
      security: 'セキュリティ', support: 'サポート', about: 'アプリについて', actions: 'アカウント操作',
    },
    fields: {
      displayName: '表示名', email: 'メール', subscription: 'プラン', billing: '支払い管理',
      language: '言語', theme: 'テーマ', imageQuality: '画像品質',
      pushNotifications: 'プッシュ通知', emailUpdates: 'メール更新',
      autoSave: '自動保存', wifiOnly: 'Wi-Fiのみ (HD)',
      clearCache: 'キャッシュをクリア', changePassword: 'パスワード変更',
      twoFA: '二段階認証', loginActivity: 'ログイン履歴',
      helpCenter: 'ヘルプセンター', rateApp: 'アプリを評価',
      feedback: 'フィードバック', privacy: 'プライバシーポリシー',
      terms: '利用規約', appVersion: 'アプリバージョン',
      apiStatus: 'APIステータス', signOut: 'サインアウト', deleteAccount: 'アカウント削除',
    },
    quality: { standard: 'スタンダード', standardDesc: '512×512 · 高速', hd: 'HD', hdDesc: '1024×1024 · バランス', ultra: 'Ultra HD', ultraDesc: '2048×2048 · 低速' },
    themes: { vibrant: 'ビビッド 🎨', brand: 'ブランド', modern: 'モダン' },
    modals: { editTitle: 'プロフィール編集', languageTitle: '言語', qualityTitle: '画像品質' },
    signOutDialog:  { title: 'サインアウト', message: 'サインアウトしますか？', confirm: 'サインアウト' },
    deleteDialog:   { title: '⚠️ アカウント削除', message: 'アカウントとすべてのデータが完全に削除されます。この操作は取り消せません。', confirm: '削除' },
    alerts: {
      emailCannotChange: '現在メールアドレスは変更できません',
      billingMsg: '支払い方法の管理', upgradeMsg: 'プランを確認',
      clearCacheMsg: 'キャッシュをクリアしました',
      loginActivityMsg: '最終ログイン: 本日 10:42\nデバイス: iPhone 15 Pro\n場所: バンコク',
      rateMsg: 'ご支援ありがとうございます！🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'リセットリンクをメールに送信します',
      apiOperational: '🟢 正常稼働',
    },
    proStatusLabel: '⭐ Proプラン',
    operationalLabel: '🟢 正常稼働',
  },
  skill: {
    inputLabel: '入力',
    quickPrompts: '⚡ クイックプロンプト',
    examplesLabel: '✨ 出力例',
    placeholders: { image: '作成したい画像を説明してください...', audio: '音声に変換するテキストを入力...', text: 'テキストや指示を入力...' },
    chars: '文字', execute: '実行', processing: '処理中...',
    templatesCount: 'テンプレート', aiProcessing: 'AI処理中...',
    resultLabel: '結果',
  },
  skills: {
    'image-gen':    { name: '画像生成',       description: 'テキストから独自の画像を作成',           tagline: 'テキスト → 画像' },
    'image-edit':   { name: '画像編集',       description: 'AIで画像を修正・加工',                   tagline: '修正・加工' },
    'remove-bg':    { name: '背景削除',       description: '背景をきれいに削除',                     tagline: '背景除去' },
    'upscale':      { name: '高解像度化',     description: '画像の解像度と細部を向上',               tagline: 'HD向上' },
    'stylize':      { name: 'スタイル変換',   description: '写真をアート作品に変換',                 tagline: 'アートスタイル' },
    'text-gen':     { name: 'テキスト生成',   description: 'AIによる文章作成',                       tagline: 'AIライター' },
    'text-sum':     { name: '要約',           description: '長いコンテンツを簡潔に要約',             tagline: 'スマート要約' },
    'text-trans':   { name: '翻訳',           description: '50以上の言語に自然に翻訳',               tagline: '50+言語' },
    'text-rewrite': { name: '書き直し',       description: 'テキストのトーンとスタイルを変更',       tagline: 'あらゆるトーン' },
    'website-gen':  { name: 'サイト生成',     description: 'AIで美しいウェブサイトを作成',           tagline: 'AIで構築' },
    'audio-tts':    { name: '読み上げ',       description: 'テキストを自然な音声に変換',             tagline: '自然音声' },
    'image-describe': { name: '画像解析',       description: 'AIで画像を詳細に分析・説明',                    tagline: 'Vision AI' },
    'face-restore':   { name: '顔写真修復',     description: '古い写真や不鮮明な写真の顔を修復・強調',        tagline: 'HD顔修復' },
    'text-grammar':   { name: '文法チェック',   description: 'AIで文法・スペル・句読点を修正',               tagline: '完璧な文章' },
    'text-code':      { name: 'コード生成',     description: '自然言語の説明からコードを生成',               tagline: 'AIコーダー' },
    'text-hashtag':   { name: 'ハッシュタグ生成', description: 'あらゆるプラットフォームに最適なハッシュタグを作成', tagline: 'リーチ拡大' },
  },
  languages: en.languages,
  library: { ...en.library, subtitle: 'ワークスペース', title: 'ライブラリ', items: '件', favorites: 'お気に入り', noItems: 'アイテムなし', noItemsDesc: '作品を作成して保存するとここに表示されます', localStorage: 'ローカルストレージ', cloudStorage: 'クラウドストレージ', connectSync: '接続と同期', filters: { all: 'すべて', images: '画像', text: 'テキスト', website: 'ウェブ', audio: '音声' }, sections: { images: '🖼️ 画像', docs: '📄 ドキュメント' }, share: { title: '共有', via: '共有方法', deleteFromLib: 'ライブラリから削除' }, cloud: { ...en.library.cloud, upgrade: 'アップグレード', soon: 'まもなく' }, alerts: { ...en.library.alerts, savedToRoll: '✅ カメラロールに保存しました', deleteTitle: '削除', rnaiUpgrade: 'アップグレード', rnaiLater: '後で', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'インテリジェンスハブ', title: 'AI マネージャー', activeLabel: 'アクティブ', tabs: { models: 'AIモデル', wallet: 'ウォレット' }, soonBadge: 'もうすぐ', activeModel: 'アクティブモデル', quickChat: 'クイックチャット', chatPlaceholder: '何でも聞いてください...', send: '送信', thinking: '考え中...', modelStatus: { connect: 'LAN接続', featured: '⭐ おすすめ', available: '利用可能' }, modelDownload: 'ダウンロード', modelConnected: '接続済み', wallet: { ...en.aiManager.wallet, title: 'デジタルウォレット', totalBalance: '合計残高', receive: '受取', send: '送金', scan: 'スキャン', assets: '資産', comingSoon: 'まもなく', selfCustodialTitle: 'セルフカストディアルウォレット', createBtn: '✨ 新しいウォレットを作成', addressCopied: 'アドレスをコピーしました' }, legal: 'セルフカストディアル：ご自身の秘密鍵を管理してください。このアプリは取引所や預金サービスを提供しません。' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇨🇳 CHINESE (Simplified)
// ─────────────────────────────────────────────────────────────────────────────
const zh: Translations = {
  tabs: { home: '首页', create: '创作', library: '库', ai: 'AI', profile: '我的' },
  common: {
    save: '保存', cancel: '取消', back: '返回', close: '关闭',
    search: '搜索', clear: '清除', viewAll: '查看全部', seeAll: '查看全部',
    tapToUse: '点击使用', newCreation: '新建作品',
    execute: '执行', processing: '处理中...',
    yes: '是', no: '否', ok: '确定', confirm: '确认',
    loading: '加载中...', error: '错误', success: '成功',
  },
  home: {
    greeting: { morning: '早上好', afternoon: '下午好', evening: '晚上好' },
    poweredBy: 'AI 驱动',
    tagline: '创作无限可能',
    taglineHighlight: '立刻实现',
    startCreating: '开始创作',
    generateBtn: '🎨 生成图像',
    creditsLabel: '积分',
    stats: { generations: '生成次数', creditsUsed: '已用积分', dayStreak: '连续天数' },
    sections: { aiTools: 'AI 工具', allSkills: '全部技能', history: '历史', recentCreations: '最近作品' },
    skillBadges: { hot: '热门 🔥', new: '最新 ✨', top: '精选' },
    promo: { badge: '限时优惠', title: '升级到 Pro ⭐', desc: '无限生成 · 高清画质', btn: '查看 →' },
  },
  create: {
    title: '创作台',
    subtitle: '选择一个技能开始',
    searchPlaceholder: '🔍  搜索技能...',
    availableSkills: '可用技能',
    noSkills: '未找到技能',
  },
  profile: {
    editBtn: '编辑资料',
    tapToChange: '点击更换照片',
    emailNote: '如需更改邮箱，请联系客服。',
    plans: { free: '免费版', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: '可用积分', of: '/', remaining: '% 剩余', resets: '重置', topUp: '充值' },
    stats: { monthly: '本月\n生成次数', total: '总计\n作品数', streak: '连续\n天数 🔥' },
    sections: {
      account: '账号', preferences: '偏好设置', storage: '存储与数据',
      security: '安全', support: '帮助与支持', about: '关于', actions: '账号管理',
    },
    fields: {
      displayName: '显示名称', email: '邮箱', subscription: '套餐', billing: '账单管理',
      language: '语言', theme: '主题', imageQuality: '图像质量',
      pushNotifications: '推送通知', emailUpdates: '邮件更新',
      autoSave: '自动保存结果', wifiOnly: '仅限 Wi-Fi（高清）',
      clearCache: '清除缓存', changePassword: '修改密码',
      twoFA: '两步验证', loginActivity: '登录记录',
      helpCenter: '帮助中心', rateApp: '为应用评分',
      feedback: '发送反馈', privacy: '隐私政策',
      terms: '服务条款', appVersion: '应用版本',
      apiStatus: 'API 状态', signOut: '退出登录', deleteAccount: '删除账号',
    },
    quality: { standard: '标准', standardDesc: '512×512 · 快速', hd: '高清', hdDesc: '1024×1024 · 均衡', ultra: '超高清', ultraDesc: '2048×2048 · 较慢' },
    themes: { vibrant: '炫彩 🎨', brand: '品牌', modern: '现代' },
    modals: { editTitle: '编辑资料', languageTitle: '语言', qualityTitle: '图像质量' },
    signOutDialog:  { title: '退出登录', message: '确定要退出登录吗？', confirm: '退出' },
    deleteDialog:   { title: '⚠️ 删除账号', message: '此操作将永久删除您的账号和所有数据，无法恢复。', confirm: '删除' },
    alerts: {
      emailCannotChange: '目前无法更改邮箱地址',
      billingMsg: '管理支付方式', upgradeMsg: '查看套餐选项',
      clearCacheMsg: '缓存清除成功',
      loginActivityMsg: '最近登录：今天 10:42\n设备：iPhone 15 Pro\n地点：曼谷',
      rateMsg: '感谢您的支持！🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: '重置链接将发送到您的邮箱',
      apiOperational: '🟢 正常运行',
    },
    proStatusLabel: '⭐ Pro 套餐',
    operationalLabel: '🟢 正常运行',
  },
  skill: {
    inputLabel: '输入内容',
    quickPrompts: '⚡ 快速提示词',
    examplesLabel: '✨ 示例效果',
    placeholders: { image: '描述您想创建的图像...', audio: '输入要转换为语音的文本...', text: '输入您的文本或指令...' },
    chars: '字符', execute: '执行', processing: '处理中...',
    templatesCount: '模板', aiProcessing: 'AI 处理中...',
    resultLabel: '结果',
  },
  skills: {
    'image-gen':    { name: '图像生成',   description: '通过文字描述创建独特图像',         tagline: '文字 → 图像' },
    'image-edit':   { name: '图像编辑',   description: '用 AI 修改和优化图像',             tagline: '修改优化' },
    'remove-bg':    { name: '背景去除',   description: '精准去除图像背景',                 tagline: '精准抠图' },
    'upscale':      { name: '图像超分',   description: '提升图像分辨率和细节',             tagline: '高清增强' },
    'stylize':      { name: '风格化',     description: '将照片转换为艺术风格',             tagline: '艺术风格' },
    'text-gen':     { name: '文字生成',   description: '用 AI 撰写引人入胜的内容',         tagline: 'AI 写作' },
    'text-sum':     { name: '文字摘要',   description: '将长文快速提炼为精华',             tagline: '智能摘要' },
    'text-trans':   { name: '翻译',       description: '自然流畅地翻译 50 多种语言',       tagline: '50+ 语言' },
    'text-rewrite': { name: '改写文字',   description: '调整文字的语气和风格',             tagline: '任意风格' },
    'website-gen':  { name: '网站生成',   description: '用 AI 构建精美网站',               tagline: 'AI 建站' },
    'audio-tts':    { name: '文字转语音', description: '将文字转换为自然语音',             tagline: '自然语音' },
    'image-describe': { name: '图像分析',   description: 'AI详细描述和分析图像',                   tagline: 'Vision AI' },
    'face-restore':   { name: '人脸修复',   description: '修复和增强旧照片或模糊照片中的人脸',     tagline: 'HD人脸修复' },
    'text-grammar':   { name: '语法检查',   description: '用AI修正语法、拼写和标点',               tagline: '完美文字' },
    'text-code':      { name: '代码生成',   description: '通过自然语言描述生成代码',               tagline: 'AI编程' },
    'text-hashtag':   { name: '标签生成',   description: '为任何平台创建完美的话题标签',           tagline: '提升曝光' },
  },
  languages: en.languages,
  library: { ...en.library, subtitle: '我的工作区', title: '素材库', items: '个项目', favorites: '收藏', noItems: '暂无内容', noItemsDesc: '创建作品并保存，即可在此查看', localStorage: '本地存储', cloudStorage: '云存储', connectSync: '连接与同步', filters: { all: '全部', images: '图片', text: '文本', website: '网站', audio: '音频' }, sections: { images: '🖼️ 图片', docs: '📄 文档及更多' }, share: { title: '分享', via: '分享方式', deleteFromLib: '从素材库删除' }, cloud: { ...en.library.cloud, upgrade: '升级', soon: '即将推出' }, alerts: { ...en.library.alerts, savedToRoll: '✅ 已保存至相册', deleteTitle: '删除', rnaiUpgrade: '升级', rnaiLater: '稍后', comingOk: '好的' } },
  aiManager: { ...en.aiManager, subtitle: '智能中心', title: 'AI 管理器', activeLabel: '运行中', tabs: { models: 'AI 模型', wallet: '钱包' }, soonBadge: '即将推出', activeModel: '当前模型', quickChat: '快速对话', chatPlaceholder: '输入问题...', send: '发送', thinking: '思考中...', modelStatus: { connect: '局域网连接', featured: '⭐ 推荐', available: '可用' }, modelDownload: '下载', modelConnected: '已连接', wallet: { ...en.aiManager.wallet, title: '数字钱包', totalBalance: '总余额', receive: '收款', send: '转账', scan: '扫码', assets: '资产', comingSoon: '即将推出', selfCustodialTitle: '自托管钱包', createBtn: '✨ 创建新钱包', addressCopied: '地址已复制' }, legal: '自托管：您需自行保管私钥。本应用不提供交易所或存款服务。' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇰🇷 KOREAN
// ─────────────────────────────────────────────────────────────────────────────
const ko: Translations = {
  tabs: { home: '홈', create: '만들기', library: '보관함', ai: 'AI', profile: '프로필' },
  common: {
    save: '저장', cancel: '취소', back: '뒤로', close: '닫기',
    search: '검색', clear: '초기화', viewAll: '전체보기', seeAll: '전체보기',
    tapToUse: '탭하여 사용', newCreation: '새로 만들기',
    execute: '실행', processing: '처리 중...',
    yes: '예', no: '아니오', ok: '확인', confirm: '확인',
    loading: '로딩 중...', error: '오류', success: '성공',
  },
  home: {
    greeting: { morning: '좋은 아침이에요', afternoon: '좋은 오후예요', evening: '좋은 저녁이에요' },
    poweredBy: 'AI 기반',
    tagline: '무엇이든 만들 수 있어요',
    taglineHighlight: '지금 바로',
    startCreating: '만들기 시작',
    generateBtn: '🎨 이미지 생성',
    creditsLabel: '크레딧',
    stats: { generations: '생성 횟수', creditsUsed: '사용 크레딧', dayStreak: '연속 일수' },
    sections: { aiTools: 'AI 도구', allSkills: '모든 스킬', history: '기록', recentCreations: '최근 작품' },
    skillBadges: { hot: '인기 🔥', new: '신규 ✨', top: 'TOP' },
    promo: { badge: '한정 혜택', title: 'Pro로 업그레이드 ⭐', desc: '무제한 생성 · HD 품질', btn: '보기 →' },
  },
  create: {
    title: '플레이그라운드',
    subtitle: '스킬을 선택해 시작하세요',
    searchPlaceholder: '🔍  스킬 검색...',
    availableSkills: '사용 가능한 스킬',
    noSkills: '스킬을 찾을 수 없어요',
  },
  profile: {
    editBtn: '프로필 편집',
    tapToChange: '탭하여 사진 변경',
    emailNote: '이메일 변경은 고객 지원에 문의하세요.',
    plans: { free: '무료', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: '사용 가능 크레딧', of: '/', remaining: '% 남음', resets: '초기화', topUp: '충전' },
    stats: { monthly: '이번 달\n생성 수', total: '총\n작품 수', streak: '연속\n일수 🔥' },
    sections: {
      account: '계정', preferences: '환경 설정', storage: '저장소 및 데이터',
      security: '보안', support: '지원', about: '앱 정보', actions: '계정 관리',
    },
    fields: {
      displayName: '표시 이름', email: '이메일', subscription: '구독', billing: '결제 관리',
      language: '언어', theme: '테마', imageQuality: '이미지 품질',
      pushNotifications: '푸시 알림', emailUpdates: '이메일 업데이트',
      autoSave: '결과 자동 저장', wifiOnly: 'Wi-Fi만 사용 (HD)',
      clearCache: '캐시 지우기', changePassword: '비밀번호 변경',
      twoFA: '2단계 인증', loginActivity: '로그인 기록',
      helpCenter: '도움말', rateApp: '앱 평가',
      feedback: '피드백 보내기', privacy: '개인정보처리방침',
      terms: '이용 약관', appVersion: '앱 버전',
      apiStatus: 'API 상태', signOut: '로그아웃', deleteAccount: '계정 삭제',
    },
    quality: { standard: '표준', standardDesc: '512×512 · 빠름', hd: 'HD', hdDesc: '1024×1024 · 균형', ultra: 'Ultra HD', ultraDesc: '2048×2048 · 느림' },
    themes: { vibrant: '비비드 🎨', brand: '브랜드', modern: '모던' },
    modals: { editTitle: '프로필 편집', languageTitle: '언어', qualityTitle: '이미지 품질' },
    signOutDialog:  { title: '로그아웃', message: '정말 로그아웃 하시겠어요?', confirm: '로그아웃' },
    deleteDialog:   { title: '⚠️ 계정 삭제', message: '이 작업은 계정과 모든 데이터를 영구적으로 삭제합니다. 되돌릴 수 없습니다.', confirm: '삭제' },
    alerts: {
      emailCannotChange: '현재 이메일을 변경할 수 없어요',
      billingMsg: '결제 수단 관리', upgradeMsg: '요금제 보기',
      clearCacheMsg: '캐시가 삭제되었어요',
      loginActivityMsg: '마지막 로그인: 오늘 10:42\n기기: iPhone 15 Pro\n위치: 방콕',
      rateMsg: '응원해주셔서 감사해요! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: '재설정 링크를 이메일로 보내드릴게요',
      apiOperational: '🟢 정상 운영',
    },
    proStatusLabel: '⭐ Pro 플랜',
    operationalLabel: '🟢 정상 운영',
  },
  skill: {
    inputLabel: '입력',
    quickPrompts: '⚡ 빠른 프롬프트',
    examplesLabel: '✨ 결과 예시',
    placeholders: { image: '만들고 싶은 이미지를 설명해주세요...', audio: '음성으로 변환할 텍스트를 입력하세요...', text: '텍스트나 지시사항을 입력하세요...' },
    chars: '자', execute: '실행', processing: '처리 중...',
    templatesCount: '템플릿', aiProcessing: 'AI 처리 중...',
    resultLabel: '결과',
  },
  skills: {
    'image-gen':    { name: '이미지 생성',  description: '텍스트로 고유한 이미지 생성',      tagline: '텍스트 → 이미지' },
    'image-edit':   { name: '이미지 편집',  description: 'AI로 이미지 수정 및 향상',          tagline: '수정 및 향상' },
    'remove-bg':    { name: '배경 제거',    description: '배경을 깔끔하게 분리',              tagline: '깔끔한 분리' },
    'upscale':      { name: '화질 향상',    description: '해상도와 디테일 향상',              tagline: 'HD 향상' },
    'stylize':      { name: '스타일 변환',  description: '사진을 아트 스타일로 변환',         tagline: '아트 스타일' },
    'text-gen':     { name: '텍스트 생성',  description: 'AI로 매력적인 콘텐츠 작성',         tagline: 'AI 작가' },
    'text-sum':     { name: '텍스트 요약',  description: '긴 내용을 명확하게 요약',           tagline: '스마트 요약' },
    'text-trans':   { name: '번역',         description: '50개 이상 언어로 자연스럽게 번역',  tagline: '50+ 언어' },
    'text-rewrite': { name: '텍스트 수정',  description: '톤과 스타일을 원하는 대로 변환',   tagline: '모든 톤' },
    'website-gen':  { name: '웹사이트 생성', description: 'AI로 아름다운 웹사이트 구축',      tagline: 'AI로 구축' },
    'audio-tts':    { name: '텍스트 → 음성', description: '텍스트를 자연스러운 음성으로 변환', tagline: '자연스러운 음성' },
    'image-describe': { name: '이미지 분석',   description: 'AI로 이미지를 상세히 설명·분석',        tagline: 'Vision AI' },
    'face-restore':   { name: '얼굴 복원',     description: '오래되거나 흐린 사진의 얼굴을 복원',    tagline: 'HD 얼굴 복원' },
    'text-grammar':   { name: '문법 교정',     description: 'AI로 문법·맞춤법·구두점 교정',         tagline: '완벽한 문장' },
    'text-code':      { name: '코드 생성',     description: '자연어 설명으로 코드 생성',             tagline: 'AI 코더' },
    'text-hashtag':   { name: '해시태그 생성', description: '모든 플랫폼에 최적화된 해시태그 생성',  tagline: '도달 향상' },
  },
  languages: en.languages,
  library: { ...en.library, subtitle: '내 작업공간', title: '보관함', items: '개 항목', favorites: '즐겨찾기', noItems: '항목 없음', noItemsDesc: '작품을 만들고 저장하면 여기에 표시됩니다', localStorage: '로컬 저장소', cloudStorage: '클라우드 저장소', connectSync: '연결 및 동기화', filters: { all: '전체', images: '이미지', text: '텍스트', website: '웹사이트', audio: '오디오' }, sections: { images: '🖼️ 이미지', docs: '📄 문서 및 기타' }, share: { title: '공유', via: '공유 방법', deleteFromLib: '보관함에서 삭제' }, cloud: { ...en.library.cloud, upgrade: '업그레이드', soon: '곧 출시' }, alerts: { ...en.library.alerts, savedToRoll: '✅ 카메라 롤에 저장됨', deleteTitle: '삭제', rnaiUpgrade: '업그레이드', rnaiLater: '나중에', comingOk: '확인' } },
  aiManager: { ...en.aiManager, subtitle: '인텔리전스 허브', title: 'AI 매니저', activeLabel: '활성', tabs: { models: 'AI 모델', wallet: '지갑' }, soonBadge: '곧 출시', activeModel: '활성 모델', quickChat: '빠른 채팅', chatPlaceholder: '무엇이든 물어보세요...', send: '전송', thinking: '생각 중...', modelStatus: { connect: 'LAN 연결', featured: '⭐ 추천', available: '사용 가능' }, modelDownload: '다운로드', modelConnected: '연결됨', wallet: { ...en.aiManager.wallet, title: '디지털 지갑', totalBalance: '총 잔액', receive: '받기', send: '보내기', scan: '스캔', assets: '자산', comingSoon: '곧 출시', selfCustodialTitle: '자기 관리형 지갑', createBtn: '✨ 새 지갑 만들기', addressCopied: '주소 복사됨' }, legal: '자기 관리: 개인 키는 본인이 직접 관리하세요. 이 앱은 거래소나 예금 서비스를 제공하지 않습니다.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇫🇷 FRENCH
// ─────────────────────────────────────────────────────────────────────────────
const fr: Translations = {
  tabs: { home: 'Accueil', create: 'Créer', library: 'Médiathèque', ai: 'IA', profile: 'Profil' },
  common: {
    save: 'Enregistrer', cancel: 'Annuler', back: 'Retour', close: 'Fermer',
    search: 'Rechercher', clear: 'Effacer', viewAll: 'Tout voir', seeAll: 'Tout voir',
    tapToUse: 'Appuyer pour utiliser', newCreation: 'Nouvelle création',
    execute: 'Exécuter', processing: 'Traitement...',
    yes: 'Oui', no: 'Non', ok: 'OK', confirm: 'Confirmer',
    loading: 'Chargement...', error: 'Erreur', success: 'Succès',
  },
  home: {
    greeting: { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir' },
    poweredBy: 'Propulsé par IA',
    tagline: 'Créez n\'importe quoi',
    taglineHighlight: 'Instantanément',
    startCreating: 'Commencer à créer',
    generateBtn: '🎨 Générer',
    creditsLabel: 'Crédits',
    stats: { generations: 'Générations', creditsUsed: 'Crédits utilisés', dayStreak: 'Jours consécutifs' },
    sections: { aiTools: 'Outils IA', allSkills: 'Toutes les compétences', history: 'Historique', recentCreations: 'Créations récentes' },
    skillBadges: { hot: 'POPULAIRE 🔥', new: 'NOUVEAU ✨', top: 'TOP' },
    promo: { badge: 'Offre limitée', title: 'Passer à Pro ⭐', desc: 'Générations illimitées · Qualité HD', btn: 'Voir →' },
  },
  create: {
    title: 'Terrain de jeu',
    subtitle: 'Sélectionnez une compétence',
    searchPlaceholder: '🔍  Rechercher des compétences...',
    availableSkills: 'Compétences disponibles',
    noSkills: 'Aucune compétence trouvée',
  },
  profile: {
    editBtn: 'Modifier le profil',
    tapToChange: 'Appuyer pour changer la photo',
    emailNote: 'Contactez le support pour changer votre adresse e-mail.',
    plans: { free: 'Gratuit', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'CRÉDITS DISPONIBLES', of: 'sur', remaining: '% restant', resets: 'Réinitialisation', topUp: 'Recharger' },
    stats: { monthly: 'Générations\nCe mois', total: 'Total\nCréations', streak: 'Jours\nconsécutifs 🔥' },
    sections: {
      account: 'Compte', preferences: 'Préférences', storage: 'Stockage et données',
      security: 'Sécurité', support: 'Assistance', about: 'À propos', actions: 'Gestion du compte',
    },
    fields: {
      displayName: 'Nom affiché', email: 'E-mail', subscription: 'Abonnement', billing: 'Facturation',
      language: 'Langue', theme: 'Thème', imageQuality: 'Qualité d\'image',
      pushNotifications: 'Notifications push', emailUpdates: 'Mises à jour par e-mail',
      autoSave: 'Sauvegarde auto', wifiOnly: 'Wi-Fi uniquement (HD)',
      clearCache: 'Vider le cache', changePassword: 'Changer le mot de passe',
      twoFA: 'Authentification à deux facteurs', loginActivity: 'Activité de connexion',
      helpCenter: 'Centre d\'aide', rateApp: 'Évaluer l\'app',
      feedback: 'Envoyer un avis', privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation', appVersion: 'Version de l\'app',
      apiStatus: 'Statut API', signOut: 'Se déconnecter', deleteAccount: 'Supprimer le compte',
    },
    quality: { standard: 'Standard', standardDesc: '512×512 · Rapide', hd: 'HD', hdDesc: '1024×1024 · Équilibré', ultra: 'Ultra HD', ultraDesc: '2048×2048 · Lent' },
    themes: { vibrant: 'Vibrant 🎨', brand: 'Marque', modern: 'Moderne' },
    modals: { editTitle: 'Modifier le profil', languageTitle: 'Langue', qualityTitle: 'Qualité d\'image' },
    signOutDialog:  { title: 'Déconnexion', message: 'Voulez-vous vraiment vous déconnecter ?', confirm: 'Se déconnecter' },
    deleteDialog:   { title: '⚠️ Supprimer le compte', message: 'Cela supprimera définitivement votre compte et toutes vos données. Cette action est irréversible.', confirm: 'Supprimer' },
    alerts: {
      emailCannotChange: 'Impossible de changer l\'e-mail actuellement',
      billingMsg: 'Gérer les moyens de paiement', upgradeMsg: 'Voir les options d\'abonnement',
      clearCacheMsg: 'Cache vidé avec succès',
      loginActivityMsg: 'Dernière connexion : Aujourd\'hui, 10h42\nAppareil : iPhone 15 Pro\nLieu : Bangkok',
      rateMsg: 'Merci pour votre soutien ! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'Un lien de réinitialisation sera envoyé par e-mail',
      apiOperational: '🟢 Opérationnel',
    },
    proStatusLabel: '⭐ Plan Pro',
    operationalLabel: '🟢 Opérationnel',
  },
  skill: {
    inputLabel: 'Entrée',
    quickPrompts: '⚡ Prompts rapides',
    examplesLabel: '✨ Exemples de résultats',
    placeholders: { image: 'Décrivez l\'image que vous souhaitez créer...', audio: 'Entrez le texte à convertir en parole...', text: 'Entrez votre texte ou vos instructions...' },
    chars: 'car.', execute: 'Exécuter', processing: 'Traitement...',
    templatesCount: 'Modèles', aiProcessing: 'IA en cours de traitement...',
    resultLabel: 'Résultat',
  },
  skills: {
    'image-gen':    { name: 'Générer une image',   description: 'Créez des images uniques à partir de texte',       tagline: 'Texte → Image' },
    'image-edit':   { name: 'Modifier une image',  description: 'Retouchez et améliorez vos images avec l\'IA',     tagline: 'Modifier et améliorer' },
    'remove-bg':    { name: 'Supprimer le fond',   description: 'Isolez les sujets de n\'importe quel arrière-plan', tagline: 'Détourage précis' },
    'upscale':      { name: 'Agrandir l\'image',   description: 'Améliorez la résolution et les détails',           tagline: 'Amélioration HD' },
    'stylize':      { name: 'Styliser l\'image',   description: 'Transformez des photos en œuvres d\'art',          tagline: 'Styles artistiques' },
    'text-gen':     { name: 'Générer du texte',    description: 'Rédigez du contenu convaincant avec l\'IA',        tagline: 'Rédacteur IA' },
    'text-sum':     { name: 'Résumer le texte',    description: 'Condensez un long contenu en résumés clairs',      tagline: 'Résumé intelligent' },
    'text-trans':   { name: 'Traduire',            description: 'Traduisez naturellement dans plus de 50 langues',  tagline: '50+ langues' },
    'text-rewrite': { name: 'Réécrire',            description: 'Transformez le ton et le style de tout texte',     tagline: 'Tous les tons' },
    'website-gen':  { name: 'Créer un site web',   description: 'Construisez de beaux sites web avec l\'IA',        tagline: 'Créé par IA' },
    'audio-tts':    { name: 'Texte en parole',     description: 'Convertissez du texte en audio naturel',           tagline: 'Voix naturelle' },
    'image-describe': { name: "Analyser l'image",      description: "L'IA décrit et analyse n'importe quelle image",   tagline: 'Vision IA' },
    'face-restore':   { name: 'Restaurer un visage',   description: 'Restaurez les visages dans les vieilles photos',  tagline: 'Réparation HD' },
    'text-grammar':   { name: 'Correction grammaticale', description: "Corrigez la grammaire, l'orthographe et la ponctuation", tagline: 'Texte parfait' },
    'text-code':      { name: 'Générateur de code',    description: 'Générez du code depuis une description en langage naturel', tagline: 'IA Codeuse' },
    'text-hashtag':   { name: 'Générateur de hashtags', description: 'Créez les hashtags parfaits pour chaque plateforme', tagline: 'Portée maximale' },
  },
  languages: en.languages,
  library: { ...en.library, subtitle: 'Mon espace', title: 'Bibliothèque', items: 'éléments', favorites: 'Favoris', noItems: 'Aucun élément', noItemsDesc: 'Créez quelque chose et enregistrez-le pour le voir ici', localStorage: 'Stockage local', cloudStorage: 'Stockage cloud', connectSync: 'Connecter et synchroniser', filters: { all: 'Tout', images: 'Images', text: 'Texte', website: 'Site web', audio: 'Audio' }, sections: { images: '🖼️ Images', docs: '📄 Documents et plus' }, share: { title: 'Partager', via: 'Partager via', deleteFromLib: 'Supprimer de la bibliothèque' }, cloud: { ...en.library.cloud, upgrade: 'Améliorer', soon: 'Bientôt' }, alerts: { ...en.library.alerts, savedToRoll: '✅ Enregistré dans la pellicule', deleteTitle: 'Supprimer', rnaiUpgrade: 'Améliorer', rnaiLater: 'Plus tard', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: "Centre d'intelligence", title: 'Gestionnaire IA', activeLabel: 'Actif', tabs: { models: 'Modèles IA', wallet: 'Portefeuille' }, soonBadge: 'BIENTÔT', activeModel: 'Modèle actif', quickChat: 'Chat rapide', chatPlaceholder: 'Posez une question...', send: 'Envoyer', thinking: 'réfléchit...', modelStatus: { connect: 'Connexion LAN', featured: '⭐ Recommandé', available: 'Disponible' }, modelDownload: 'Télécharger', modelConnected: 'Connecté', wallet: { ...en.aiManager.wallet, title: 'Portefeuille numérique', totalBalance: 'Solde total', receive: 'Recevoir', send: 'Envoyer', scan: 'Scanner', assets: 'Actifs', comingSoon: 'Bientôt', selfCustodialTitle: 'Portefeuille auto-géré', createBtn: '✨ Créer un nouveau portefeuille', addressCopied: 'Adresse copiée' }, legal: "Auto-géré : Vous êtes responsable de votre propre clé privée. Cette application n'offre pas de services d'échange ou de dépôt." },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇩🇪 GERMAN
// ─────────────────────────────────────────────────────────────────────────────
const de: Translations = {
  tabs: { home: 'Start', create: 'Erstellen', library: 'Bibliothek', ai: 'KI', profile: 'Profil' },
  common: {
    save: 'Speichern', cancel: 'Abbrechen', back: 'Zurück', close: 'Schließen',
    search: 'Suchen', clear: 'Löschen', viewAll: 'Alle anzeigen', seeAll: 'Alle sehen',
    tapToUse: 'Tippen zum Verwenden', newCreation: 'Neues Werk',
    execute: 'Ausführen', processing: 'Verarbeitung...',
    yes: 'Ja', no: 'Nein', ok: 'OK', confirm: 'Bestätigen',
    loading: 'Laden...', error: 'Fehler', success: 'Erfolg',
  },
  home: {
    greeting: { morning: 'Guten Morgen', afternoon: 'Guten Tag', evening: 'Guten Abend' },
    poweredBy: 'KI-gestützt',
    tagline: 'Erstelle alles',
    taglineHighlight: 'Sofort',
    startCreating: 'Erstellen beginnen',
    generateBtn: '🎨 Generieren',
    creditsLabel: 'Credits',
    stats: { generations: 'Generierungen', creditsUsed: 'Verwendete Credits', dayStreak: 'Tage in Folge' },
    sections: { aiTools: 'KI-Tools', allSkills: 'Alle Fähigkeiten', history: 'Verlauf', recentCreations: 'Letzte Werke' },
    skillBadges: { hot: 'BELIEBT 🔥', new: 'NEU ✨', top: 'TOP' },
    promo: { badge: 'Begrenztes Angebot', title: 'Auf Pro upgraden ⭐', desc: 'Unbegrenzte Generierungen · HD-Qualität', btn: 'Ansehen →' },
  },
  create: {
    title: 'Spielfeld',
    subtitle: 'Wähle eine Fähigkeit aus',
    searchPlaceholder: '🔍  Fähigkeiten suchen...',
    availableSkills: 'Verfügbare Fähigkeiten',
    noSkills: 'Keine Fähigkeiten gefunden',
  },
  profile: {
    editBtn: 'Profil bearbeiten',
    tapToChange: 'Tippen zum Foto ändern',
    emailNote: 'Kontaktiere den Support, um die E-Mail-Adresse zu ändern.',
    plans: { free: 'Kostenlos', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'VERFÜGBARE CREDITS', of: 'von', remaining: '% verbleibend', resets: 'Zurücksetzen', topUp: 'Aufladen' },
    stats: { monthly: 'Generierungen\nDiesen Monat', total: 'Gesamte\nWerke', streak: 'Tage in\nFolge 🔥' },
    sections: {
      account: 'Konto', preferences: 'Einstellungen', storage: 'Speicher & Daten',
      security: 'Sicherheit', support: 'Support', about: 'Über die App', actions: 'Kontoverwaltung',
    },
    fields: {
      displayName: 'Anzeigename', email: 'E-Mail', subscription: 'Abonnement', billing: 'Abrechnung',
      language: 'Sprache', theme: 'Design', imageQuality: 'Bildqualität',
      pushNotifications: 'Push-Benachrichtigungen', emailUpdates: 'E-Mail-Updates',
      autoSave: 'Ergebnisse automatisch speichern', wifiOnly: 'Nur WLAN (HD)',
      clearCache: 'Cache leeren', changePassword: 'Passwort ändern',
      twoFA: 'Zwei-Faktor-Authentifizierung', loginActivity: 'Anmeldeaktivität',
      helpCenter: 'Hilfezentrum', rateApp: 'Rnai bewerten',
      feedback: 'Feedback senden', privacy: 'Datenschutzrichtlinie',
      terms: 'Nutzungsbedingungen', appVersion: 'App-Version',
      apiStatus: 'API-Status', signOut: 'Abmelden', deleteAccount: 'Konto löschen',
    },
    quality: { standard: 'Standard', standardDesc: '512×512 · Schnell', hd: 'HD', hdDesc: '1024×1024 · Ausgewogen', ultra: 'Ultra HD', ultraDesc: '2048×2048 · Langsam' },
    themes: { vibrant: 'Lebhaft 🎨', brand: 'Marke', modern: 'Modern' },
    modals: { editTitle: 'Profil bearbeiten', languageTitle: 'Sprache', qualityTitle: 'Bildqualität' },
    signOutDialog:  { title: 'Abmelden', message: 'Möchtest du dich wirklich abmelden?', confirm: 'Abmelden' },
    deleteDialog:   { title: '⚠️ Konto löschen', message: 'Dies löscht dein Konto und alle Daten dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.', confirm: 'Löschen' },
    alerts: {
      emailCannotChange: 'E-Mail kann derzeit nicht geändert werden',
      billingMsg: 'Zahlungsmethoden verwalten', upgradeMsg: 'Planoptionen anzeigen',
      clearCacheMsg: 'Cache erfolgreich geleert',
      loginActivityMsg: 'Letzte Anmeldung: Heute, 10:42 Uhr\nGerät: iPhone 15 Pro\nOrt: Bangkok',
      rateMsg: 'Danke für deine Unterstützung! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'Ein Reset-Link wird an deine E-Mail gesendet',
      apiOperational: '🟢 Betrieb normal',
    },
    proStatusLabel: '⭐ Pro-Plan',
    operationalLabel: '🟢 Betrieb normal',
  },
  skill: {
    inputLabel: 'Eingabe',
    quickPrompts: '⚡ Schnelle Prompts',
    examplesLabel: '✨ Beispielergebnisse',
    placeholders: { image: 'Beschreibe das Bild, das du erstellen möchtest...', audio: 'Gib den Text ein, der in Sprache umgewandelt werden soll...', text: 'Gib deinen Text oder deine Anweisungen ein...' },
    chars: 'Zeichen', execute: 'Ausführen', processing: 'Verarbeitung...',
    templatesCount: 'Vorlagen', aiProcessing: 'KI verarbeitet...',
    resultLabel: 'Ergebnis',
  },
  skills: {
    'image-gen':    { name: 'Bild erstellen',      description: 'Einzigartige Bilder aus Textbeschreibungen erstellen', tagline: 'Text → Bild' },
    'image-edit':   { name: 'Bild bearbeiten',     description: 'Bilder mit KI bearbeiten und verbessern',              tagline: 'Bearbeiten & Verbessern' },
    'remove-bg':    { name: 'Hintergrund entfernen', description: 'Motive sauber vom Hintergrund trennen',              tagline: 'Präzise Freisteller' },
    'upscale':      { name: 'Bild hochskalieren',  description: 'Auflösung und Details verbessern',                     tagline: 'HD-Verbesserung' },
    'stylize':      { name: 'Bild stilisieren',    description: 'Fotos in Kunstwerke verwandeln',                       tagline: 'Kunststile' },
    'text-gen':     { name: 'Text erstellen',      description: 'Überzeugende Inhalte mit KI schreiben',                tagline: 'KI-Texter' },
    'text-sum':     { name: 'Text zusammenfassen', description: 'Lange Inhalte in klare Zusammenfassungen kondensieren', tagline: 'Intelligente Zusammenfassung' },
    'text-trans':   { name: 'Übersetzen',          description: 'Natürlich in über 50 Sprachen übersetzen',             tagline: '50+ Sprachen' },
    'text-rewrite': { name: 'Text umschreiben',    description: 'Ton und Stil beliebiger Texte transformieren',         tagline: 'Jeder Stil' },
    'website-gen':  { name: 'Website erstellen',   description: 'Schöne Websites mit KI bauen',                        tagline: 'Mit KI bauen' },
    'audio-tts':    { name: 'Text zu Sprache',     description: 'Text in natürlich klingendes Audio umwandeln',         tagline: 'Natürliche Stimme' },
    'image-describe': { name: 'Bild analysieren',      description: 'KI beschreibt und analysiert Bilder im Detail',      tagline: 'Vision KI' },
    'face-restore':   { name: 'Gesicht restaurieren',  description: 'Gesichter in alten oder unscharfen Fotos verbessern', tagline: 'HD-Gesichtsreparatur' },
    'text-grammar':   { name: 'Grammatik prüfen',      description: 'Grammatik, Rechtschreibung und Zeichensetzung korrigieren', tagline: 'Perfekter Text' },
    'text-code':      { name: 'Code erstellen',        description: 'Code aus Beschreibungen in natürlicher Sprache generieren', tagline: 'KI-Coder' },
    'text-hashtag':   { name: 'Hashtags erstellen',    description: 'Perfekte Hashtags für jede Plattform generieren',    tagline: 'Reichweite steigern' },
  },
  languages: en.languages,
  library: { ...en.library, subtitle: 'Mein Arbeitsbereich', title: 'Bibliothek', items: 'Elemente', favorites: 'Favoriten', noItems: 'Keine Elemente', noItemsDesc: 'Erstelle etwas und speichere es, um es hier zu sehen', localStorage: 'Lokaler Speicher', cloudStorage: 'Cloud-Speicher', connectSync: 'Verbinden & Synchronisieren', filters: { all: 'Alle', images: 'Bilder', text: 'Text', website: 'Website', audio: 'Audio' }, sections: { images: '🖼️ Bilder', docs: '📄 Dokumente und mehr' }, share: { title: 'Teilen', via: 'Teilen über', deleteFromLib: 'Aus Bibliothek löschen' }, cloud: { ...en.library.cloud, upgrade: 'Upgraden', soon: 'Bald' }, alerts: { ...en.library.alerts, savedToRoll: '✅ In der Kamerarolle gespeichert', deleteTitle: 'Löschen', rnaiUpgrade: 'Upgraden', rnaiLater: 'Später', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'Intelligenz-Hub', title: 'KI-Manager', activeLabel: 'Aktiv', tabs: { models: 'KI-Modelle', wallet: 'Geldbörse' }, soonBadge: 'BALD', activeModel: 'Aktives Modell', quickChat: 'Schnell-Chat', chatPlaceholder: 'Stellen Sie eine Frage...', send: 'Senden', thinking: 'denkt nach...', modelStatus: { connect: 'LAN-Verbindung', featured: '⭐ Empfohlen', available: 'Verfügbar' }, modelDownload: 'Herunterladen', modelConnected: 'Verbunden', wallet: { ...en.aiManager.wallet, title: 'Digitale Geldbörse', totalBalance: 'Gesamtguthaben', receive: 'Empfangen', send: 'Senden', scan: 'Scannen', assets: 'Vermögen', comingSoon: 'Bald', selfCustodialTitle: 'Selbstverwaltete Geldbörse', createBtn: '✨ Neue Geldbörse erstellen', addressCopied: 'Adresse kopiert' }, legal: 'Selbstverwaltung: Sie sind für Ihren eigenen privaten Schlüssel verantwortlich. Diese App bietet keine Tausch- oder Einlagedienste an.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇪🇸 SPANISH
// ─────────────────────────────────────────────────────────────────────────────
const es: Translations = {
  tabs: { home: 'Inicio', create: 'Crear', library: 'Biblioteca', ai: 'IA', profile: 'Perfil' },
  common: {
    save: 'Guardar', cancel: 'Cancelar', back: 'Volver', close: 'Cerrar',
    search: 'Buscar', clear: 'Limpiar', viewAll: 'Ver todo', seeAll: 'Ver todo',
    tapToUse: 'Toca para usar', newCreation: 'Nueva creación',
    execute: 'Ejecutar', processing: 'Procesando...',
    yes: 'Sí', no: 'No', ok: 'OK', confirm: 'Confirmar',
    loading: 'Cargando...', error: 'Error', success: 'Éxito',
  },
  home: {
    greeting: { morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches' },
    poweredBy: 'Impulsado por IA',
    tagline: 'Crea cualquier cosa',
    taglineHighlight: 'Al instante',
    startCreating: 'Empezar a crear',
    generateBtn: '🎨 Generar',
    creditsLabel: 'Créditos',
    stats: { generations: 'Generaciones', creditsUsed: 'Créditos usados', dayStreak: 'Días seguidos' },
    sections: { aiTools: 'Herramientas IA', allSkills: 'Todas las habilidades', history: 'Historial', recentCreations: 'Creaciones recientes' },
    skillBadges: { hot: 'POPULAR 🔥', new: 'NUEVO ✨', top: 'TOP' },
    promo: { badge: 'Oferta limitada', title: 'Actualiza a Pro ⭐', desc: 'Generaciones ilimitadas · Calidad HD', btn: 'Ver →' },
  },
  create: {
    title: 'Área de juegos',
    subtitle: 'Selecciona una habilidad',
    searchPlaceholder: '🔍  Buscar habilidades...',
    availableSkills: 'Habilidades disponibles',
    noSkills: 'No se encontraron habilidades',
  },
  profile: {
    editBtn: 'Editar perfil',
    tapToChange: 'Toca para cambiar foto',
    emailNote: 'Contacta con soporte para cambiar tu dirección de correo.',
    plans: { free: 'Gratis', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'CRÉDITOS DISPONIBLES', of: 'de', remaining: '% restante', resets: 'Se reinicia', topUp: 'Recargar' },
    stats: { monthly: 'Generaciones\nEste mes', total: 'Total\nCreaciones', streak: 'Días\nseguidos 🔥' },
    sections: {
      account: 'Cuenta', preferences: 'Preferencias', storage: 'Almacenamiento y datos',
      security: 'Seguridad', support: 'Soporte', about: 'Acerca de', actions: 'Gestión de cuenta',
    },
    fields: {
      displayName: 'Nombre mostrado', email: 'Correo', subscription: 'Suscripción', billing: 'Facturación',
      language: 'Idioma', theme: 'Tema', imageQuality: 'Calidad de imagen',
      pushNotifications: 'Notificaciones push', emailUpdates: 'Actualizaciones por correo',
      autoSave: 'Guardar resultados automáticamente', wifiOnly: 'Solo Wi-Fi (HD)',
      clearCache: 'Vaciar caché', changePassword: 'Cambiar contraseña',
      twoFA: 'Autenticación en dos pasos', loginActivity: 'Actividad de inicio de sesión',
      helpCenter: 'Centro de ayuda', rateApp: 'Valorar Rnai',
      feedback: 'Enviar comentarios', privacy: 'Política de privacidad',
      terms: 'Términos de servicio', appVersion: 'Versión de la app',
      apiStatus: 'Estado de la API', signOut: 'Cerrar sesión', deleteAccount: 'Eliminar cuenta',
    },
    quality: { standard: 'Estándar', standardDesc: '512×512 · Rápido', hd: 'HD', hdDesc: '1024×1024 · Equilibrado', ultra: 'Ultra HD', ultraDesc: '2048×2048 · Lento' },
    themes: { vibrant: 'Vibrante 🎨', brand: 'Marca', modern: 'Moderno' },
    modals: { editTitle: 'Editar perfil', languageTitle: 'Idioma', qualityTitle: 'Calidad de imagen' },
    signOutDialog:  { title: 'Cerrar sesión', message: '¿Seguro que quieres cerrar sesión?', confirm: 'Cerrar sesión' },
    deleteDialog:   { title: '⚠️ Eliminar cuenta', message: 'Esto eliminará permanentemente tu cuenta y todos los datos. Esta acción no se puede deshacer.', confirm: 'Eliminar' },
    alerts: {
      emailCannotChange: 'El correo no se puede cambiar en este momento',
      billingMsg: 'Gestionar métodos de pago', upgradeMsg: 'Ver opciones de plan',
      clearCacheMsg: 'Caché vaciada correctamente',
      loginActivityMsg: 'Último acceso: Hoy, 10:42 AM\nDispositivo: iPhone 15 Pro\nUbicación: Bangkok',
      rateMsg: '¡Gracias por tu apoyo! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'Se enviará un enlace de restablecimiento a tu correo',
      apiOperational: '🟢 Operativo',
    },
    proStatusLabel: '⭐ Plan Pro',
    operationalLabel: '🟢 Operativo',
  },
  skill: {
    inputLabel: 'Entrada',
    quickPrompts: '⚡ Prompts rápidos',
    examplesLabel: '✨ Ejemplos de resultados',
    placeholders: { image: 'Describe la imagen que quieres crear...', audio: 'Ingresa el texto a convertir en voz...', text: 'Ingresa tu texto o instrucciones...' },
    chars: 'car.', execute: 'Ejecutar', processing: 'Procesando...',
    templatesCount: 'Plantillas', aiProcessing: 'IA procesando...',
    resultLabel: 'Resultado',
  },
  skills: {
    'image-gen':    { name: 'Generar imagen',      description: 'Crea imágenes únicas desde descripciones de texto',   tagline: 'Texto → Imagen' },
    'image-edit':   { name: 'Editar imagen',       description: 'Modifica y mejora tus imágenes con IA',               tagline: 'Modificar y mejorar' },
    'remove-bg':    { name: 'Eliminar fondo',      description: 'Aísla sujetos de cualquier fondo',                    tagline: 'Recorte preciso' },
    'upscale':      { name: 'Mejorar imagen',      description: 'Mejora la resolución y los detalles finos',           tagline: 'Mejora HD' },
    'stylize':      { name: 'Estilizar imagen',    description: 'Transforma fotos en estilos artísticos impresionantes', tagline: 'Estilos artísticos' },
    'text-gen':     { name: 'Generar texto',       description: 'Escribe contenido convincente con asistencia de IA',  tagline: 'Redactor IA' },
    'text-sum':     { name: 'Resumir texto',       description: 'Condensa contenido largo en resúmenes claros',        tagline: 'Resumen inteligente' },
    'text-trans':   { name: 'Traducir',            description: 'Traduce naturalmente a más de 50 idiomas',            tagline: '50+ idiomas' },
    'text-rewrite': { name: 'Reescribir texto',    description: 'Transforma el tono y estilo de cualquier texto',      tagline: 'Cualquier tono' },
    'website-gen':  { name: 'Generar sitio web',   description: 'Construye sitios web hermosos con IA',                tagline: 'Construido con IA' },
    'audio-tts':    { name: 'Texto a voz',         description: 'Convierte texto en audio de sonido natural',          tagline: 'Voz natural' },
    'image-describe': { name: 'Analizar imagen',       description: 'La IA describe y analiza cualquier imagen en detalle', tagline: 'Visión IA' },
    'face-restore':   { name: 'Restaurar rostro',      description: 'Restaura y mejora rostros en fotos antiguas o borrosas', tagline: 'Reparación HD' },
    'text-grammar':   { name: 'Corrección gramatical', description: 'Corrige gramática, ortografía y puntuación con IA',  tagline: 'Texto perfecto' },
    'text-code':      { name: 'Generador de código',   description: 'Genera código desde descripciones en lenguaje natural', tagline: 'IA Programadora' },
    'text-hashtag':   { name: 'Generador de hashtags', description: 'Crea los hashtags perfectos para cualquier plataforma', tagline: 'Aumentar alcance' },
  },
  languages: en.languages,
  library: { ...en.library, subtitle: 'Mi espacio', title: 'Biblioteca', items: 'elementos', favorites: 'Favoritos', noItems: 'Sin elementos', noItemsDesc: 'Crea algo y guárdalo para verlo aquí', localStorage: 'Almacenamiento local', cloudStorage: 'Almacenamiento en la nube', connectSync: 'Conectar y sincronizar', filters: { all: 'Todo', images: 'Imágenes', text: 'Texto', website: 'Sitio web', audio: 'Audio' }, sections: { images: '🖼️ Imágenes', docs: '📄 Documentos y más' }, share: { title: 'Compartir', via: 'Compartir vía', deleteFromLib: 'Eliminar de la biblioteca' }, cloud: { ...en.library.cloud, upgrade: 'Mejorar', soon: 'Próximamente' }, alerts: { ...en.library.alerts, savedToRoll: '✅ Guardado en el carrete', deleteTitle: 'Eliminar', rnaiUpgrade: 'Mejorar', rnaiLater: 'Después', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'Centro de inteligencia', title: 'Gestor de IA', activeLabel: 'Activo', tabs: { models: 'Modelos IA', wallet: 'Cartera' }, soonBadge: 'PRONTO', activeModel: 'Modelo activo', quickChat: 'Chat rápido', chatPlaceholder: 'Haz una pregunta...', send: 'Enviar', thinking: 'pensando...', modelStatus: { connect: 'Conexión LAN', featured: '⭐ Destacado', available: 'Disponible' }, modelDownload: 'Descargar', modelConnected: 'Conectado', wallet: { ...en.aiManager.wallet, title: 'Cartera digital', totalBalance: 'Saldo total', receive: 'Recibir', send: 'Enviar', scan: 'Escanear', assets: 'Activos', comingSoon: 'Próximamente', selfCustodialTitle: 'Cartera autocustodiada', createBtn: '✨ Crear nueva cartera', addressCopied: 'Dirección copiada' }, legal: 'Autocustodia: Usted es responsable de su propia clave privada. Esta aplicación no ofrece servicios de intercambio o depósito.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇮🇩 INDONESIAN (Bahasa Indonesia)
// ─────────────────────────────────────────────────────────────────────────────
const id: Translations = {
  tabs: { home: 'Beranda', create: 'Buat', library: 'Galeri', ai: 'AI', profile: 'Profil' },
  common: {
    save: 'Simpan', cancel: 'Batal', back: 'Kembali', close: 'Tutup',
    search: 'Cari', clear: 'Hapus', viewAll: 'Lihat semua', seeAll: 'Lihat semua',
    tapToUse: 'Ketuk untuk pakai', newCreation: 'Karya baru',
    execute: 'Jalankan', processing: 'Memproses...',
    yes: 'Ya', no: 'Tidak', ok: 'OK', confirm: 'Konfirmasi',
    loading: 'Memuat...', error: 'Kesalahan', success: 'Berhasil',
  },
  home: {
    greeting: { morning: 'Selamat pagi', afternoon: 'Selamat siang', evening: 'Selamat malam' },
    poweredBy: 'Didukung AI',
    tagline: 'Ciptakan apa saja',
    taglineHighlight: 'Seketika',
    startCreating: 'Mulai berkarya',
    generateBtn: '🎨 Buat gambar',
    creditsLabel: 'Kredit',
    stats: { generations: 'Karya dibuat', creditsUsed: 'Kredit terpakai', dayStreak: 'Hari beruntun' },
    sections: { aiTools: 'Alat AI', allSkills: 'Semua skill', history: 'Riwayat', recentCreations: 'Karya terbaru' },
    skillBadges: { hot: 'POPULER 🔥', new: 'BARU ✨', top: 'TOP' },
    promo: { badge: 'Penawaran terbatas', title: 'Tingkatkan ke Pro ⭐', desc: 'Karya tanpa batas · Kualitas HD', btn: 'Lihat →' },
  },
  create: {
    title: 'Playground',
    subtitle: 'Pilih skill untuk memulai',
    searchPlaceholder: '🔍  Cari skill...',
    availableSkills: 'Skill tersedia',
    noSkills: 'Skill tidak ditemukan',
  },
  profile: {
    editBtn: 'Edit profil',
    tapToChange: 'Ketuk untuk ganti foto',
    emailNote: 'Hubungi dukungan untuk mengubah alamat email Anda.',
    plans: { free: 'Gratis', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'KREDIT TERSEDIA', of: 'dari', remaining: '% tersisa', resets: 'Reset', topUp: 'Isi ulang' },
    stats: { monthly: 'Karya\nBulan ini', total: 'Total\nKarya', streak: 'Hari\nberuntun 🔥' },
    sections: {
      account: 'Akun', preferences: 'Preferensi', storage: 'Penyimpanan & data',
      security: 'Keamanan', support: 'Dukungan', about: 'Tentang', actions: 'Pengaturan akun',
    },
    fields: {
      displayName: 'Nama tampilan', email: 'Email', subscription: 'Langganan', billing: 'Tagihan & pembayaran',
      language: 'Bahasa', theme: 'Tema', imageQuality: 'Kualitas gambar',
      pushNotifications: 'Notifikasi push', emailUpdates: 'Pembaruan email',
      autoSave: 'Simpan hasil otomatis', wifiOnly: 'Hanya Wi-Fi (HD)',
      clearCache: 'Hapus cache', changePassword: 'Ubah kata sandi',
      twoFA: 'Autentikasi dua faktor', loginActivity: 'Aktivitas login',
      helpCenter: 'Pusat bantuan', rateApp: 'Beri nilai Rnai',
      feedback: 'Kirim masukan', privacy: 'Kebijakan privasi',
      terms: 'Ketentuan layanan', appVersion: 'Versi aplikasi',
      apiStatus: 'Status API', signOut: 'Keluar', deleteAccount: 'Hapus akun',
    },
    quality: { standard: 'Standar', standardDesc: '512×512 · Cepat', hd: 'HD', hdDesc: '1024×1024 · Seimbang', ultra: 'Ultra HD', ultraDesc: '2048×2048 · Lambat' },
    themes: { vibrant: 'Cerah 🎨', brand: 'Brand', modern: 'Modern' },
    modals: { editTitle: 'Edit profil', languageTitle: 'Bahasa', qualityTitle: 'Kualitas gambar' },
    signOutDialog:  { title: 'Keluar', message: 'Yakin ingin keluar?', confirm: 'Keluar' },
    deleteDialog:   { title: '⚠️ Hapus akun', message: 'Ini akan menghapus akun dan semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan.', confirm: 'Hapus' },
    alerts: {
      emailCannotChange: 'Email tidak dapat diubah saat ini',
      billingMsg: 'Kelola metode pembayaran', upgradeMsg: 'Lihat pilihan paket',
      clearCacheMsg: 'Cache berhasil dihapus',
      loginActivityMsg: 'Login terakhir: Hari ini, 10.42\nPerangkat: iPhone 15 Pro\nLokasi: Bangkok',
      rateMsg: 'Terima kasih atas dukungan Anda! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'Tautan reset akan dikirim ke email Anda',
      apiOperational: '🟢 Beroperasi',
    },
    proStatusLabel: '⭐ Paket Pro',
    operationalLabel: '🟢 Beroperasi',
  },
  skill: {
    inputLabel: 'Masukan',
    quickPrompts: '⚡ Prompt cepat',
    examplesLabel: '✨ Contoh hasil',
    placeholders: { image: 'Jelaskan gambar yang ingin Anda buat...', audio: 'Masukkan teks untuk diubah jadi suara...', text: 'Masukkan teks atau instruksi Anda...' },
    chars: 'karakter', execute: 'Jalankan', processing: 'Memproses...',
    templatesCount: 'Templat', aiProcessing: 'AI sedang memproses...',
    resultLabel: 'Hasil',
  },
  skills: {
    'image-gen':    { name: 'Buat gambar',        description: 'Buat gambar unik dari deskripsi teks',        tagline: 'Teks → Gambar' },
    'image-edit':   { name: 'Edit gambar',        description: 'Ubah dan tingkatkan gambar dengan AI',         tagline: 'Ubah & tingkatkan' },
    'remove-bg':    { name: 'Hapus latar',        description: 'Pisahkan objek dari latar mana pun',           tagline: 'Potong rapi' },
    'upscale':      { name: 'Tingkatkan resolusi', description: 'Tingkatkan resolusi dan detail halus',        tagline: 'Penajaman HD' },
    'stylize':      { name: 'Gaya artistik',      description: 'Ubah foto menjadi gaya seni menakjubkan',      tagline: 'Gaya seni' },
    'text-gen':     { name: 'Buat teks',          description: 'Tulis konten menarik dengan bantuan AI',       tagline: 'Penulis AI' },
    'text-sum':     { name: 'Ringkas teks',       description: 'Padatkan konten panjang jadi ringkasan jelas', tagline: 'Ringkasan pintar' },
    'text-trans':   { name: 'Terjemahkan',        description: 'Terjemahkan alami ke 50+ bahasa',              tagline: '50+ bahasa' },
    'text-rewrite': { name: 'Tulis ulang',        description: 'Ubah nada dan gaya teks apa pun',              tagline: 'Semua nada' },
    'website-gen':  { name: 'Buat situs web',     description: 'Bangun situs web indah dengan AI',             tagline: 'Dibuat dengan AI' },
    'audio-tts':    { name: 'Teks ke suara',      description: 'Ubah teks jadi audio terdengar alami',         tagline: 'Suara alami' },
    'image-describe': { name: 'Analisis gambar',  description: 'AI mendeskripsikan dan menganalisis gambar secara detail', tagline: 'Vision AI' },
    'face-restore':   { name: 'Pulihkan wajah',   description: 'Pulihkan wajah pada foto lama atau buram',     tagline: 'Perbaikan wajah HD' },
    'text-grammar':   { name: 'Cek tata bahasa',  description: 'Perbaiki tata bahasa, ejaan, dan tanda baca',  tagline: 'Teks sempurna' },
    'text-code':      { name: 'Buat kode',        description: 'Hasilkan kode dari deskripsi bahasa sehari-hari', tagline: 'AI Coder' },
    'text-hashtag':   { name: 'Buat hashtag',     description: 'Buat hashtag sempurna untuk platform apa pun', tagline: 'Tambah jangkauan' },
  },
  languages: LANGUAGES_MAP,
  library: { ...en.library, subtitle: 'Ruang kerja saya', title: 'Galeri', items: 'item', favorites: 'Favorit', noItems: 'Belum ada item', noItemsDesc: 'Buat sesuatu dan simpan untuk melihatnya di sini', localStorage: 'Penyimpanan lokal', cloudStorage: 'Penyimpanan cloud', connectSync: 'Hubungkan & sinkron', filters: { all: 'Semua', images: 'Gambar', text: 'Teks', website: 'Situs web', audio: 'Audio' }, sections: { images: '🖼️ Gambar', docs: '📄 Dokumen & lainnya' }, share: { title: 'Bagikan', via: 'Bagikan via', deleteFromLib: 'Hapus dari galeri' }, cloud: { ...en.library.cloud, upgrade: 'Tingkatkan', soon: 'Segera' }, alerts: { ...en.library.alerts, savedToRoll: '✅ Tersimpan ke Galeri Foto', deleteTitle: 'Hapus', rnaiUpgrade: 'Tingkatkan', rnaiLater: 'Nanti', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'Pusat kecerdasan', title: 'AI Manager', activeLabel: 'Aktif', tabs: { models: 'Model AI', wallet: 'Dompet' }, soonBadge: 'SEGERA', activeModel: 'Model aktif', quickChat: 'Obrolan cepat', chatPlaceholder: 'Tanyakan apa saja...', send: 'Kirim', thinking: 'sedang berpikir...', modelStatus: { connect: 'Koneksi LAN', featured: '⭐ Unggulan', available: 'Tersedia' }, modelDownload: 'Unduh', modelConnected: 'Terhubung', wallet: { ...en.aiManager.wallet, title: 'Dompet digital', totalBalance: 'Total saldo', receive: 'Terima', send: 'Kirim', scan: 'Pindai', assets: 'Aset', comingSoon: 'Segera hadir', selfCustodialTitle: 'Dompet Self-Custodial', createBtn: '✨ Buat dompet baru', addressCopied: 'Alamat disalin' }, legal: 'Self-Custodial: Anda bertanggung jawab atas kunci pribadi Anda sendiri. Aplikasi ini tidak menyediakan layanan pertukaran atau penyimpanan dana.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇲🇾 MALAY (Bahasa Melayu)
// ─────────────────────────────────────────────────────────────────────────────
const ms: Translations = {
  tabs: { home: 'Utama', create: 'Cipta', library: 'Pustaka', ai: 'AI', profile: 'Profil' },
  common: {
    save: 'Simpan', cancel: 'Batal', back: 'Kembali', close: 'Tutup',
    search: 'Cari', clear: 'Kosongkan', viewAll: 'Lihat semua', seeAll: 'Lihat semua',
    tapToUse: 'Ketik untuk guna', newCreation: 'Karya baharu',
    execute: 'Jalankan', processing: 'Memproses...',
    yes: 'Ya', no: 'Tidak', ok: 'OK', confirm: 'Sahkan',
    loading: 'Memuatkan...', error: 'Ralat', success: 'Berjaya',
  },
  home: {
    greeting: { morning: 'Selamat pagi', afternoon: 'Selamat tengah hari', evening: 'Selamat malam' },
    poweredBy: 'Dikuasakan AI',
    tagline: 'Cipta apa sahaja',
    taglineHighlight: 'Serta-merta',
    startCreating: 'Mula mencipta',
    generateBtn: '🎨 Jana imej',
    creditsLabel: 'Kredit',
    stats: { generations: 'Karya dijana', creditsUsed: 'Kredit digunakan', dayStreak: 'Hari berturut' },
    sections: { aiTools: 'Alat AI', allSkills: 'Semua kemahiran', history: 'Sejarah', recentCreations: 'Karya terkini' },
    skillBadges: { hot: 'POPULAR 🔥', new: 'BAHARU ✨', top: 'TOP' },
    promo: { badge: 'Tawaran terhad', title: 'Naik taraf ke Pro ⭐', desc: 'Karya tanpa had · Kualiti HD', btn: 'Lihat →' },
  },
  create: {
    title: 'Playground',
    subtitle: 'Pilih kemahiran untuk bermula',
    searchPlaceholder: '🔍  Cari kemahiran...',
    availableSkills: 'Kemahiran tersedia',
    noSkills: 'Tiada kemahiran dijumpai',
  },
  profile: {
    editBtn: 'Edit profil',
    tapToChange: 'Ketik untuk tukar foto',
    emailNote: 'Hubungi sokongan untuk menukar alamat e-mel anda.',
    plans: { free: 'Percuma', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'KREDIT TERSEDIA', of: 'daripada', remaining: '% berbaki', resets: 'Set semula', topUp: 'Tambah nilai' },
    stats: { monthly: 'Karya\nBulan ini', total: 'Jumlah\nKarya', streak: 'Hari\nberturut 🔥' },
    sections: {
      account: 'Akaun', preferences: 'Keutamaan', storage: 'Storan & data',
      security: 'Keselamatan', support: 'Sokongan', about: 'Perihal', actions: 'Pengurusan akaun',
    },
    fields: {
      displayName: 'Nama paparan', email: 'E-mel', subscription: 'Langganan', billing: 'Bil & pembayaran',
      language: 'Bahasa', theme: 'Tema', imageQuality: 'Kualiti imej',
      pushNotifications: 'Pemberitahuan tolak', emailUpdates: 'Kemas kini e-mel',
      autoSave: 'Simpan hasil automatik', wifiOnly: 'Wi-Fi sahaja (HD)',
      clearCache: 'Kosongkan cache', changePassword: 'Tukar kata laluan',
      twoFA: 'Pengesahan dua faktor', loginActivity: 'Aktiviti log masuk',
      helpCenter: 'Pusat bantuan', rateApp: 'Nilai Rnai',
      feedback: 'Hantar maklum balas', privacy: 'Dasar privasi',
      terms: 'Terma perkhidmatan', appVersion: 'Versi aplikasi',
      apiStatus: 'Status API', signOut: 'Log keluar', deleteAccount: 'Padam akaun',
    },
    quality: { standard: 'Standard', standardDesc: '512×512 · Pantas', hd: 'HD', hdDesc: '1024×1024 · Seimbang', ultra: 'Ultra HD', ultraDesc: '2048×2048 · Perlahan' },
    themes: { vibrant: 'Terang 🎨', brand: 'Jenama', modern: 'Moden' },
    modals: { editTitle: 'Edit profil', languageTitle: 'Bahasa', qualityTitle: 'Kualiti imej' },
    signOutDialog:  { title: 'Log keluar', message: 'Pasti mahu log keluar?', confirm: 'Log keluar' },
    deleteDialog:   { title: '⚠️ Padam akaun', message: 'Ini akan memadam akaun dan semua data anda secara kekal. Tindakan ini tidak boleh dibatalkan.', confirm: 'Padam' },
    alerts: {
      emailCannotChange: 'E-mel tidak boleh ditukar buat masa ini',
      billingMsg: 'Urus kaedah pembayaran', upgradeMsg: 'Lihat pilihan pelan',
      clearCacheMsg: 'Cache berjaya dikosongkan',
      loginActivityMsg: 'Log masuk terakhir: Hari ini, 10.42 pagi\nPeranti: iPhone 15 Pro\nLokasi: Bangkok',
      rateMsg: 'Terima kasih atas sokongan anda! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'Pautan set semula akan dihantar ke e-mel anda',
      apiOperational: '🟢 Beroperasi',
    },
    proStatusLabel: '⭐ Pelan Pro',
    operationalLabel: '🟢 Beroperasi',
  },
  skill: {
    inputLabel: 'Input',
    quickPrompts: '⚡ Prompt pantas',
    examplesLabel: '✨ Contoh hasil',
    placeholders: { image: 'Terangkan imej yang anda mahu cipta...', audio: 'Masukkan teks untuk ditukar kepada suara...', text: 'Masukkan teks atau arahan anda...' },
    chars: 'aksara', execute: 'Jalankan', processing: 'Memproses...',
    templatesCount: 'Templat', aiProcessing: 'AI sedang memproses...',
    resultLabel: 'Hasil',
  },
  skills: {
    'image-gen':    { name: 'Jana imej',          description: 'Cipta imej unik daripada penerangan teks',     tagline: 'Teks → Imej' },
    'image-edit':   { name: 'Edit imej',          description: 'Ubah suai dan tingkatkan imej dengan AI',       tagline: 'Ubah & tingkat' },
    'remove-bg':    { name: 'Buang latar',        description: 'Asingkan subjek daripada mana-mana latar',      tagline: 'Potong kemas' },
    'upscale':      { name: 'Tingkatkan resolusi', description: 'Tingkatkan resolusi dan perincian halus',      tagline: 'Penajaman HD' },
    'stylize':      { name: 'Gaya seni',          description: 'Ubah foto kepada gaya seni menakjubkan',        tagline: 'Gaya seni' },
    'text-gen':     { name: 'Jana teks',          description: 'Tulis kandungan menarik dengan bantuan AI',     tagline: 'Penulis AI' },
    'text-sum':     { name: 'Ringkaskan teks',    description: 'Padatkan kandungan panjang jadi ringkasan jelas', tagline: 'Ringkasan pintar' },
    'text-trans':   { name: 'Terjemah',           description: 'Terjemah secara semula jadi ke 50+ bahasa',     tagline: '50+ bahasa' },
    'text-rewrite': { name: 'Tulis semula',       description: 'Ubah nada dan gaya mana-mana teks',             tagline: 'Semua nada' },
    'website-gen':  { name: 'Jana laman web',     description: 'Bina laman web cantik dengan AI',               tagline: 'Dibina dengan AI' },
    'audio-tts':    { name: 'Teks ke suara',      description: 'Tukar teks kepada audio bunyi semula jadi',     tagline: 'Suara semula jadi' },
    'image-describe': { name: 'Analisis imej',    description: 'AI menerangkan dan menganalisis imej secara terperinci', tagline: 'Vision AI' },
    'face-restore':   { name: 'Pulih wajah',      description: 'Pulih wajah dalam foto lama atau kabur',        tagline: 'Pembaikan wajah HD' },
    'text-grammar':   { name: 'Semak tatabahasa', description: 'Betulkan tatabahasa, ejaan dan tanda baca',     tagline: 'Teks sempurna' },
    'text-code':      { name: 'Jana kod',         description: 'Hasilkan kod daripada penerangan bahasa biasa', tagline: 'AI Coder' },
    'text-hashtag':   { name: 'Jana hashtag',     description: 'Cipta hashtag sempurna untuk mana-mana platform', tagline: 'Tambah capaian' },
  },
  languages: LANGUAGES_MAP,
  library: { ...en.library, subtitle: 'Ruang kerja saya', title: 'Pustaka', items: 'item', favorites: 'Kegemaran', noItems: 'Tiada item lagi', noItemsDesc: 'Cipta sesuatu dan simpan untuk melihatnya di sini', localStorage: 'Storan tempatan', cloudStorage: 'Storan awan', connectSync: 'Sambung & segerak', filters: { all: 'Semua', images: 'Imej', text: 'Teks', website: 'Laman web', audio: 'Audio' }, sections: { images: '🖼️ Imej', docs: '📄 Dokumen & lain-lain' }, share: { title: 'Kongsi', via: 'Kongsi melalui', deleteFromLib: 'Padam dari pustaka' }, cloud: { ...en.library.cloud, upgrade: 'Naik taraf', soon: 'Tidak lama lagi' }, alerts: { ...en.library.alerts, savedToRoll: '✅ Disimpan ke Galeri Foto', deleteTitle: 'Padam', rnaiUpgrade: 'Naik taraf', rnaiLater: 'Kemudian', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'Hab kecerdasan', title: 'AI Manager', activeLabel: 'Aktif', tabs: { models: 'Model AI', wallet: 'Dompet' }, soonBadge: 'TIDAK LAMA LAGI', activeModel: 'Model aktif', quickChat: 'Sembang pantas', chatPlaceholder: 'Tanya apa sahaja...', send: 'Hantar', thinking: 'sedang berfikir...', modelStatus: { connect: 'Sambungan LAN', featured: '⭐ Pilihan', available: 'Tersedia' }, modelDownload: 'Muat turun', modelConnected: 'Bersambung', wallet: { ...en.aiManager.wallet, title: 'Dompet digital', totalBalance: 'Jumlah baki', receive: 'Terima', send: 'Hantar', scan: 'Imbas', assets: 'Aset', comingSoon: 'Tidak lama lagi', selfCustodialTitle: 'Dompet Self-Custodial', createBtn: '✨ Cipta dompet baharu', addressCopied: 'Alamat disalin' }, legal: 'Self-Custodial: Anda bertanggungjawab ke atas kunci peribadi anda sendiri. Aplikasi ini tidak menyediakan perkhidmatan pertukaran atau deposit.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇻🇳 VIETNAMESE (Tiếng Việt)
// ─────────────────────────────────────────────────────────────────────────────
const vi: Translations = {
  tabs: { home: 'Trang chủ', create: 'Tạo', library: 'Thư viện', ai: 'AI', profile: 'Hồ sơ' },
  common: {
    save: 'Lưu', cancel: 'Hủy', back: 'Quay lại', close: 'Đóng',
    search: 'Tìm kiếm', clear: 'Xóa', viewAll: 'Xem tất cả', seeAll: 'Xem tất cả',
    tapToUse: 'Chạm để dùng', newCreation: 'Tác phẩm mới',
    execute: 'Thực thi', processing: 'Đang xử lý...',
    yes: 'Có', no: 'Không', ok: 'OK', confirm: 'Xác nhận',
    loading: 'Đang tải...', error: 'Lỗi', success: 'Thành công',
  },
  home: {
    greeting: { morning: 'Chào buổi sáng', afternoon: 'Chào buổi chiều', evening: 'Chào buổi tối' },
    poweredBy: 'Hỗ trợ bởi AI',
    tagline: 'Tạo mọi thứ',
    taglineHighlight: 'Tức thì',
    startCreating: 'Bắt đầu tạo',
    generateBtn: '🎨 Tạo ảnh',
    creditsLabel: 'Tín dụng',
    stats: { generations: 'Lượt tạo', creditsUsed: 'Tín dụng đã dùng', dayStreak: 'Ngày liên tiếp' },
    sections: { aiTools: 'Công cụ AI', allSkills: 'Tất cả kỹ năng', history: 'Lịch sử', recentCreations: 'Tác phẩm gần đây' },
    skillBadges: { hot: 'HOT 🔥', new: 'MỚI ✨', top: 'TOP' },
    promo: { badge: 'Ưu đãi giới hạn', title: 'Nâng cấp lên Pro ⭐', desc: 'Tạo không giới hạn · Chất lượng HD', btn: 'Xem →' },
  },
  create: {
    title: 'Sân chơi',
    subtitle: 'Chọn một kỹ năng để bắt đầu',
    searchPlaceholder: '🔍  Tìm kỹ năng...',
    availableSkills: 'Kỹ năng khả dụng',
    noSkills: 'Không tìm thấy kỹ năng',
  },
  profile: {
    editBtn: 'Chỉnh sửa hồ sơ',
    tapToChange: 'Chạm để đổi ảnh',
    emailNote: 'Liên hệ hỗ trợ để thay đổi địa chỉ email của bạn.',
    plans: { free: 'Miễn phí', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'TÍN DỤNG KHẢ DỤNG', of: 'trên', remaining: '% còn lại', resets: 'Đặt lại', topUp: 'Nạp thêm' },
    stats: { monthly: 'Lượt tạo\nTháng này', total: 'Tổng\nTác phẩm', streak: 'Ngày\nliên tiếp 🔥' },
    sections: {
      account: 'Tài khoản', preferences: 'Tùy chọn', storage: 'Lưu trữ & dữ liệu',
      security: 'Bảo mật', support: 'Hỗ trợ', about: 'Giới thiệu', actions: 'Quản lý tài khoản',
    },
    fields: {
      displayName: 'Tên hiển thị', email: 'Email', subscription: 'Gói đăng ký', billing: 'Thanh toán',
      language: 'Ngôn ngữ', theme: 'Giao diện', imageQuality: 'Chất lượng ảnh',
      pushNotifications: 'Thông báo đẩy', emailUpdates: 'Cập nhật qua email',
      autoSave: 'Tự động lưu kết quả', wifiOnly: 'Chỉ Wi-Fi (HD)',
      clearCache: 'Xóa bộ nhớ đệm', changePassword: 'Đổi mật khẩu',
      twoFA: 'Xác thực hai yếu tố', loginActivity: 'Hoạt động đăng nhập',
      helpCenter: 'Trung tâm trợ giúp', rateApp: 'Đánh giá Rnai',
      feedback: 'Gửi phản hồi', privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản dịch vụ', appVersion: 'Phiên bản ứng dụng',
      apiStatus: 'Trạng thái API', signOut: 'Đăng xuất', deleteAccount: 'Xóa tài khoản',
    },
    quality: { standard: 'Tiêu chuẩn', standardDesc: '512×512 · Nhanh', hd: 'HD', hdDesc: '1024×1024 · Cân bằng', ultra: 'Ultra HD', ultraDesc: '2048×2048 · Chậm' },
    themes: { vibrant: 'Rực rỡ 🎨', brand: 'Thương hiệu', modern: 'Hiện đại' },
    modals: { editTitle: 'Chỉnh sửa hồ sơ', languageTitle: 'Ngôn ngữ', qualityTitle: 'Chất lượng ảnh' },
    signOutDialog:  { title: 'Đăng xuất', message: 'Bạn có chắc muốn đăng xuất?', confirm: 'Đăng xuất' },
    deleteDialog:   { title: '⚠️ Xóa tài khoản', message: 'Thao tác này sẽ xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn. Không thể hoàn tác.', confirm: 'Xóa' },
    alerts: {
      emailCannotChange: 'Hiện không thể thay đổi email',
      billingMsg: 'Quản lý phương thức thanh toán', upgradeMsg: 'Xem các gói',
      clearCacheMsg: 'Đã xóa bộ nhớ đệm thành công',
      loginActivityMsg: 'Đăng nhập gần nhất: Hôm nay, 10:42\nThiết bị: iPhone 15 Pro\nVị trí: Bangkok',
      rateMsg: 'Cảm ơn sự ủng hộ của bạn! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'Liên kết đặt lại sẽ được gửi đến email của bạn',
      apiOperational: '🟢 Hoạt động',
    },
    proStatusLabel: '⭐ Gói Pro',
    operationalLabel: '🟢 Hoạt động',
  },
  skill: {
    inputLabel: 'Đầu vào',
    quickPrompts: '⚡ Gợi ý nhanh',
    examplesLabel: '✨ Kết quả mẫu',
    placeholders: { image: 'Mô tả hình ảnh bạn muốn tạo...', audio: 'Nhập văn bản để chuyển thành giọng nói...', text: 'Nhập văn bản hoặc hướng dẫn của bạn...' },
    chars: 'ký tự', execute: 'Thực thi', processing: 'Đang xử lý...',
    templatesCount: 'Mẫu', aiProcessing: 'AI đang xử lý...',
    resultLabel: 'Kết quả',
  },
  skills: {
    'image-gen':    { name: 'Tạo ảnh',            description: 'Tạo ảnh độc đáo từ mô tả văn bản',             tagline: 'Văn bản → Ảnh' },
    'image-edit':   { name: 'Chỉnh sửa ảnh',      description: 'Sửa và nâng cao ảnh bằng AI',                  tagline: 'Sửa & nâng cao' },
    'remove-bg':    { name: 'Xóa nền',            description: 'Tách chủ thể khỏi mọi nền một cách sạch sẽ',    tagline: 'Cắt gọn' },
    'upscale':      { name: 'Tăng độ phân giải',  description: 'Nâng độ phân giải và phục hồi chi tiết',        tagline: 'Nâng cấp HD' },
    'stylize':      { name: 'Phong cách nghệ thuật', description: 'Biến ảnh thành các phong cách nghệ thuật',   tagline: 'Phong cách nghệ thuật' },
    'text-gen':     { name: 'Tạo văn bản',        description: 'Viết nội dung hấp dẫn với sự hỗ trợ của AI',    tagline: 'Cây bút AI' },
    'text-sum':     { name: 'Tóm tắt văn bản',    description: 'Cô đọng nội dung dài thành tóm tắt rõ ràng',    tagline: 'Tóm tắt thông minh' },
    'text-trans':   { name: 'Dịch thuật',         description: 'Dịch tự nhiên hơn 50 ngôn ngữ',                tagline: '50+ ngôn ngữ' },
    'text-rewrite': { name: 'Viết lại',           description: 'Biến đổi giọng văn và phong cách bất kỳ',       tagline: 'Mọi giọng văn' },
    'website-gen':  { name: 'Tạo website',        description: 'Xây dựng website đẹp bằng AI',                 tagline: 'Tạo bằng AI' },
    'audio-tts':    { name: 'Văn bản thành giọng nói', description: 'Chuyển văn bản thành âm thanh tự nhiên',   tagline: 'Giọng tự nhiên' },
    'image-describe': { name: 'Phân tích ảnh',    description: 'AI mô tả và phân tích chi tiết mọi hình ảnh',  tagline: 'Vision AI' },
    'face-restore':   { name: 'Phục hồi khuôn mặt', description: 'Phục hồi khuôn mặt trong ảnh cũ hoặc mờ',     tagline: 'Phục hồi mặt HD' },
    'text-grammar':   { name: 'Kiểm tra ngữ pháp', description: 'Sửa ngữ pháp, chính tả và dấu câu',           tagline: 'Văn bản hoàn hảo' },
    'text-code':      { name: 'Tạo mã',           description: 'Tạo mã từ mô tả ngôn ngữ thông thường',         tagline: 'AI Coder' },
    'text-hashtag':   { name: 'Tạo hashtag',      description: 'Tạo hashtag hoàn hảo cho mọi nền tảng',         tagline: 'Tăng tương tác' },
  },
  languages: LANGUAGES_MAP,
  library: { ...en.library, subtitle: 'Không gian của tôi', title: 'Thư viện', items: 'mục', favorites: 'Yêu thích', noItems: 'Chưa có mục nào', noItemsDesc: 'Tạo và lưu thứ gì đó để xem tại đây', localStorage: 'Lưu trữ cục bộ', cloudStorage: 'Lưu trữ đám mây', connectSync: 'Kết nối & đồng bộ', filters: { all: 'Tất cả', images: 'Hình ảnh', text: 'Văn bản', website: 'Website', audio: 'Âm thanh' }, sections: { images: '🖼️ Hình ảnh', docs: '📄 Tài liệu & khác' }, share: { title: 'Chia sẻ', via: 'Chia sẻ qua', deleteFromLib: 'Xóa khỏi thư viện' }, cloud: { ...en.library.cloud, upgrade: 'Nâng cấp', soon: 'Sắp ra mắt' }, alerts: { ...en.library.alerts, savedToRoll: '✅ Đã lưu vào Cuộn ảnh', deleteTitle: 'Xóa', rnaiUpgrade: 'Nâng cấp', rnaiLater: 'Để sau', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'Trung tâm trí tuệ', title: 'AI Manager', activeLabel: 'Đang hoạt động', tabs: { models: 'Mô hình AI', wallet: 'Ví' }, soonBadge: 'SẮP RA MẮT', activeModel: 'Mô hình đang dùng', quickChat: 'Trò chuyện nhanh', chatPlaceholder: 'Hỏi bất cứ điều gì...', send: 'Gửi', thinking: 'đang suy nghĩ...', modelStatus: { connect: 'Kết nối LAN', featured: '⭐ Nổi bật', available: 'Khả dụng' }, modelDownload: 'Tải xuống', modelConnected: 'Đã kết nối', wallet: { ...en.aiManager.wallet, title: 'Ví số', totalBalance: 'Tổng số dư', receive: 'Nhận', send: 'Gửi', scan: 'Quét', assets: 'Tài sản', comingSoon: 'Sắp ra mắt', selfCustodialTitle: 'Ví tự quản', createBtn: '✨ Tạo ví mới', addressCopied: 'Đã sao chép địa chỉ' }, legal: 'Tự quản: Bạn tự chịu trách nhiệm về khóa riêng của mình. Ứng dụng này không cung cấp dịch vụ trao đổi hoặc gửi tiền.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇵🇭 FILIPINO
// ─────────────────────────────────────────────────────────────────────────────
const fil: Translations = {
  tabs: { home: 'Home', create: 'Likha', library: 'Aklatan', ai: 'AI', profile: 'Profile' },
  common: {
    save: 'I-save', cancel: 'Kanselahin', back: 'Bumalik', close: 'Isara',
    search: 'Maghanap', clear: 'Burahin', viewAll: 'Tingnan lahat', seeAll: 'Tingnan lahat',
    tapToUse: 'I-tap para gamitin', newCreation: 'Bagong likha',
    execute: 'Patakbuhin', processing: 'Pinoproseso...',
    yes: 'Oo', no: 'Hindi', ok: 'OK', confirm: 'Kumpirmahin',
    loading: 'Naglo-load...', error: 'Error', success: 'Tagumpay',
  },
  home: {
    greeting: { morning: 'Magandang umaga', afternoon: 'Magandang hapon', evening: 'Magandang gabi' },
    poweredBy: 'Pinapatakbo ng AI',
    tagline: 'Lumikha ng kahit ano',
    taglineHighlight: 'Agad-agad',
    startCreating: 'Simulan ang paglikha',
    generateBtn: '🎨 Gumawa ng larawan',
    creditsLabel: 'Credits',
    stats: { generations: 'Mga likha', creditsUsed: 'Nagamit na credits', dayStreak: 'Araw na sunod-sunod' },
    sections: { aiTools: 'Mga AI Tool', allSkills: 'Lahat ng skill', history: 'Kasaysayan', recentCreations: 'Mga kamakailang likha' },
    skillBadges: { hot: 'SIKAT 🔥', new: 'BAGO ✨', top: 'TOP' },
    promo: { badge: 'Limitadong alok', title: 'Mag-upgrade sa Pro ⭐', desc: 'Walang limitasyong likha · HD na kalidad', btn: 'Tingnan →' },
  },
  create: {
    title: 'Playground',
    subtitle: 'Pumili ng skill para magsimula',
    searchPlaceholder: '🔍  Maghanap ng skill...',
    availableSkills: 'Mga available na skill',
    noSkills: 'Walang nahanap na skill',
  },
  profile: {
    editBtn: 'I-edit ang profile',
    tapToChange: 'I-tap para palitan ang larawan',
    emailNote: 'Makipag-ugnayan sa support para palitan ang iyong email address.',
    plans: { free: 'Libre', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'AVAILABLE NA CREDITS', of: 'sa', remaining: '% natitira', resets: 'Mag-reset', topUp: 'Mag-top up' },
    stats: { monthly: 'Mga likha\nNgayong buwan', total: 'Kabuuang\nLikha', streak: 'Araw na\nsunod-sunod 🔥' },
    sections: {
      account: 'Account', preferences: 'Mga kagustuhan', storage: 'Storage at data',
      security: 'Seguridad', support: 'Suporta', about: 'Tungkol', actions: 'Pamamahala ng account',
    },
    fields: {
      displayName: 'Display name', email: 'Email', subscription: 'Subscription', billing: 'Billing at bayad',
      language: 'Wika', theme: 'Tema', imageQuality: 'Kalidad ng larawan',
      pushNotifications: 'Push notifications', emailUpdates: 'Mga update sa email',
      autoSave: 'Awtomatikong pag-save', wifiOnly: 'Wi-Fi lamang (HD)',
      clearCache: 'I-clear ang cache', changePassword: 'Palitan ang password',
      twoFA: 'Two-factor authentication', loginActivity: 'Aktibidad ng login',
      helpCenter: 'Help center', rateApp: 'I-rate ang Rnai',
      feedback: 'Magpadala ng feedback', privacy: 'Patakaran sa privacy',
      terms: 'Mga tuntunin ng serbisyo', appVersion: 'Bersyon ng app',
      apiStatus: 'Status ng API', signOut: 'Mag-sign out', deleteAccount: 'Burahin ang account',
    },
    quality: { standard: 'Standard', standardDesc: '512×512 · Mabilis', hd: 'HD', hdDesc: '1024×1024 · Balanse', ultra: 'Ultra HD', ultraDesc: '2048×2048 · Mabagal' },
    themes: { vibrant: 'Makulay 🎨', brand: 'Brand', modern: 'Moderno' },
    modals: { editTitle: 'I-edit ang profile', languageTitle: 'Wika', qualityTitle: 'Kalidad ng larawan' },
    signOutDialog:  { title: 'Mag-sign out', message: 'Sigurado ka bang gusto mong mag-sign out?', confirm: 'Mag-sign out' },
    deleteDialog:   { title: '⚠️ Burahin ang account', message: 'Permanenteng buburahin nito ang iyong account at lahat ng data. Hindi ito maibabalik.', confirm: 'Burahin' },
    alerts: {
      emailCannotChange: 'Hindi mababago ang email sa ngayon',
      billingMsg: 'Pamahalaan ang mga paraan ng pagbabayad', upgradeMsg: 'Tingnan ang mga plano',
      clearCacheMsg: 'Matagumpay na na-clear ang cache',
      loginActivityMsg: 'Huling login: Ngayon, 10:42 AM\nDevice: iPhone 15 Pro\nLokasyon: Bangkok',
      rateMsg: 'Salamat sa iyong suporta! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'Magpapadala ng reset link sa iyong email',
      apiOperational: '🟢 Gumagana',
    },
    proStatusLabel: '⭐ Pro Plan',
    operationalLabel: '🟢 Gumagana',
  },
  skill: {
    inputLabel: 'Input',
    quickPrompts: '⚡ Mabilis na prompt',
    examplesLabel: '✨ Mga halimbawang resulta',
    placeholders: { image: 'Ilarawan ang larawang gusto mong likhain...', audio: 'Ilagay ang teksto na gagawing boses...', text: 'Ilagay ang iyong teksto o mga tagubilin...' },
    chars: 'titik', execute: 'Patakbuhin', processing: 'Pinoproseso...',
    templatesCount: 'Mga template', aiProcessing: 'Nagpoproseso ang AI...',
    resultLabel: 'Resulta',
  },
  skills: {
    'image-gen':    { name: 'Gumawa ng larawan',  description: 'Lumikha ng natatanging larawan mula sa teksto', tagline: 'Teksto → Larawan' },
    'image-edit':   { name: 'I-edit ang larawan', description: 'Baguhin at pagandahin ang larawan gamit ang AI', tagline: 'Baguhin & pagandahin' },
    'remove-bg':    { name: 'Tanggalin ang background', description: 'Malinis na ihiwalay ang subject sa background', tagline: 'Malinis na hiwa' },
    'upscale':      { name: 'Itaas ang resolusyon', description: 'Pagandahin ang resolusyon at detalye',         tagline: 'HD na pinahusay' },
    'stylize':      { name: 'Estilong sining',    description: 'Gawing kahanga-hangang sining ang mga larawan',  tagline: 'Mga estilong sining' },
    'text-gen':     { name: 'Gumawa ng teksto',   description: 'Sumulat ng kapana-panabik na nilalaman gamit ang AI', tagline: 'AI na manunulat' },
    'text-sum':     { name: 'Ibuod ang teksto',   description: 'Paikliin ang mahabang nilalaman nang malinaw',   tagline: 'Matalinong buod' },
    'text-trans':   { name: 'Isalin',             description: 'Natural na pagsasalin sa 50+ wika',             tagline: '50+ wika' },
    'text-rewrite': { name: 'Isulat muli',        description: 'Baguhin ang tono at estilo ng anumang teksto',   tagline: 'Anumang tono' },
    'website-gen':  { name: 'Gumawa ng website',  description: 'Bumuo ng magagandang website gamit ang AI',      tagline: 'Gawa sa AI' },
    'audio-tts':    { name: 'Teksto patungong boses', description: 'Gawing natural na audio ang teksto',         tagline: 'Natural na boses' },
    'image-describe': { name: 'Suriin ang larawan', description: 'Inilalarawan at sinusuri ng AI ang larawan nang detalyado', tagline: 'Vision AI' },
    'face-restore':   { name: 'Ibalik ang mukha', description: 'Ibalik ang mga mukha sa luma o malabong litrato', tagline: 'HD na pag-ayos ng mukha' },
    'text-grammar':   { name: 'Suriin ang gramatika', description: 'Ayusin ang gramatika, baybay, at bantas',    tagline: 'Perpektong teksto' },
    'text-code':      { name: 'Gumawa ng code',   description: 'Bumuo ng code mula sa simpleng paglalarawan',     tagline: 'AI Coder' },
    'text-hashtag':   { name: 'Gumawa ng hashtag', description: 'Lumikha ng perpektong hashtag para sa anumang platform', tagline: 'Dagdag abot' },
  },
  languages: LANGUAGES_MAP,
  library: { ...en.library, subtitle: 'Aking workspace', title: 'Aklatan', items: 'item', favorites: 'Mga paborito', noItems: 'Wala pang item', noItemsDesc: 'Gumawa ng isang bagay at i-save para makita rito', localStorage: 'Lokal na storage', cloudStorage: 'Cloud storage', connectSync: 'Kumonekta & i-sync', filters: { all: 'Lahat', images: 'Mga larawan', text: 'Teksto', website: 'Website', audio: 'Audio' }, sections: { images: '🖼️ Mga larawan', docs: '📄 Mga dokumento at iba pa' }, share: { title: 'Ibahagi', via: 'Ibahagi sa pamamagitan ng', deleteFromLib: 'Burahin sa aklatan' }, cloud: { ...en.library.cloud, upgrade: 'Mag-upgrade', soon: 'Malapit na' }, alerts: { ...en.library.alerts, savedToRoll: '✅ Na-save sa Camera Roll', deleteTitle: 'Burahin', rnaiUpgrade: 'Mag-upgrade', rnaiLater: 'Mamaya', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'Intelligence hub', title: 'AI Manager', activeLabel: 'Aktibo', tabs: { models: 'Mga AI Model', wallet: 'Wallet' }, soonBadge: 'MALAPIT NA', activeModel: 'Aktibong model', quickChat: 'Mabilis na chat', chatPlaceholder: 'Magtanong ng kahit ano...', send: 'Ipadala', thinking: 'nag-iisip...', modelStatus: { connect: 'LAN Connect', featured: '⭐ Tampok', available: 'Available' }, modelDownload: 'I-download', modelConnected: 'Nakakonekta', wallet: { ...en.aiManager.wallet, title: 'Digital wallet', totalBalance: 'Kabuuang balanse', receive: 'Tumanggap', send: 'Magpadala', scan: 'I-scan', assets: 'Mga asset', comingSoon: 'Malapit na', selfCustodialTitle: 'Self-Custodial Wallet', createBtn: '✨ Gumawa ng bagong wallet', addressCopied: 'Nakopya ang address' }, legal: 'Self-Custodial: Ikaw ang responsable sa iyong sariling Private Key. Hindi nag-aalok ang app na ito ng exchange o deposit na serbisyo.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇰🇭 KHMER (ខ្មែរ)
// ─────────────────────────────────────────────────────────────────────────────
const km: Translations = {
  tabs: { home: 'ទំព័រដើម', create: 'បង្កើត', library: 'បណ្ណាល័យ', ai: 'AI', profile: 'ប្រវត្តិរូប' },
  common: {
    save: 'រក្សាទុក', cancel: 'បោះបង់', back: 'ត្រឡប់', close: 'បិទ',
    search: 'ស្វែងរក', clear: 'សម្អាត', viewAll: 'មើលទាំងអស់', seeAll: 'មើលទាំងអស់',
    tapToUse: 'ចុចដើម្បីប្រើ', newCreation: 'ស្នាដៃថ្មី',
    execute: 'ដំណើរការ', processing: 'កំពុងដំណើរការ...',
    yes: 'បាទ/ចាស', no: 'ទេ', ok: 'យល់ព្រម', confirm: 'បញ្ជាក់',
    loading: 'កំពុងផ្ទុក...', error: 'កំហុស', success: 'ជោគជ័យ',
  },
  home: {
    greeting: { morning: 'អរុណសួស្តី', afternoon: 'ទិវាសួស្តី', evening: 'សាយណ្ហសួស្តី' },
    poweredBy: 'ដំណើរការដោយ AI',
    tagline: 'បង្កើតបានគ្រប់យ៉ាង',
    taglineHighlight: 'ភ្លាមៗ',
    startCreating: 'ចាប់ផ្តើមបង្កើត',
    generateBtn: '🎨 បង្កើតរូបភាព',
    creditsLabel: 'ក្រេឌីត',
    stats: { generations: 'ស្នាដៃបង្កើត', creditsUsed: 'ក្រេឌីតប្រើ', dayStreak: 'ថ្ងៃជាប់គ្នា' },
    sections: { aiTools: 'ឧបករណ៍ AI', allSkills: 'ជំនាញទាំងអស់', history: 'ប្រវត្តិ', recentCreations: 'ស្នាដៃថ្មីៗ' },
    skillBadges: { hot: 'ពេញនិយម 🔥', new: 'ថ្មី ✨', top: 'កំពូល' },
    promo: { badge: 'ការផ្តល់ជូនមានកំណត់', title: 'ដំឡើងទៅ Pro ⭐', desc: 'បង្កើតគ្មានដែនកំណត់ · គុណភាព HD', btn: 'មើល →' },
  },
  create: {
    title: 'កន្លែងសាកល្បង',
    subtitle: 'ជ្រើសរើសជំនាញដើម្បីចាប់ផ្តើម',
    searchPlaceholder: '🔍  ស្វែងរកជំនាញ...',
    availableSkills: 'ជំនាញដែលមាន',
    noSkills: 'រកមិនឃើញជំនាញ',
  },
  profile: {
    editBtn: 'កែប្រវត្តិរូប',
    tapToChange: 'ចុចដើម្បីប្តូររូប',
    emailNote: 'ទាក់ទងផ្នែកជំនួយដើម្បីប្តូរអ៊ីមែលរបស់អ្នក។',
    plans: { free: 'ឥតគិតថ្លៃ', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'ក្រេឌីតដែលមាន', of: 'ក្នុងចំណោម', remaining: '% នៅសល់', resets: 'កំណត់ឡើងវិញ', topUp: 'បញ្ចូលក្រេឌីត' },
    stats: { monthly: 'ស្នាដៃ\nខែនេះ', total: 'សរុប\nស្នាដៃ', streak: 'ថ្ងៃ\nជាប់គ្នា 🔥' },
    sections: {
      account: 'គណនី', preferences: 'ចំណូលចិត្ត', storage: 'ឃ្លាំង និងទិន្នន័យ',
      security: 'សុវត្ថិភាព', support: 'ជំនួយ', about: 'អំពី', actions: 'គ្រប់គ្រងគណនី',
    },
    fields: {
      displayName: 'ឈ្មោះបង្ហាញ', email: 'អ៊ីមែល', subscription: 'ការជាវ', billing: 'វិក្កយបត្រ និងការទូទាត់',
      language: 'ភាសា', theme: 'ផ្ទាំង', imageQuality: 'គុណភាពរូបភាព',
      pushNotifications: 'ការជូនដំណឹង', emailUpdates: 'ការធ្វើបច្ចុប្បន្នភាពអ៊ីមែល',
      autoSave: 'រក្សាទុកស្វ័យប្រវត្តិ', wifiOnly: 'Wi-Fi ប៉ុណ្ណោះ (HD)',
      clearCache: 'សម្អាតឃ្លាំងសម្ងាត់', changePassword: 'ប្តូរពាក្យសម្ងាត់',
      twoFA: 'ការផ្ទៀងផ្ទាត់ពីរកត្តា', loginActivity: 'សកម្មភាពចូល',
      helpCenter: 'មជ្ឈមណ្ឌលជំនួយ', rateApp: 'វាយតម្លៃ Rnai',
      feedback: 'ផ្ញើមតិ', privacy: 'គោលការណ៍ឯកជនភាព',
      terms: 'លក្ខខណ្ឌសេវាកម្ម', appVersion: 'កំណែកម្មវិធី',
      apiStatus: 'ស្ថានភាព API', signOut: 'ចេញ', deleteAccount: 'លុបគណនី',
    },
    quality: { standard: 'ស្តង់ដារ', standardDesc: '512×512 · លឿន', hd: 'HD', hdDesc: '1024×1024 · សមតុល្យ', ultra: 'Ultra HD', ultraDesc: '2048×2048 · យឺត' },
    themes: { vibrant: 'ភ្លឺ 🎨', brand: 'ម៉ាក', modern: 'ទំនើប' },
    modals: { editTitle: 'កែប្រវត្តិរូប', languageTitle: 'ភាសា', qualityTitle: 'គុណភាពរូបភាព' },
    signOutDialog:  { title: 'ចេញ', message: 'តើអ្នកប្រាកដថាចង់ចេញមែនទេ?', confirm: 'ចេញ' },
    deleteDialog:   { title: '⚠️ លុបគណនី', message: 'វានឹងលុបគណនី និងទិន្នន័យទាំងអស់របស់អ្នកជាអចិន្ត្រៃយ៍។ មិនអាចសង្គ្រោះវិញបានទេ។', confirm: 'លុប' },
    alerts: {
      emailCannotChange: 'មិនអាចប្តូរអ៊ីមែលនៅពេលនេះទេ',
      billingMsg: 'គ្រប់គ្រងវិធីទូទាត់', upgradeMsg: 'មើលជម្រើសគម្រោង',
      clearCacheMsg: 'សម្អាតឃ្លាំងសម្ងាត់បានជោគជ័យ',
      loginActivityMsg: 'ចូលចុងក្រោយ៖ ថ្ងៃនេះ ម៉ោង 10:42\nឧបករណ៍៖ iPhone 15 Pro\nទីតាំង៖ បាងកក',
      rateMsg: 'អរគុណសម្រាប់ការគាំទ្ររបស់អ្នក! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'តំណកំណត់ឡើងវិញនឹងត្រូវផ្ញើទៅអ៊ីមែលរបស់អ្នក',
      apiOperational: '🟢 ដំណើរការ',
    },
    proStatusLabel: '⭐ គម្រោង Pro',
    operationalLabel: '🟢 ដំណើរការ',
  },
  skill: {
    inputLabel: 'ការបញ្ចូល',
    quickPrompts: '⚡ ប្រអប់បញ្ចូលរហ័ស',
    examplesLabel: '✨ លទ្ធផលគំរូ',
    placeholders: { image: 'ពិពណ៌នារូបភាពដែលអ្នកចង់បង្កើត...', audio: 'បញ្ចូលអត្ថបទដើម្បីបម្លែងជាសំឡេង...', text: 'បញ្ចូលអត្ថបទ ឬការណែនាំរបស់អ្នក...' },
    chars: 'តួអក្សរ', execute: 'ដំណើរការ', processing: 'កំពុងដំណើរការ...',
    templatesCount: 'គំរូ', aiProcessing: 'AI កំពុងដំណើរការ...',
    resultLabel: 'លទ្ធផល',
  },
  skills: {
    'image-gen':    { name: 'បង្កើតរូបភាព',       description: 'បង្កើតរូបភាពពិសេសពីការពិពណ៌នាជាអត្ថបទ',        tagline: 'អត្ថបទ → រូបភាព' },
    'image-edit':   { name: 'កែរូបភាព',           description: 'កែ និងបង្កើនគុណភាពរូបភាពដោយ AI',                tagline: 'កែ & បង្កើន' },
    'remove-bg':    { name: 'លុបផ្ទៃខាងក្រោយ',     description: 'បំបែកវត្ថុចេញពីផ្ទៃខាងក្រោយយ៉ាងស្អាត',           tagline: 'កាត់ស្អាត' },
    'upscale':      { name: 'បង្កើនគុណភាព',       description: 'បង្កើនគុណភាព និងព័ត៌មានលម្អិត',                  tagline: 'បង្កើន HD' },
    'stylize':      { name: 'រចនាបថសិល្បៈ',       description: 'បម្លែងរូបថតទៅជារចនាបថសិល្បៈ',                    tagline: 'រចនាបថសិល្បៈ' },
    'text-gen':     { name: 'បង្កើតអត្ថបទ',        description: 'សរសេរមាតិកាគួរឱ្យចាប់អារម្មណ៍ដោយ AI',           tagline: 'អ្នកនិពន្ធ AI' },
    'text-sum':     { name: 'សង្ខេបអត្ថបទ',        description: 'បង្រួមមាតិកាវែងជាសេចក្តីសង្ខេបច្បាស់',           tagline: 'សង្ខេបឆ្លាត' },
    'text-trans':   { name: 'បកប្រែ',             description: 'បកប្រែយ៉ាងធម្មជាតិជាង 50 ភាសា',                tagline: '50+ ភាសា' },
    'text-rewrite': { name: 'សរសេរឡើងវិញ',        description: 'ប្តូរសំនៀង និងរចនាបថនៃអត្ថបទណាមួយ',             tagline: 'គ្រប់សំនៀង' },
    'website-gen':  { name: 'បង្កើតគេហទំព័រ',      description: 'បង្កើតគេហទំព័រស្អាតដោយ AI',                     tagline: 'បង្កើតដោយ AI' },
    'audio-tts':    { name: 'អត្ថបទទៅសំឡេង',      description: 'បម្លែងអត្ថបទទៅជាសំឡេងធម្មជាតិ',                 tagline: 'សំឡេងធម្មជាតិ' },
    'image-describe': { name: 'វិភាគរូបភាព',       description: 'AI ពិពណ៌នា និងវិភាគរូបភាពយ៉ាងលម្អិត',          tagline: 'Vision AI' },
    'face-restore':   { name: 'ស្តារមុខ',          description: 'ស្តារមុខក្នុងរូបថតចាស់ ឬព្រិល',                 tagline: 'ស្តារមុខ HD' },
    'text-grammar':   { name: 'ពិនិត្យវេយ្យាករណ៍',  description: 'កែវេយ្យាករណ៍ អក្ខរាវិរុទ្ធ និងវណ្ណយុត្តិ',        tagline: 'អត្ថបទល្អឥតខ្ចោះ' },
    'text-code':      { name: 'បង្កើតកូដ',         description: 'បង្កើតកូដពីការពិពណ៌នាជាភាសាធម្មតា',              tagline: 'AI Coder' },
    'text-hashtag':   { name: 'បង្កើត Hashtag',     description: 'បង្កើត hashtag ល្អឥតខ្ចោះសម្រាប់គ្រប់វេទិកា',     tagline: 'បង្កើនការចូលដល់' },
  },
  languages: LANGUAGES_MAP,
  library: { ...en.library, subtitle: 'កន្លែងធ្វើការរបស់ខ្ញុំ', title: 'បណ្ណាល័យ', items: 'ធាតុ', favorites: 'សំណព្វ', noItems: 'មិនទាន់មានធាតុ', noItemsDesc: 'បង្កើតអ្វីមួយ ហើយរក្សាទុកដើម្បីមើលនៅទីនេះ', localStorage: 'ឃ្លាំងផ្ទៃក្នុង', cloudStorage: 'ឃ្លាំង Cloud', connectSync: 'ភ្ជាប់ & ធ្វើសមកាលកម្ម', filters: { all: 'ទាំងអស់', images: 'រូបភាព', text: 'អត្ថបទ', website: 'គេហទំព័រ', audio: 'សំឡេង' }, sections: { images: '🖼️ រូបភាព', docs: '📄 ឯកសារ និងផ្សេងៗ' }, share: { title: 'ចែករំលែក', via: 'ចែករំលែកតាម', deleteFromLib: 'លុបចេញពីបណ្ណាល័យ' }, cloud: { ...en.library.cloud, upgrade: 'ដំឡើង', soon: 'ឆាប់ៗ' }, alerts: { ...en.library.alerts, savedToRoll: '✅ បានរក្សាទុកទៅ Camera Roll', deleteTitle: 'លុប', rnaiUpgrade: 'ដំឡើង', rnaiLater: 'ពេលក្រោយ', comingOk: 'យល់ព្រម' } },
  aiManager: { ...en.aiManager, subtitle: 'មជ្ឈមណ្ឌលបញ្ញា', title: 'AI Manager', activeLabel: 'សកម្ម', tabs: { models: 'ម៉ូដែល AI', wallet: 'កាបូប' }, soonBadge: 'ឆាប់ៗ', activeModel: 'ម៉ូដែលសកម្ម', quickChat: 'ជជែករហ័ស', chatPlaceholder: 'សួរអ្វីក៏បាន...', send: 'ផ្ញើ', thinking: 'កំពុងគិត...', modelStatus: { connect: 'ភ្ជាប់ LAN', featured: '⭐ ផ្តល់អនុសាសន៍', available: 'មាន' }, modelDownload: 'ទាញយក', modelConnected: 'បានភ្ជាប់', wallet: { ...en.aiManager.wallet, title: 'កាបូបឌីជីថល', totalBalance: 'សមតុល្យសរុប', receive: 'ទទួល', send: 'ផ្ញើ', scan: 'ស្កេន', assets: 'ទ្រព្យសកម្ម', comingSoon: 'ឆាប់ៗ', selfCustodialTitle: 'កាបូប Self-Custodial', createBtn: '✨ បង្កើតកាបូបថ្មី', addressCopied: 'បានចម្លងអាសយដ្ឋាន' }, legal: 'Self-Custodial៖ អ្នកទទួលខុសត្រូវលើ Private Key របស់អ្នកផ្ទាល់។ កម្មវិធីនេះមិនផ្តល់សេវាប្តូរប្រាក់ ឬដាក់ប្រាក់ទេ។' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇱🇦 LAO (ລາວ)
// ─────────────────────────────────────────────────────────────────────────────
const lo: Translations = {
  tabs: { home: 'ໜ້າຫຼັກ', create: 'ສ້າງ', library: 'ຄັງ', ai: 'AI', profile: 'ໂປຣໄຟລ໌' },
  common: {
    save: 'ບັນທຶກ', cancel: 'ຍົກເລີກ', back: 'ກັບຄືນ', close: 'ປິດ',
    search: 'ຄົ້ນຫາ', clear: 'ລ້າງ', viewAll: 'ເບິ່ງທັງໝົດ', seeAll: 'ເບິ່ງທັງໝົດ',
    tapToUse: 'ແຕະເພື່ອໃຊ້', newCreation: 'ຜົນງານໃໝ່',
    execute: 'ດຳເນີນການ', processing: 'ກຳລັງດຳເນີນການ...',
    yes: 'ແມ່ນ', no: 'ບໍ່', ok: 'ຕົກລົງ', confirm: 'ຢືນຢັນ',
    loading: 'ກຳລັງໂຫຼດ...', error: 'ຂໍ້ຜິດພາດ', success: 'ສຳເລັດ',
  },
  home: {
    greeting: { morning: 'ສະບາຍດີຕອນເຊົ້າ', afternoon: 'ສະບາຍດີຕອນບ່າຍ', evening: 'ສະບາຍດີຕອນແລງ' },
    poweredBy: 'ຂັບເຄື່ອນໂດຍ AI',
    tagline: 'ສ້າງໄດ້ທຸກຢ່າງ',
    taglineHighlight: 'ທັນທີ',
    startCreating: 'ເລີ່ມສ້າງ',
    generateBtn: '🎨 ສ້າງຮູບ',
    creditsLabel: 'ເຄຣດິດ',
    stats: { generations: 'ຜົນງານທີ່ສ້າງ', creditsUsed: 'ເຄຣດິດທີ່ໃຊ້', dayStreak: 'ມື້ຕິດຕໍ່ກັນ' },
    sections: { aiTools: 'ເຄື່ອງມື AI', allSkills: 'ທັກສະທັງໝົດ', history: 'ປະຫວັດ', recentCreations: 'ຜົນງານຫຼ້າສຸດ' },
    skillBadges: { hot: 'ຮິດ 🔥', new: 'ໃໝ່ ✨', top: 'ຍອດນິຍົມ' },
    promo: { badge: 'ຂໍ້ສະເໜີຈຳກັດ', title: 'ອັບເກຣດເປັນ Pro ⭐', desc: 'ສ້າງບໍ່ຈຳກັດ · ຄຸນນະພາບ HD', btn: 'ເບິ່ງ →' },
  },
  create: {
    title: 'ສະໜາມທົດລອງ',
    subtitle: 'ເລືອກທັກສະເພື່ອເລີ່ມຕົ້ນ',
    searchPlaceholder: '🔍  ຄົ້ນຫາທັກສະ...',
    availableSkills: 'ທັກສະທີ່ມີ',
    noSkills: 'ບໍ່ພົບທັກສະ',
  },
  profile: {
    editBtn: 'ແກ້ໄຂໂປຣໄຟລ໌',
    tapToChange: 'ແຕະເພື່ອປ່ຽນຮູບ',
    emailNote: 'ຕິດຕໍ່ຝ່າຍຊ່ວຍເຫຼືອເພື່ອປ່ຽນອີເມວຂອງທ່ານ.',
    plans: { free: 'ຟຣີ', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'ເຄຣດິດທີ່ມີ', of: 'ຈາກ', remaining: '% ຍັງເຫຼືອ', resets: 'ຣີເຊັດ', topUp: 'ເຕີມເຄຣດິດ' },
    stats: { monthly: 'ຜົນງານ\nເດືອນນີ້', total: 'ລວມ\nຜົນງານ', streak: 'ມື້\nຕິດຕໍ່ກັນ 🔥' },
    sections: {
      account: 'ບັນຊີ', preferences: 'ການຕັ້ງຄ່າ', storage: 'ບ່ອນເກັບ & ຂໍ້ມູນ',
      security: 'ຄວາມປອດໄພ', support: 'ຊ່ວຍເຫຼືອ', about: 'ກ່ຽວກັບ', actions: 'ການຈັດການບັນຊີ',
    },
    fields: {
      displayName: 'ຊື່ສະແດງ', email: 'ອີເມວ', subscription: 'ການສະໝັກ', billing: 'ໃບບິນ & ການຈ່າຍ',
      language: 'ພາສາ', theme: 'ຮູບແບບ', imageQuality: 'ຄຸນນະພາບຮູບ',
      pushNotifications: 'ການແຈ້ງເຕືອນ', emailUpdates: 'ການອັບເດດອີເມວ',
      autoSave: 'ບັນທຶກຜົນອັດຕະໂນມັດ', wifiOnly: 'Wi-Fi ເທົ່ານັ້ນ (HD)',
      clearCache: 'ລ້າງແຄຊ', changePassword: 'ປ່ຽນລະຫັດຜ່ານ',
      twoFA: 'ການຢືນຢັນສອງຊັ້ນ', loginActivity: 'ກິດຈະກຳການເຂົ້າສູ່ລະບົບ',
      helpCenter: 'ສູນຊ່ວຍເຫຼືອ', rateApp: 'ໃຫ້ຄະແນນ Rnai',
      feedback: 'ສົ່ງຄຳຕິຊົມ', privacy: 'ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ',
      terms: 'ຂໍ້ກຳນົດການບໍລິການ', appVersion: 'ເວີຊັນແອັບ',
      apiStatus: 'ສະຖານະ API', signOut: 'ອອກຈາກລະບົບ', deleteAccount: 'ລຶບບັນຊີ',
    },
    quality: { standard: 'ມາດຕະຖານ', standardDesc: '512×512 · ໄວ', hd: 'HD', hdDesc: '1024×1024 · ສົມດຸນ', ultra: 'Ultra HD', ultraDesc: '2048×2048 · ຊ້າ' },
    themes: { vibrant: 'ສົດໃສ 🎨', brand: 'ແບຣນ', modern: 'ທັນສະໄໝ' },
    modals: { editTitle: 'ແກ້ໄຂໂປຣໄຟລ໌', languageTitle: 'ພາສາ', qualityTitle: 'ຄຸນນະພາບຮູບ' },
    signOutDialog:  { title: 'ອອກຈາກລະບົບ', message: 'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອອກຈາກລະບົບ?', confirm: 'ອອກຈາກລະບົບ' },
    deleteDialog:   { title: '⚠️ ລຶບບັນຊີ', message: 'ການກະທຳນີ້ຈະລຶບບັນຊີ ແລະຂໍ້ມູນທັງໝົດຂອງທ່ານຖາວອນ. ບໍ່ສາມາດກູ້ຄືນໄດ້.', confirm: 'ລຶບ' },
    alerts: {
      emailCannotChange: 'ບໍ່ສາມາດປ່ຽນອີເມວໃນຕອນນີ້',
      billingMsg: 'ຈັດການວິທີການຈ່າຍເງິນ', upgradeMsg: 'ເບິ່ງທາງເລືອກແພັກເກດ',
      clearCacheMsg: 'ລ້າງແຄຊສຳເລັດແລ້ວ',
      loginActivityMsg: 'ເຂົ້າສູ່ລະບົບຫຼ້າສຸດ: ມື້ນີ້ 10:42\nອຸປະກອນ: iPhone 15 Pro\nສະຖານທີ່: ບາງກອກ',
      rateMsg: 'ຂອບໃຈສຳລັບການສະໜັບສະໜູນ! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'ລິ້ງຣີເຊັດຈະຖືກສົ່ງໄປຫາອີເມວຂອງທ່ານ',
      apiOperational: '🟢 ໃຊ້ງານໄດ້ປົກກະຕິ',
    },
    proStatusLabel: '⭐ ແພັກເກດ Pro',
    operationalLabel: '🟢 ໃຊ້ງານໄດ້ປົກກະຕິ',
  },
  skill: {
    inputLabel: 'ການປ້ອນຂໍ້ມູນ',
    quickPrompts: '⚡ ພຣອມພ໌ດ່ວນ',
    examplesLabel: '✨ ຕົວຢ່າງຜົນລັບ',
    placeholders: { image: 'ອະທິບາຍຮູບທີ່ທ່ານຕ້ອງການສ້າງ...', audio: 'ປ້ອນຂໍ້ຄວາມເພື່ອປ່ຽນເປັນສຽງ...', text: 'ປ້ອນຂໍ້ຄວາມ ຫຼືຄຳແນະນຳຂອງທ່ານ...' },
    chars: 'ຕົວອັກສອນ', execute: 'ດຳເນີນການ', processing: 'ກຳລັງດຳເນີນການ...',
    templatesCount: 'ແມ່ແບບ', aiProcessing: 'AI ກຳລັງດຳເນີນການ...',
    resultLabel: 'ຜົນລັບ',
  },
  skills: {
    'image-gen':    { name: 'ສ້າງຮູບ',            description: 'ສ້າງຮູບທີ່ເປັນເອກະລັກຈາກຄຳອະທິບາຍ',           tagline: 'ຂໍ້ຄວາມ → ຮູບ' },
    'image-edit':   { name: 'ແກ້ໄຂຮູບ',           description: 'ປັບແຕ່ງ ແລະເພີ່ມຄຸນນະພາບຮູບດ້ວຍ AI',          tagline: 'ປັບແຕ່ງ & ເພີ່ມ' },
    'remove-bg':    { name: 'ລຶບພື້ນຫຼັງ',         description: 'ແຍກວັດຖຸອອກຈາກພື້ນຫຼັງຢ່າງສະອາດ',             tagline: 'ຕັດສະອາດ' },
    'upscale':      { name: 'ເພີ່ມຄວາມລະອຽດ',      description: 'ເພີ່ມຄວາມລະອຽດ ແລະລາຍລະອຽດ',                  tagline: 'ເພີ່ມ HD' },
    'stylize':      { name: 'ສະໄຕລ໌ສິລະປະ',       description: 'ປ່ຽນຮູບເປັນສະໄຕລ໌ສິລະປະຕ່າງໆ',                tagline: 'ສະໄຕລ໌ສິລະປະ' },
    'text-gen':     { name: 'ສ້າງຂໍ້ຄວາມ',         description: 'ຂຽນເນື້ອຫາທີ່ໜ້າສົນໃຈດ້ວຍ AI',                 tagline: 'ນັກຂຽນ AI' },
    'text-sum':     { name: 'ສະຫຼຸບຂໍ້ຄວາມ',        description: 'ຫຍໍ້ເນື້ອຫາຍາວໃຫ້ກະທັດຮັດ',                    tagline: 'ສະຫຼຸບສະຫຼາດ' },
    'text-trans':   { name: 'ແປພາສາ',            description: 'ແປຢ່າງເປັນທຳມະຊາດກວ່າ 50 ພາສາ',               tagline: '50+ ພາສາ' },
    'text-rewrite': { name: 'ຂຽນໃໝ່',            description: 'ປ່ຽນໂທນ ແລະສະໄຕລ໌ຂອງຂໍ້ຄວາມ',                 tagline: 'ທຸກໂທນ' },
    'website-gen':  { name: 'ສ້າງເວັບໄຊ',          description: 'ສ້າງເວັບໄຊທີ່ສວຍງາມດ້ວຍ AI',                  tagline: 'ສ້າງດ້ວຍ AI' },
    'audio-tts':    { name: 'ຂໍ້ຄວາມເປັນສຽງ',       description: 'ປ່ຽນຂໍ້ຄວາມເປັນສຽງທຳມະຊາດ',                   tagline: 'ສຽງທຳມະຊາດ' },
    'image-describe': { name: 'ວິເຄາະຮູບ',         description: 'AI ອະທິບາຍ ແລະວິເຄາະຮູບຢ່າງລະອຽດ',           tagline: 'Vision AI' },
    'face-restore':   { name: 'ຟື້ນຟູໃບໜ້າ',       description: 'ຟື້ນຟູໃບໜ້າໃນຮູບເກົ່າ ຫຼືມົວ',                 tagline: 'ຟື້ນຟູໜ້າ HD' },
    'text-grammar':   { name: 'ກວດໄວຍະກອນ',       description: 'ແກ້ໄຂໄວຍະກອນ ການສະກົດ ແລະເຄື່ອງໝາຍ',          tagline: 'ຂໍ້ຄວາມສົມບູນ' },
    'text-code':      { name: 'ສ້າງໂຄ້ດ',          description: 'ສ້າງໂຄ້ດຈາກຄຳອະທິບາຍພາສາທຳມະດາ',              tagline: 'AI Coder' },
    'text-hashtag':   { name: 'ສ້າງ Hashtag',      description: 'ສ້າງ hashtag ທີ່ເໝາະສຳລັບທຸກແພລດຟອມ',          tagline: 'ເພີ່ມການເຂົ້າເຖິງ' },
  },
  languages: LANGUAGES_MAP,
  library: { ...en.library, subtitle: 'ພື້ນທີ່ເຮັດວຽກຂອງຂ້ອຍ', title: 'ຄັງ', items: 'ລາຍການ', favorites: 'ລາຍການໂປດ', noItems: 'ຍັງບໍ່ມີລາຍການ', noItemsDesc: 'ສ້າງ ແລະບັນທຶກບາງຢ່າງເພື່ອເບິ່ງທີ່ນີ້', localStorage: 'ບ່ອນເກັບໃນເຄື່ອງ', cloudStorage: 'ບ່ອນເກັບ Cloud', connectSync: 'ເຊື່ອມຕໍ່ & ຊິ້ງ', filters: { all: 'ທັງໝົດ', images: 'ຮູບ', text: 'ຂໍ້ຄວາມ', website: 'ເວັບໄຊ', audio: 'ສຽງ' }, sections: { images: '🖼️ ຮູບ', docs: '📄 ເອກະສານ & ອື່ນໆ' }, share: { title: 'ແບ່ງປັນ', via: 'ແບ່ງປັນຜ່ານ', deleteFromLib: 'ລຶບອອກຈາກຄັງ' }, cloud: { ...en.library.cloud, upgrade: 'ອັບເກຣດ', soon: 'ໄວໆນີ້' }, alerts: { ...en.library.alerts, savedToRoll: '✅ ບັນທຶກໄປຍັງ Camera Roll', deleteTitle: 'ລຶບ', rnaiUpgrade: 'ອັບເກຣດ', rnaiLater: 'ພາຍຫຼັງ', comingOk: 'ຕົກລົງ' } },
  aiManager: { ...en.aiManager, subtitle: 'ສູນປັນຍາປະດິດ', title: 'AI Manager', activeLabel: 'ໃຊ້ງານຢູ່', tabs: { models: 'ໂມເດວ AI', wallet: 'ກະເປົາເງິນ' }, soonBadge: 'ໄວໆນີ້', activeModel: 'ໂມເດວທີ່ໃຊ້', quickChat: 'ແຊັດດ່ວນ', chatPlaceholder: 'ຖາມຫຍັງກໍ່ໄດ້...', send: 'ສົ່ງ', thinking: 'ກຳລັງຄິດ...', modelStatus: { connect: 'ເຊື່ອມຕໍ່ LAN', featured: '⭐ ແນະນຳ', available: 'ໃຊ້ໄດ້' }, modelDownload: 'ດາວໂຫຼດ', modelConnected: 'ເຊື່ອມຕໍ່ແລ້ວ', wallet: { ...en.aiManager.wallet, title: 'ກະເປົາເງິນດິຈິຕອລ', totalBalance: 'ຍອດລວມ', receive: 'ຮັບ', send: 'ສົ່ງ', scan: 'ສະແກນ', assets: 'ຊັບສິນ', comingSoon: 'ໄວໆນີ້', selfCustodialTitle: 'ກະເປົາ Self-Custodial', createBtn: '✨ ສ້າງກະເປົາໃໝ່', addressCopied: 'ສຳເນົາທີ່ຢູ່ແລ້ວ' }, legal: 'Self-Custodial: ທ່ານຮັບຜິດຊອບ Private Key ຂອງທ່ານເອງ. ແອັບນີ້ບໍ່ໃຫ້ບໍລິການແລກປ່ຽນ ຫຼືຝາກເງິນ.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🇲🇲 BURMESE (မြန်မာ)
// ─────────────────────────────────────────────────────────────────────────────
const my: Translations = {
  tabs: { home: 'ပင်မ', create: 'ဖန်တီး', library: 'စာကြည့်တိုက်', ai: 'AI', profile: 'ပရိုဖိုင်' },
  common: {
    save: 'သိမ်းရန်', cancel: 'ပယ်ဖျက်', back: 'နောက်သို့', close: 'ပိတ်',
    search: 'ရှာဖွေ', clear: 'ရှင်းလင်း', viewAll: 'အားလုံးကြည့်', seeAll: 'အားလုံးကြည့်',
    tapToUse: 'အသုံးပြုရန်တို့ပါ', newCreation: 'ဖန်တီးမှုအသစ်',
    execute: 'လုပ်ဆောင်', processing: 'လုပ်ဆောင်နေသည်...',
    yes: 'ဟုတ်', no: 'မဟုတ်', ok: 'OK', confirm: 'အတည်ပြု',
    loading: 'ဖွင့်နေသည်...', error: 'အမှား', success: 'အောင်မြင်',
  },
  home: {
    greeting: { morning: 'မင်္ဂလာနံနက်ခင်းပါ', afternoon: 'မင်္ဂလာနေ့လယ်ခင်းပါ', evening: 'မင်္ဂလာညနေခင်းပါ' },
    poweredBy: 'AI ဖြင့်လည်ပတ်',
    tagline: 'ဘာမဆိုဖန်တီးပါ',
    taglineHighlight: 'ချက်ချင်း',
    startCreating: 'ဖန်တီးခြင်းစတင်ပါ',
    generateBtn: '🎨 ပုံဖန်တီးရန်',
    creditsLabel: 'ခရက်ဒစ်',
    stats: { generations: 'ဖန်တီးမှုများ', creditsUsed: 'သုံးပြီးခရက်ဒစ်', dayStreak: 'ဆက်တိုက်ရက်' },
    sections: { aiTools: 'AI ကိရိယာများ', allSkills: 'ကျွမ်းကျင်မှုအားလုံး', history: 'မှတ်တမ်း', recentCreations: 'မကြာသေးမီဖန်တီးမှု' },
    skillBadges: { hot: 'လူကြိုက်များ 🔥', new: 'အသစ် ✨', top: 'ထိပ်တန်း' },
    promo: { badge: 'အကန့်အသတ်ကမ်းလှမ်းချက်', title: 'Pro သို့အဆင့်မြှင့်ပါ ⭐', desc: 'အကန့်အသတ်မရှိဖန်တီး · HD အရည်အသွေး', btn: 'ကြည့်ရန် →' },
  },
  create: {
    title: 'ကစားကွင်း',
    subtitle: 'စတင်ရန်ကျွမ်းကျင်မှုတစ်ခုရွေးပါ',
    searchPlaceholder: '🔍  ကျွမ်းကျင်မှုရှာရန်...',
    availableSkills: 'ရရှိနိုင်သောကျွမ်းကျင်မှု',
    noSkills: 'ကျွမ်းကျင်မှုမတွေ့ပါ',
  },
  profile: {
    editBtn: 'ပရိုဖိုင်ပြင်ရန်',
    tapToChange: 'ဓာတ်ပုံပြောင်းရန်တို့ပါ',
    emailNote: 'အီးမေးလ်ပြောင်းရန်အကူအညီသို့ဆက်သွယ်ပါ။',
    plans: { free: 'အခမဲ့', pro: 'Pro ⭐', enterprise: 'Enterprise 👑' },
    credits: { available: 'ရရှိနိုင်သောခရက်ဒစ်', of: '၏', remaining: '% ကျန်', resets: 'ပြန်လည်သတ်မှတ်', topUp: 'ဖြည့်သွင်း' },
    stats: { monthly: 'ဖန်တီးမှု\nဤလ', total: 'စုစုပေါင်း\nဖန်တီးမှု', streak: 'ဆက်တိုက်\nရက် 🔥' },
    sections: {
      account: 'အကောင့်', preferences: 'နှစ်သက်မှုများ', storage: 'သိုလှောင်မှု & ဒေတာ',
      security: 'လုံခြုံရေး', support: 'အကူအညီ', about: 'အကြောင်း', actions: 'အကောင့်စီမံခန့်ခွဲမှု',
    },
    fields: {
      displayName: 'ဖော်ပြအမည်', email: 'အီးမေးလ်', subscription: 'စာရင်းသွင်းမှု', billing: 'ငွေတောင်းခံ & ပေးချေမှု',
      language: 'ဘာသာစကား', theme: 'အပြင်အဆင်', imageQuality: 'ပုံအရည်အသွေး',
      pushNotifications: 'အသိပေးချက်များ', emailUpdates: 'အီးမေးလ်အပ်ဒိတ်များ',
      autoSave: 'ရလဒ်အလိုအလျောက်သိမ်း', wifiOnly: 'Wi-Fi သာ (HD)',
      clearCache: 'cache ရှင်းရန်', changePassword: 'စကားဝှက်ပြောင်းရန်',
      twoFA: 'နှစ်ဆင့်အတည်ပြုခြင်း', loginActivity: 'ဝင်ရောက်မှုလှုပ်ရှားမှု',
      helpCenter: 'အကူအညီစင်တာ', rateApp: 'Rnai ကိုအဆင့်သတ်မှတ်',
      feedback: 'အကြံပြုချက်ပို့ရန်', privacy: 'ကိုယ်ရေးကိုယ်တာမူဝါဒ',
      terms: 'ဝန်ဆောင်မှုစည်းကမ်း', appVersion: 'အက်ပ်ဗားရှင်း',
      apiStatus: 'API အခြေအနေ', signOut: 'ထွက်ရန်', deleteAccount: 'အကောင့်ဖျက်ရန်',
    },
    quality: { standard: 'စံ', standardDesc: '512×512 · မြန်', hd: 'HD', hdDesc: '1024×1024 · ဟန်ချက်', ultra: 'Ultra HD', ultraDesc: '2048×2048 · နှေး' },
    themes: { vibrant: 'တောက်ပ 🎨', brand: 'အမှတ်တံဆိပ်', modern: 'ခေတ်မီ' },
    modals: { editTitle: 'ပရိုဖိုင်ပြင်ရန်', languageTitle: 'ဘာသာစကား', qualityTitle: 'ပုံအရည်အသွေး' },
    signOutDialog:  { title: 'ထွက်ရန်', message: 'ထွက်လိုသည်မှာသေချာပါသလား?', confirm: 'ထွက်ရန်' },
    deleteDialog:   { title: '⚠️ အကောင့်ဖျက်ရန်', message: 'ဤလုပ်ဆောင်ချက်သည် သင့်အကောင့်နှင့်ဒေတာအားလုံးကို အပြီးအပိုင်ဖျက်ပစ်မည်။ ပြန်လည်ရယူ၍မရပါ။', confirm: 'ဖျက်ရန်' },
    alerts: {
      emailCannotChange: 'ယခုအချိန်တွင်အီးမေးလ်ပြောင်း၍မရပါ',
      billingMsg: 'ပေးချေမှုနည်းလမ်းများစီမံ', upgradeMsg: 'အစီအစဉ်ရွေးချယ်စရာများကြည့်ရန်',
      clearCacheMsg: 'cache ရှင်းလင်းပြီးပါပြီ',
      loginActivityMsg: 'နောက်ဆုံးဝင်ရောက်မှု: ယနေ့ 10:42\nစက်: iPhone 15 Pro\nတည်နေရာ: ဘန်ကောက်',
      rateMsg: 'သင့်ပံ့ပိုးမှုအတွက်ကျေးဇူးတင်ပါသည်! 🙏',
      feedbackEmail: 'feedback@rnai.io',
      helpUrl: 'rnai.io/help', privacyUrl: 'rnai.io/privacy', termsUrl: 'rnai.io/terms',
      passwordMsg: 'ပြန်လည်သတ်မှတ်ရန်လင့်ခ်ကို သင့်အီးမေးလ်သို့ပို့ပါမည်',
      apiOperational: '🟢 ပုံမှန်လည်ပတ်',
    },
    proStatusLabel: '⭐ Pro အစီအစဉ်',
    operationalLabel: '🟢 ပုံမှန်လည်ပတ်',
  },
  skill: {
    inputLabel: 'ထည့်သွင်းမှု',
    quickPrompts: '⚡ အမြန် Prompt',
    examplesLabel: '✨ ရလဒ်နမူနာများ',
    placeholders: { image: 'ဖန်တီးလိုသောပုံကိုဖော်ပြပါ...', audio: 'အသံပြောင်းရန်စာသားထည့်ပါ...', text: 'သင့်စာသား သို့မဟုတ် ညွှန်ကြားချက်များထည့်ပါ...' },
    chars: 'အက္ခရာ', execute: 'လုပ်ဆောင်', processing: 'လုပ်ဆောင်နေသည်...',
    templatesCount: 'ပုံစံများ', aiProcessing: 'AI လုပ်ဆောင်နေသည်...',
    resultLabel: 'ရလဒ်',
  },
  skills: {
    'image-gen':    { name: 'ပုံဖန်တီး',           description: 'စာသားဖော်ပြချက်မှ ထူးခြားသောပုံများဖန်တီး',     tagline: 'စာသား → ပုံ' },
    'image-edit':   { name: 'ပုံပြင်ဆင်',          description: 'AI ဖြင့်ပုံများပြင်ဆင်တိုးတက်စေ',               tagline: 'ပြင်ဆင် & တိုးတက်' },
    'remove-bg':    { name: 'နောက်ခံဖယ်ရှား',      description: 'နောက်ခံမှအရာဝတ္ထုကိုသပ်ရပ်စွာခွဲထုတ်',          tagline: 'သပ်ရပ်စွာဖြတ်' },
    'upscale':      { name: 'ကြည်လင်ပြတ်သားမြှင့်', description: 'ကြည်လင်ပြတ်သားမှုနှင့်အသေးစိတ်တိုးမြှင့်',       tagline: 'HD မြှင့်တင်' },
    'stylize':      { name: 'အနုပညာစတိုင်',       description: 'ဓာတ်ပုံများကိုအနုပညာစတိုင်အဖြစ်ပြောင်း',         tagline: 'အနုပညာစတိုင်' },
    'text-gen':     { name: 'စာသားဖန်တီး',         description: 'AI ဖြင့်ဆွဲဆောင်မှုရှိသောအကြောင်းအရာရေး',        tagline: 'AI စာရေးဆရာ' },
    'text-sum':     { name: 'စာသားအကျဉ်းချုပ်',    description: 'ရှည်လျားသောအကြောင်းအရာကိုရှင်းလင်းစွာအကျဉ်းချုပ်', tagline: 'စမတ်အကျဉ်းချုပ်' },
    'text-trans':   { name: 'ဘာသာပြန်',           description: 'ဘာသာစကား ၅၀ ကျော်ကိုသဘာဝကျကျဘာသာပြန်',           tagline: '၅၀+ ဘာသာစကား' },
    'text-rewrite': { name: 'ပြန်ရေး',            description: 'မည်သည့်စာသား၏လေသံနှင့်စတိုင်ကိုပြောင်း',           tagline: 'လေသံအမျိုးမျိုး' },
    'website-gen':  { name: 'ဝက်ဘ်ဆိုက်ဖန်တီး',    description: 'AI ဖြင့်လှပသောဝက်ဘ်ဆိုက်များတည်ဆောက်',          tagline: 'AI ဖြင့်တည်ဆောက်' },
    'audio-tts':    { name: 'စာသားမှအသံ',          description: 'စာသားကိုသဘာဝကျသောအသံအဖြစ်ပြောင်း',              tagline: 'သဘာဝအသံ' },
    'image-describe': { name: 'ပုံခွဲခြမ်းစိတ်ဖြာ',  description: 'AI က ပုံကိုအသေးစိတ်ဖော်ပြခွဲခြမ်းစိတ်ဖြာ',       tagline: 'Vision AI' },
    'face-restore':   { name: 'မျက်နှာပြန်လည်ပြုပြင်', description: 'ဓာတ်ပုံဟောင်း သို့မဟုတ် ဝါးသောပုံများရှိမျက်နှာပြန်ပြုပြင်', tagline: 'HD မျက်နှာပြုပြင်' },
    'text-grammar':   { name: 'သဒ္ဒါစစ်ဆေး',       description: 'သဒ္ဒါ၊ စာလုံးပေါင်းနှင့်ပုဒ်ဖြတ်ပုဒ်ရပ်ပြင်ဆင်',    tagline: 'ပြီးပြည့်စုံစာသား' },
    'text-code':      { name: 'ကုဒ်ဖန်တီး',        description: 'ရိုးရှင်းသောဖော်ပြချက်မှကုဒ်ဖန်တီး',             tagline: 'AI Coder' },
    'text-hashtag':   { name: 'Hashtag ဖန်တီး',    description: 'မည်သည့်ပလက်ဖောင်းအတွက်မဆိုသင့်တော်သော hashtag ဖန်တီး', tagline: 'ရောက်ရှိမှုတိုး' },
  },
  languages: LANGUAGES_MAP,
  library: { ...en.library, subtitle: 'ကျွန်ုပ်၏အလုပ်နေရာ', title: 'စာကြည့်တိုက်', items: ' items', favorites: 'အကြိုက်ဆုံး', noItems: 'items မရှိသေးပါ', noItemsDesc: 'တစ်ခုခုဖန်တီးပြီးသိမ်းပါက ဤနေရာတွင်တွေ့ရမည်', localStorage: 'စက်တွင်းသိုလှောင်မှု', cloudStorage: 'Cloud သိုလှောင်မှု', connectSync: 'ချိတ်ဆက် & ထပ်တူ', filters: { all: 'အားလုံး', images: 'ပုံများ', text: 'စာသား', website: 'ဝက်ဘ်ဆိုက်', audio: 'အသံ' }, sections: { images: '🖼️ ပုံများ', docs: '📄 စာရွက်စာတမ်း & အခြား' }, share: { title: 'မျှဝေ', via: 'မျှဝေမည့်နည်းလမ်း', deleteFromLib: 'စာကြည့်တိုက်မှဖျက်' }, cloud: { ...en.library.cloud, upgrade: 'အဆင့်မြှင့်', soon: 'မကြာမီ' }, alerts: { ...en.library.alerts, savedToRoll: '✅ Camera Roll သို့သိမ်းပြီး', deleteTitle: 'ဖျက်', rnaiUpgrade: 'အဆင့်မြှင့်', rnaiLater: 'နောက်မှ', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'ဉာဏ်ရည်ဗဟိုဌာန', title: 'AI Manager', activeLabel: 'အသက်ဝင်', tabs: { models: 'AI မော်ဒယ်များ', wallet: 'ပိုက်ဆံအိတ်' }, soonBadge: 'မကြာမီ', activeModel: 'အသက်ဝင်မော်ဒယ်', quickChat: 'အမြန်ချတ်', chatPlaceholder: 'ဘာမဆိုမေးပါ...', send: 'ပို့', thinking: 'စဉ်းစားနေသည်...', modelStatus: { connect: 'LAN ချိတ်ဆက်', featured: '⭐ အကြံပြု', available: 'ရရှိနိုင်' }, modelDownload: 'ဒေါင်းလုဒ်', modelConnected: 'ချိတ်ဆက်ပြီး', wallet: { ...en.aiManager.wallet, title: 'ဒစ်ဂျစ်တယ်ပိုက်ဆံအိတ်', totalBalance: 'စုစုပေါင်းလက်ကျန်', receive: 'လက်ခံ', send: 'ပို့', scan: 'စကင်', assets: 'ပိုင်ဆိုင်မှု', comingSoon: 'မကြာမီ', selfCustodialTitle: 'Self-Custodial ပိုက်ဆံအိတ်', createBtn: '✨ ပိုက်ဆံအိတ်အသစ်ဖန်တီး', addressCopied: 'လိပ်စာကူးယူပြီး' }, legal: 'Self-Custodial: သင့် Private Key ကို သင်ကိုယ်တိုင်တာဝန်ယူရပါမည်။ ဤအက်ပ်သည် ငွေလဲလှယ်ခြင်း သို့မဟုတ် အပ်နှံခြင်းဝန်ဆောင်မှုမပေးပါ။' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<LangCode, Translations> = {
  th, en, ja, zh, ko, fr, de, es,
  id, ms, vi, fil, km, lo, my,
};

// ─────────────────────────────────────────────────────────────────────────────
// Skills surfaced in v2.0 (audio-stt, text-extract) — merged into every language
// ─────────────────────────────────────────────────────────────────────────────
type SkillStrings = { name: string; description: string; tagline: string };
const NEW_SKILLS: Record<LangCode, Record<'audio-stt' | 'text-extract', SkillStrings>> = {
  th:  { 'audio-stt': { name: 'ถอดเสียงเป็นข้อความ', description: 'แปลงไฟล์เสียงพูดเป็นข้อความอัตโนมัติ', tagline: 'เสียง → ข้อความ' }, 'text-extract': { name: 'สกัดข้อมูล', description: 'ดึงข้อมูลสำคัญจากข้อความออกมาเป็น JSON', tagline: 'ข้อความ → ข้อมูล' } },
  en:  { 'audio-stt': { name: 'Speech to Text', description: 'Transcribe spoken audio into text automatically', tagline: 'Audio → Text' }, 'text-extract': { name: 'Extract Data', description: 'Pull key information from text into structured JSON', tagline: 'Text → Data' } },
  ja:  { 'audio-stt': { name: '音声認識', description: '音声を自動でテキストに書き起こし', tagline: '音声 → テキスト' }, 'text-extract': { name: 'データ抽出', description: 'テキストから重要情報をJSONで抽出', tagline: 'テキスト → データ' } },
  zh:  { 'audio-stt': { name: '语音转文字', description: '自动将语音转换为文字', tagline: '语音 → 文字' }, 'text-extract': { name: '数据提取', description: '从文本中提取关键信息为 JSON', tagline: '文本 → 数据' } },
  ko:  { 'audio-stt': { name: '음성 인식', description: '음성을 자동으로 텍스트로 변환', tagline: '음성 → 텍스트' }, 'text-extract': { name: '데이터 추출', description: '텍스트에서 핵심 정보를 JSON으로 추출', tagline: '텍스트 → 데이터' } },
  fr:  { 'audio-stt': { name: 'Parole en texte', description: "Transcrivez automatiquement l'audio en texte", tagline: 'Audio → Texte' }, 'text-extract': { name: 'Extraire des données', description: 'Extraire les infos clés du texte en JSON', tagline: 'Texte → Données' } },
  de:  { 'audio-stt': { name: 'Sprache zu Text', description: 'Gesprochenes automatisch in Text umwandeln', tagline: 'Audio → Text' }, 'text-extract': { name: 'Daten extrahieren', description: 'Schlüsselinfos aus Text als JSON extrahieren', tagline: 'Text → Daten' } },
  es:  { 'audio-stt': { name: 'Voz a texto', description: 'Transcribe audio hablado a texto automáticamente', tagline: 'Audio → Texto' }, 'text-extract': { name: 'Extraer datos', description: 'Extrae información clave del texto en JSON', tagline: 'Texto → Datos' } },
  id:  { 'audio-stt': { name: 'Suara ke Teks', description: 'Transkripsi audio ucapan menjadi teks otomatis', tagline: 'Audio → Teks' }, 'text-extract': { name: 'Ekstrak Data', description: 'Tarik informasi penting dari teks menjadi JSON', tagline: 'Teks → Data' } },
  ms:  { 'audio-stt': { name: 'Suara ke Teks', description: 'Transkrip audio pertuturan kepada teks secara automatik', tagline: 'Audio → Teks' }, 'text-extract': { name: 'Ekstrak Data', description: 'Tarik maklumat penting daripada teks ke JSON', tagline: 'Teks → Data' } },
  vi:  { 'audio-stt': { name: 'Giọng nói thành văn bản', description: 'Tự động chuyển âm thanh giọng nói thành văn bản', tagline: 'Âm thanh → Văn bản' }, 'text-extract': { name: 'Trích xuất dữ liệu', description: 'Trích thông tin chính từ văn bản thành JSON', tagline: 'Văn bản → Dữ liệu' } },
  fil: { 'audio-stt': { name: 'Boses sa Teksto', description: 'Awtomatikong i-transcribe ang audio sa teksto', tagline: 'Audio → Teksto' }, 'text-extract': { name: 'Kunin ang Data', description: 'Kunin ang mahalagang impormasyon mula sa teksto bilang JSON', tagline: 'Teksto → Data' } },
  km:  { 'audio-stt': { name: 'សំឡេងទៅអត្ថបទ', description: 'បម្លែងសំឡេងនិយាយទៅជាអត្ថបទដោយស្វ័យប្រវត្តិ', tagline: 'សំឡេង → អត្ថបទ' }, 'text-extract': { name: 'ស្រង់ទិន្នន័យ', description: 'ទាញព័ត៌មានសំខាន់ពីអត្ថបទជា JSON', tagline: 'អត្ថបទ → ទិន្នន័យ' } },
  lo:  { 'audio-stt': { name: 'ສຽງເປັນຂໍ້ຄວາມ', description: 'ຖອດສຽງເວົ້າເປັນຂໍ້ຄວາມອັດຕະໂນມັດ', tagline: 'ສຽງ → ຂໍ້ຄວາມ' }, 'text-extract': { name: 'ສະກັດຂໍ້ມູນ', description: 'ດຶງຂໍ້ມູນສຳຄັນຈາກຂໍ້ຄວາມເປັນ JSON', tagline: 'ຂໍ້ຄວາມ → ຂໍ້ມູນ' } },
  my:  { 'audio-stt': { name: 'အသံမှစာသား', description: 'ပြောသံကို စာသားအဖြစ် အလိုအလျောက်ပြောင်း', tagline: 'အသံ → စာသား' }, 'text-extract': { name: 'ဒေတာထုတ်ယူ', description: 'စာသားမှ အရေးကြီးအချက်အလက်များကို JSON အဖြစ်ထုတ်', tagline: 'စာသား → ဒေတာ' } },
};
for (const code of Object.keys(TRANSLATIONS) as LangCode[]) {
  Object.assign(TRANSLATIONS[code].skills, NEW_SKILLS[code]);
}

// Display order: Thai & English first, then the ASEAN languages, then the rest.
const LANGUAGE_ORDER: LangCode[] = [
  'th', 'en',
  'id', 'ms', 'vi', 'fil', 'km', 'lo', 'my',
  'ja', 'zh', 'ko', 'fr', 'de', 'es',
];

export const LANGUAGE_META: { code: LangCode; label: string; name: string; flag: string }[] =
  LANGUAGE_ORDER.map((code) => ({ code, ...LANGUAGES_MAP[code] }));
