/**
 * Rnai.io — Internationalization (i18n)
 * Supported: th, en, ja, zh, ko, fr, de, es
 */

export type LangCode = 'th' | 'en' | 'ja' | 'zh' | 'ko' | 'fr' | 'de' | 'es';

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
    };
    legal: string;
  };
}

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
    'website-gen':  { name: 'สร้างเว็บไซต์',         description: 'สร้างเว็บไซต์สวยงามด้วย AI',           tagline: 'สร้างด้วย AI' },
    'audio-tts':    { name: 'แปลงข้อความเป็นเสียง', description: 'แปลงข้อความเป็นเสียงพูดที่เป็นธรรมชาติ', tagline: 'เสียงพูดธรรมชาติ' },
  },
  languages: {
    th: { label: 'ภาษาไทย',  name: 'Thai',     flag: '🇹🇭' },
    en: { label: 'English',  name: 'English',  flag: '🇺🇸' },
    ja: { label: '日本語',    name: 'Japanese', flag: '🇯🇵' },
    zh: { label: '中文',      name: 'Chinese',  flag: '🇨🇳' },
    ko: { label: '한국어',    name: 'Korean',   flag: '🇰🇷' },
    fr: { label: 'Français', name: 'French',   flag: '🇫🇷' },
    de: { label: 'Deutsch',  name: 'German',   flag: '🇩🇪' },
    es: { label: 'Español',  name: 'Spanish',  flag: '🇪🇸' },
  },
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
    'website-gen':  { name: 'Generate Website',     description: 'Build beautiful websites with AI',                 tagline: 'Build with AI' },
    'audio-tts':    { name: 'Text to Speech',       description: 'Convert text to natural-sounding audio',           tagline: 'Natural Voice' },
  },
  languages: {
    th: { label: 'ภาษาไทย',  name: 'Thai',     flag: '🇹🇭' },
    en: { label: 'English',  name: 'English',  flag: '🇺🇸' },
    ja: { label: '日本語',    name: 'Japanese', flag: '🇯🇵' },
    zh: { label: '中文',      name: 'Chinese',  flag: '🇨🇳' },
    ko: { label: '한국어',    name: 'Korean',   flag: '🇰🇷' },
    fr: { label: 'Français', name: 'French',   flag: '🇫🇷' },
    de: { label: 'Deutsch',  name: 'German',   flag: '🇩🇪' },
    es: { label: 'Español',  name: 'Spanish',  flag: '🇪🇸' },
  },
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
  },
  languages: en.languages,
  library: { ...en.library, subtitle: 'Mi espacio', title: 'Biblioteca', items: 'elementos', favorites: 'Favoritos', noItems: 'Sin elementos', noItemsDesc: 'Crea algo y guárdalo para verlo aquí', localStorage: 'Almacenamiento local', cloudStorage: 'Almacenamiento en la nube', connectSync: 'Conectar y sincronizar', filters: { all: 'Todo', images: 'Imágenes', text: 'Texto', website: 'Sitio web', audio: 'Audio' }, sections: { images: '🖼️ Imágenes', docs: '📄 Documentos y más' }, share: { title: 'Compartir', via: 'Compartir vía', deleteFromLib: 'Eliminar de la biblioteca' }, cloud: { ...en.library.cloud, upgrade: 'Mejorar', soon: 'Próximamente' }, alerts: { ...en.library.alerts, savedToRoll: '✅ Guardado en el carrete', deleteTitle: 'Eliminar', rnaiUpgrade: 'Mejorar', rnaiLater: 'Después', comingOk: 'OK' } },
  aiManager: { ...en.aiManager, subtitle: 'Centro de inteligencia', title: 'Gestor de IA', activeLabel: 'Activo', tabs: { models: 'Modelos IA', wallet: 'Cartera' }, soonBadge: 'PRONTO', activeModel: 'Modelo activo', quickChat: 'Chat rápido', chatPlaceholder: 'Haz una pregunta...', send: 'Enviar', thinking: 'pensando...', modelStatus: { connect: 'Conexión LAN', featured: '⭐ Destacado', available: 'Disponible' }, modelDownload: 'Descargar', modelConnected: 'Conectado', wallet: { ...en.aiManager.wallet, title: 'Cartera digital', totalBalance: 'Saldo total', receive: 'Recibir', send: 'Enviar', scan: 'Escanear', assets: 'Activos', comingSoon: 'Próximamente', selfCustodialTitle: 'Cartera autocustodiada', createBtn: '✨ Crear nueva cartera', addressCopied: 'Dirección copiada' }, legal: 'Autocustodia: Usted es responsable de su propia clave privada. Esta aplicación no ofrece servicios de intercambio o depósito.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const TRANSLATIONS: Record<LangCode, Translations> = { th, en, ja, zh, ko, fr, de, es };

export const LANGUAGE_META: { code: LangCode; label: string; name: string; flag: string }[] = [
  { code: 'th', label: 'ภาษาไทย',  name: 'Thai',     flag: '🇹🇭' },
  { code: 'en', label: 'English',  name: 'English',  flag: '🇺🇸' },
  { code: 'ja', label: '日本語',    name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', label: '中文',      name: 'Chinese',  flag: '🇨🇳' },
  { code: 'ko', label: '한국어',    name: 'Korean',   flag: '🇰🇷' },
  { code: 'fr', label: 'Français', name: 'French',   flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch',  name: 'German',   flag: '🇩🇪' },
  { code: 'es', label: 'Español',  name: 'Spanish',  flag: '🇪🇸' },
];
