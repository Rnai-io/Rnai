/**
 * Rnai — Legal content (Privacy Policy & Terms of Service)
 *
 * The authoritative versions are Thai (th) and English (en). For every other
 * supported language the screen shows the English body together with a short,
 * localized notice that the official text is available in Thai/English — this
 * avoids shipping machine-translated, unreviewed legal text in 13 languages.
 *
 * NOTE FOR THE TEAM: this is a developer-drafted template that reflects the
 * app's actual data flows as of v2.0. Have it reviewed by counsel before
 * relying on it for compliance (PDPA/GDPR/App Store/Play).
 */

import { LangCode } from '../i18n';

export type LegalDoc = 'privacy' | 'terms';

export interface LegalSection {
  heading: string;
  body: string;
}

export const LEGAL_VERSION = '2.0';
export const LEGAL_LAST_UPDATED = '2026-06-17';
export const LEGAL_CONTACT = 'naiguitarfolk@gmail.com';
export const LEGAL_ONLINE = {
  privacy: 'https://rnai-io.vercel.app/privacy',
  terms: 'https://rnai-io.vercel.app/terms',
};

// ── Localized UI chrome (works in all 15 app languages) ──────────────────────

interface LegalUI {
  legal: string;
  privacy: string;
  terms: string;
  lastUpdated: string;
  version: string;
  viewOnline: string;
  /** Shown above the English body in non-TH/EN languages. */
  translationNotice: string;
}

const EN_UI: LegalUI = {
  legal: 'Legal',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  lastUpdated: 'Last updated',
  version: 'Version',
  viewOnline: 'View online',
  translationNotice:
    'The official Privacy Policy and Terms are published in Thai and English. The text below is the English version, shown for your convenience.',
};

export const LEGAL_UI: Record<LangCode, LegalUI> = {
  th: {
    legal: 'ข้อกฎหมาย',
    privacy: 'นโยบายความเป็นส่วนตัว',
    terms: 'ข้อกำหนดการใช้งาน',
    lastUpdated: 'อัปเดตล่าสุด',
    version: 'เวอร์ชั่น',
    viewOnline: 'ดูบนเว็บ',
    translationNotice: '',
  },
  en: EN_UI,
  ja: { ...EN_UI, legal: '法的情報', privacy: 'プライバシーポリシー', terms: '利用規約', lastUpdated: '最終更新', version: 'バージョン', viewOnline: 'オンラインで見る',
    translationNotice: '公式のプライバシーポリシーと利用規約はタイ語と英語で公開されています。以下は参考用の英語版です。' },
  zh: { ...EN_UI, legal: '法律', privacy: '隐私政策', terms: '服务条款', lastUpdated: '最近更新', version: '版本', viewOnline: '在线查看',
    translationNotice: '官方隐私政策和服务条款以泰语和英语发布。以下为英文版本，仅供参考。' },
  ko: { ...EN_UI, legal: '법적 고지', privacy: '개인정보처리방침', terms: '이용약관', lastUpdated: '마지막 업데이트', version: '버전', viewOnline: '온라인으로 보기',
    translationNotice: '공식 개인정보처리방침과 이용약관은 태국어와 영어로 제공됩니다. 아래는 참고용 영어 버전입니다.' },
  fr: { ...EN_UI, legal: 'Mentions légales', privacy: 'Politique de confidentialité', terms: "Conditions d'utilisation", lastUpdated: 'Dernière mise à jour', version: 'Version', viewOnline: 'Voir en ligne',
    translationNotice: 'La politique de confidentialité et les conditions officielles sont publiées en thaï et en anglais. Le texte ci-dessous est la version anglaise, fournie à titre indicatif.' },
  de: { ...EN_UI, legal: 'Rechtliches', privacy: 'Datenschutzrichtlinie', terms: 'Nutzungsbedingungen', lastUpdated: 'Zuletzt aktualisiert', version: 'Version', viewOnline: 'Online ansehen',
    translationNotice: 'Die offizielle Datenschutzrichtlinie und die Nutzungsbedingungen werden auf Thailändisch und Englisch veröffentlicht. Der folgende Text ist die englische Version.' },
  es: { ...EN_UI, legal: 'Legal', privacy: 'Política de privacidad', terms: 'Términos del servicio', lastUpdated: 'Última actualización', version: 'Versión', viewOnline: 'Ver en línea',
    translationNotice: 'La Política de privacidad y los Términos oficiales se publican en tailandés e inglés. El texto siguiente es la versión en inglés, mostrada para su comodidad.' },
  id: { ...EN_UI, legal: 'Hukum', privacy: 'Kebijakan Privasi', terms: 'Ketentuan Layanan', lastUpdated: 'Terakhir diperbarui', version: 'Versi', viewOnline: 'Lihat online',
    translationNotice: 'Kebijakan Privasi dan Ketentuan resmi diterbitkan dalam bahasa Thai dan Inggris. Teks di bawah ini adalah versi bahasa Inggris.' },
  ms: { ...EN_UI, legal: 'Undang-undang', privacy: 'Dasar Privasi', terms: 'Terma Perkhidmatan', lastUpdated: 'Kemas kini terakhir', version: 'Versi', viewOnline: 'Lihat dalam talian',
    translationNotice: 'Dasar Privasi dan Terma rasmi diterbitkan dalam bahasa Thai dan Inggeris. Teks di bawah ialah versi bahasa Inggeris.' },
  vi: { ...EN_UI, legal: 'Pháp lý', privacy: 'Chính sách bảo mật', terms: 'Điều khoản dịch vụ', lastUpdated: 'Cập nhật lần cuối', version: 'Phiên bản', viewOnline: 'Xem trực tuyến',
    translationNotice: 'Chính sách bảo mật và Điều khoản chính thức được công bố bằng tiếng Thái và tiếng Anh. Văn bản dưới đây là bản tiếng Anh, hiển thị để bạn tiện theo dõi.' },
  fil: { ...EN_UI, legal: 'Legal', privacy: 'Patakaran sa Privacy', terms: 'Mga Tuntunin ng Serbisyo', lastUpdated: 'Huling na-update', version: 'Bersyon', viewOnline: 'Tingnan online',
    translationNotice: 'Ang opisyal na Patakaran sa Privacy at Mga Tuntunin ay nakalathala sa Thai at Ingles. Ang teksto sa ibaba ay ang bersyong Ingles.' },
  km: { ...EN_UI, legal: 'ផ្លូវច្បាប់', privacy: 'គោលការណ៍ឯកជនភាព', terms: 'លក្ខខណ្ឌសេវាកម្ម', lastUpdated: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ', version: 'កំណែ', viewOnline: 'មើលលើបណ្តាញ',
    translationNotice: 'គោលការណ៍ឯកជនភាព និងលក្ខខណ្ឌផ្លូវការត្រូវបានផ្សព្វផ្សាយជាភាសាថៃ និងអង់គ្លេស។ អត្ថបទខាងក្រោមជាកំណែភាសាអង់គ្លេស។' },
  lo: { ...EN_UI, legal: 'ກົດໝາຍ', privacy: 'ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ', terms: 'ຂໍ້ກຳນົດການບໍລິການ', lastUpdated: 'ອັບເດດຫຼ້າສຸດ', version: 'ເວີຊັນ', viewOnline: 'ເບິ່ງອອນລາຍ',
    translationNotice: 'ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ ແລະຂໍ້ກຳນົດທາງການ ຖືກເຜີຍແຜ່ເປັນພາສາໄທ ແລະອັງກິດ. ຂໍ້ຄວາມລຸ່ມນີ້ແມ່ນສະບັບພາສາອັງກິດ.' },
  my: { ...EN_UI, legal: 'ဥပဒေ', privacy: 'ကိုယ်ရေးကိုယ်တာမူဝါဒ', terms: 'ဝန်ဆောင်မှုစည်းကမ်း', lastUpdated: 'နောက်ဆုံးအပ်ဒိတ်', version: 'ဗားရှင်း', viewOnline: 'အွန်လိုင်းတွင်ကြည့်ရန်',
    translationNotice: 'တရားဝင်ကိုယ်ရေးကိုယ်တာမူဝါဒနှင့်စည်းကမ်းများကို ထိုင်းနှင့်အင်္ဂလိပ်ဘာသာဖြင့်ထုတ်ပြန်ထားသည်။ အောက်ပါစာသားသည် အင်္ဂလိပ်ဗားရှင်းဖြစ်သည်။' },
};

// ── Privacy Policy ───────────────────────────────────────────────────────────

const PRIVACY_EN: LegalSection[] = [
  { heading: '1. Who we are',
    body: 'Rnai ("Rnai", "we", "us") provides an AI creation app for iOS and Android. This Privacy Policy explains what we collect, why, and the choices you have. Questions? Contact ' + LEGAL_CONTACT + '.' },
  { heading: '2. Information we collect',
    body: '• Account: your email address and authentication tokens, handled via Firebase Authentication (Google) when you sign up or sign in.\n• Profile: a display name and an optional profile photo you choose. These are stored on your device and may be sent to our servers to power your account.\n• Content you create: prompts, uploaded images, and generated results. Your library is stored locally on your device by default.\n• Payments & credits: your credit balance, usage history, and TrueMoney Gift Voucher redemptions processed through our backend.\n• Your API key: if you add a personal Rnai API key it is stored securely on-device in the system keychain (Secure Store) and sent only to the Rnai backend to authorize your requests.\n• Diagnostics: basic, non-identifying technical information needed to operate the service.' },
  { heading: '3. How we use your information',
    body: 'We use your information to authenticate you, run the AI skills you request, track and display your credits, process voucher redemptions, sync optional cloud features, provide support, and keep the service secure and working.' },
  { heading: '4. AI processing & third-party providers',
    body: 'When you run a skill, your input is sent to the Rnai backend (hosted on Vercel) which forwards it to AI providers to produce a result. Depending on the skill these may include Google (Gemini), Together AI, OpenRouter, and Hugging Face. Generated images may be hosted via Cloudinary to give you a shareable link. We share only what is needed to fulfil your request and do not sell your personal data.' },
  { heading: '5. On-device & local AI (Ollama)',
    body: 'If you connect a local Ollama server over your own network, those chats run on your computer and are sent directly from the app to your server. They do not pass through Rnai servers. Local/offline use is the most private option.' },
  { heading: '6. Data storage & retention',
    body: 'Your creations are kept on your device (most recent items, capped to stay within storage limits) until you delete them. Account, credit, and transaction records are retained while your account is active and for as long as needed to meet legal, accounting, and security obligations.' },
  { heading: '7. Your choices & rights',
    body: 'You can edit your profile, remove your stored API key, clear the on-device cache, and delete your account from Profile → Account Actions. Deleting your account removes your account data subject to records we must retain by law. Depending on where you live (e.g. Thailand PDPA, EU GDPR) you may have rights to access, correct, export, or erase your data — contact ' + LEGAL_CONTACT + '.' },
  { heading: '8. Security',
    body: 'We use encryption in transit (HTTPS), the device secure keychain for your API key, and access controls on our backend. No method of transmission or storage is 100% secure, so we cannot guarantee absolute security.' },
  { heading: '9. Children',
    body: 'Rnai is not directed to children under 13 (or the minimum age required in your country). We do not knowingly collect data from children. If you believe a child has provided us data, contact us and we will remove it.' },
  { heading: '10. Changes to this policy',
    body: 'We may update this policy as the app evolves. Material changes will be reflected by the "Last updated" date and, where appropriate, an in-app notice. Continued use after an update means you accept the revised policy.' },
];

const PRIVACY_TH: LegalSection[] = [
  { heading: '1. เราคือใคร',
    body: 'Rnai ("Rnai", "เรา") ให้บริการแอปสร้างสรรค์ผลงานด้วย AI บน iOS และ Android นโยบายนี้อธิบายว่าเราเก็บข้อมูลอะไร เพราะอะไร และคุณมีทางเลือกใดบ้าง หากมีคำถามติดต่อ ' + LEGAL_CONTACT },
  { heading: '2. ข้อมูลที่เราเก็บ',
    body: '• บัญชี: อีเมลและโทเค็นการยืนยันตัวตน จัดการผ่าน Firebase Authentication (Google) เมื่อคุณสมัครหรือเข้าสู่ระบบ\n• โปรไฟล์: ชื่อที่แสดงและรูปโปรไฟล์ (ถ้ามี) ที่คุณเลือก เก็บไว้บนอุปกรณ์ของคุณ และอาจส่งไปยังเซิร์ฟเวอร์เพื่อใช้งานบัญชี\n• ผลงานที่คุณสร้าง: คำสั่ง (prompt) รูปที่อัปโหลด และผลลัพธ์ โดยปกติคลังผลงานจะเก็บไว้บนอุปกรณ์ของคุณ\n• การชำระเงินและเครดิต: ยอดเครดิต ประวัติการใช้งาน และการแลก TrueMoney Gift Voucher ที่ประมวลผลผ่านระบบหลังบ้านของเรา\n• API Key ของคุณ: หากคุณเพิ่มคีย์ส่วนตัว จะถูกเก็บอย่างปลอดภัยบนอุปกรณ์ในที่เก็บกุญแจของระบบ (Secure Store) และส่งเฉพาะไปยังระบบหลังบ้าน Rnai เพื่ออนุญาตคำขอของคุณ\n• ข้อมูลวิเคราะห์ระบบ: ข้อมูลทางเทคนิคพื้นฐานที่ไม่ระบุตัวตน ซึ่งจำเป็นต่อการให้บริการ' },
  { heading: '3. เราใช้ข้อมูลอย่างไร',
    body: 'เราใช้ข้อมูลเพื่อยืนยันตัวตน เรียกใช้สกิล AI ตามที่คุณสั่ง คำนวณและแสดงเครดิต ประมวลผลการแลกโค้ด ซิงค์ฟีเจอร์คลาวด์ (ถ้าเปิดใช้) ให้การสนับสนุน และรักษาความปลอดภัยของบริการ' },
  { heading: '4. การประมวลผล AI และผู้ให้บริการภายนอก',
    body: 'เมื่อคุณเรียกใช้สกิล ข้อมูลนำเข้าของคุณจะถูกส่งไปยังระบบหลังบ้าน Rnai (โฮสต์บน Vercel) ซึ่งส่งต่อไปยังผู้ให้บริการ AI เพื่อสร้างผลลัพธ์ ขึ้นกับสกิลอาจรวมถึง Google (Gemini), Together AI, OpenRouter และ Hugging Face รูปที่สร้างอาจโฮสต์ผ่าน Cloudinary เพื่อให้คุณได้ลิงก์แชร์ เราแบ่งปันเฉพาะข้อมูลที่จำเป็นและไม่ขายข้อมูลส่วนบุคคลของคุณ' },
  { heading: '5. AI บนอุปกรณ์และในเครื่อง (Ollama)',
    body: 'หากคุณเชื่อมต่อเซิร์ฟเวอร์ Ollama ในเครือข่ายของคุณเอง แชทเหล่านั้นจะทำงานบนคอมพิวเตอร์ของคุณและส่งตรงจากแอปไปยังเซิร์ฟเวอร์ของคุณ โดยไม่ผ่านเซิร์ฟเวอร์ Rnai การใช้งานในเครื่อง/ออฟไลน์เป็นทางเลือกที่เป็นส่วนตัวที่สุด' },
  { heading: '6. การจัดเก็บและระยะเวลาเก็บข้อมูล',
    body: 'ผลงานของคุณจะถูกเก็บบนอุปกรณ์ (รายการล่าสุด จำกัดจำนวนเพื่อไม่ให้เกินพื้นที่จัดเก็บ) จนกว่าคุณจะลบ ส่วนข้อมูลบัญชี เครดิต และธุรกรรมจะถูกเก็บไว้ตลอดที่บัญชียังใช้งานและเท่าที่จำเป็นตามกฎหมาย การบัญชี และความปลอดภัย' },
  { heading: '7. ทางเลือกและสิทธิ์ของคุณ',
    body: 'คุณสามารถแก้ไขโปรไฟล์ ลบ API Key ที่เก็บไว้ ล้างแคชบนอุปกรณ์ และลบบัญชีได้ที่ โปรไฟล์ → การจัดการบัญชี การลบบัญชีจะลบข้อมูลบัญชีของคุณ เว้นแต่ข้อมูลที่เราต้องเก็บตามกฎหมาย ทั้งนี้ตามถิ่นที่อยู่ของคุณ (เช่น PDPA ของไทย, GDPR ของสหภาพยุโรป) คุณอาจมีสิทธิ์เข้าถึง แก้ไข ส่งออก หรือลบข้อมูล ติดต่อ ' + LEGAL_CONTACT },
  { heading: '8. ความปลอดภัย',
    body: 'เราใช้การเข้ารหัสระหว่างส่งข้อมูล (HTTPS) ที่เก็บกุญแจปลอดภัยของอุปกรณ์สำหรับ API Key และการควบคุมการเข้าถึงในระบบหลังบ้าน อย่างไรก็ตามไม่มีวิธีใดปลอดภัย 100% เราจึงไม่สามารถรับประกันความปลอดภัยอย่างสมบูรณ์ได้' },
  { heading: '9. เด็กและเยาวชน',
    body: 'Rnai ไม่ได้มุ่งเป้าไปยังเด็กอายุต่ำกว่า 13 ปี (หรืออายุขั้นต่ำตามที่ประเทศของคุณกำหนด) เราไม่เก็บข้อมูลจากเด็กโดยเจตนา หากคุณเชื่อว่ามีเด็กให้ข้อมูลกับเรา โปรดติดต่อเพื่อให้เราลบออก' },
  { heading: '10. การเปลี่ยนแปลงนโยบาย',
    body: 'เราอาจปรับปรุงนโยบายนี้เมื่อแอปพัฒนาขึ้น การเปลี่ยนแปลงที่สำคัญจะสะท้อนผ่านวันที่ "อัปเดตล่าสุด" และการแจ้งเตือนในแอปตามความเหมาะสม การใช้งานต่อหลังการอัปเดตถือว่าคุณยอมรับนโยบายฉบับแก้ไข' },
];

// ── Terms of Service ─────────────────────────────────────────────────────────

const TERMS_EN: LegalSection[] = [
  { heading: '1. Acceptance',
    body: 'By using the Rnai app you agree to these Terms. If you do not agree, please do not use the app. You must be old enough to form a binding agreement in your country.' },
  { heading: '2. Your account',
    body: 'You are responsible for activity under your account and for keeping your sign-in and any API key confidential. Provide accurate information and let us know of any unauthorized use.' },
  { heading: '3. Credits & payments',
    body: 'AI features consume credits. Credits and TrueMoney Gift Voucher redemptions are processed through our backend. Credits have no cash value, are non-transferable, and consumed credits are generally non-refundable except where required by law. Voucher availability and rates may change.' },
  { heading: '4. Acceptable use',
    body: 'Do not use Rnai to break the law, infringe others’ rights, generate sexual content involving minors, create malware, harass or deceive others, or attempt to disrupt or reverse-engineer the service. You are responsible for the prompts you enter and the content you generate.' },
  { heading: '5. AI output',
    body: 'AI output can be inaccurate, biased, or unintentionally similar to existing material. It is provided "as is" without warranty. Review and verify output before relying on it, and ensure your use complies with applicable laws and the terms of the underlying AI providers.' },
  { heading: '6. Content & ownership',
    body: 'You retain your rights in the inputs you provide. Subject to these Terms and the underlying providers’ terms, you may use the content you generate. You grant us the limited rights needed to process your requests and operate the service.' },
  { heading: '7. Digital wallet (self-custodial)',
    body: 'Any wallet feature is self-custodial: you alone control your private key. Rnai does not hold your funds and is not an exchange, custodian, or financial institution. You are solely responsible for safeguarding your keys and for your transactions. Nothing in the app is financial advice.' },
  { heading: '8. Third-party services',
    body: 'The app relies on third parties (e.g. Firebase, Vercel, AI model providers, Cloudinary, TrueMoney, and Ollama for local use). Your use of those services may also be governed by their own terms, and we are not responsible for them.' },
  { heading: '9. Service availability',
    body: 'We may change, suspend, or discontinue features at any time. Some skills or models may be in preview, limited, or dependent on external providers and may not always be available.' },
  { heading: '10. Disclaimers & limitation of liability',
    body: 'The app is provided "as is" and "as available" without warranties of any kind. To the maximum extent permitted by law, Rnai is not liable for indirect, incidental, or consequential damages, or for loss of data, profits, or content arising from your use of the app.' },
  { heading: '11. Termination',
    body: 'You may stop using the app at any time and delete your account. We may suspend or terminate access if you breach these Terms or to protect the service and its users.' },
  { heading: '12. Governing law & changes',
    body: 'These Terms are governed by the laws of Thailand, without regard to conflict-of-laws rules. We may update these Terms; the "Last updated" date shows the latest version, and continued use means you accept the changes. Questions? Contact ' + LEGAL_CONTACT + '.' },
];

const TERMS_TH: LegalSection[] = [
  { heading: '1. การยอมรับเงื่อนไข',
    body: 'การใช้แอป Rnai ถือว่าคุณยอมรับข้อกำหนดเหล่านี้ หากไม่ยอมรับโปรดงดใช้งาน คุณต้องมีอายุเพียงพอที่จะทำข้อตกลงที่มีผลผูกพันตามกฎหมายในประเทศของคุณ' },
  { heading: '2. บัญชีของคุณ',
    body: 'คุณรับผิดชอบกิจกรรมภายใต้บัญชีของคุณ และต้องรักษาข้อมูลการเข้าสู่ระบบและ API Key ให้เป็นความลับ กรุณาให้ข้อมูลที่ถูกต้องและแจ้งเราหากพบการใช้งานโดยไม่ได้รับอนุญาต' },
  { heading: '3. เครดิตและการชำระเงิน',
    body: 'ฟีเจอร์ AI ใช้เครดิต เครดิตและการแลก TrueMoney Gift Voucher ประมวลผลผ่านระบบหลังบ้านของเรา เครดิตไม่มีมูลค่าเป็นเงินสด โอนให้ผู้อื่นไม่ได้ และเครดิตที่ใช้ไปแล้วโดยทั่วไปไม่สามารถขอคืนได้ ยกเว้นที่กฎหมายกำหนด อัตราและความพร้อมของโค้ดอาจเปลี่ยนแปลงได้' },
  { heading: '4. การใช้งานที่ยอมรับได้',
    body: 'ห้ามใช้ Rnai เพื่อกระทำผิดกฎหมาย ละเมิดสิทธิ์ผู้อื่น สร้างเนื้อหาทางเพศที่เกี่ยวข้องกับผู้เยาว์ สร้างมัลแวร์ คุกคามหรือหลอกลวงผู้อื่น หรือพยายามรบกวนหรือทำวิศวกรรมย้อนกลับบริการ คุณรับผิดชอบคำสั่ง (prompt) ที่ป้อนและเนื้อหาที่สร้างขึ้น' },
  { heading: '5. ผลลัพธ์จาก AI',
    body: 'ผลลัพธ์จาก AI อาจไม่ถูกต้อง มีอคติ หรือคล้ายกับผลงานที่มีอยู่โดยไม่ตั้งใจ ให้บริการ "ตามสภาพ" โดยไม่มีการรับประกัน โปรดตรวจสอบผลลัพธ์ก่อนนำไปใช้ และต้องแน่ใจว่าการใช้งานของคุณเป็นไปตามกฎหมายและเงื่อนไขของผู้ให้บริการ AI ที่เกี่ยวข้อง' },
  { heading: '6. เนื้อหาและความเป็นเจ้าของ',
    body: 'คุณยังคงสิทธิ์ในข้อมูลนำเข้าที่คุณให้ ภายใต้ข้อกำหนดเหล่านี้และเงื่อนไขของผู้ให้บริการ คุณสามารถใช้เนื้อหาที่คุณสร้างได้ และคุณให้สิทธิ์เราเท่าที่จำเป็นในการประมวลผลคำขอและให้บริการ' },
  { heading: '7. กระเป๋าเงินดิจิทัล (Self-Custodial)',
    body: 'ฟีเจอร์กระเป๋าเงินใดๆ เป็นแบบ self-custodial คุณเป็นผู้ควบคุม Private Key เพียงผู้เดียว Rnai ไม่ถือครองเงินของคุณ และไม่ใช่ผู้ให้บริการแลกเปลี่ยน ผู้รับฝาก หรือสถาบันการเงิน คุณรับผิดชอบการเก็บรักษากุญแจและธุรกรรมของคุณทั้งหมด ข้อมูลในแอปไม่ใช่คำแนะนำทางการเงิน' },
  { heading: '8. บริการของบุคคลที่สาม',
    body: 'แอปนี้พึ่งพาบุคคลที่สาม (เช่น Firebase, Vercel, ผู้ให้บริการโมเดล AI, Cloudinary, TrueMoney และ Ollama สำหรับการใช้งานในเครื่อง) การใช้บริการเหล่านั้นอาจอยู่ภายใต้เงื่อนไขของผู้ให้บริการเอง และเราไม่รับผิดชอบต่อบริการเหล่านั้น' },
  { heading: '9. ความพร้อมของบริการ',
    body: 'เราอาจเปลี่ยนแปลง ระงับ หรือยุติฟีเจอร์ได้ทุกเมื่อ บางสกิลหรือบางโมเดลอาจอยู่ในช่วงทดลอง มีข้อจำกัด หรือขึ้นกับผู้ให้บริการภายนอก และอาจไม่พร้อมใช้งานเสมอไป' },
  { heading: '10. ข้อจำกัดความรับผิด',
    body: 'แอปให้บริการ "ตามสภาพ" และ "ตามที่มี" โดยไม่มีการรับประกันใดๆ เท่าที่กฎหมายอนุญาตสูงสุด Rnai ไม่รับผิดต่อความเสียหายทางอ้อม ความเสียหายโดยบังเอิญหรือต่อเนื่อง หรือการสูญเสียข้อมูล กำไร หรือเนื้อหาที่เกิดจากการใช้งานแอป' },
  { heading: '11. การยุติการใช้งาน',
    body: 'คุณสามารถหยุดใช้แอปและลบบัญชีได้ทุกเมื่อ เราอาจระงับหรือยุติการเข้าถึงหากคุณละเมิดข้อกำหนดเหล่านี้ หรือเพื่อปกป้องบริการและผู้ใช้' },
  { heading: '12. กฎหมายที่ใช้บังคับและการเปลี่ยนแปลง',
    body: 'ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายของประเทศไทย เราอาจปรับปรุงข้อกำหนด วันที่ "อัปเดตล่าสุด" แสดงเวอร์ชันล่าสุด และการใช้งานต่อถือว่าคุณยอมรับการเปลี่ยนแปลง หากมีคำถามติดต่อ ' + LEGAL_CONTACT },
];

// ── Resolver ─────────────────────────────────────────────────────────────────

export interface ResolvedLegal {
  sections: LegalSection[];
  /** Localized notice shown when the body is not in the user's language. */
  notice: string;
  ui: LegalUI;
}

/** Get the document body + UI labels for the active language. */
export function getLegal(doc: LegalDoc, lang: LangCode): ResolvedLegal {
  const ui = LEGAL_UI[lang] ?? EN_UI;
  if (lang === 'th') {
    return { sections: doc === 'privacy' ? PRIVACY_TH : TERMS_TH, notice: '', ui };
  }
  if (lang === 'en') {
    return { sections: doc === 'privacy' ? PRIVACY_EN : TERMS_EN, notice: '', ui };
  }
  // All other languages → authoritative English body + localized notice.
  return {
    sections: doc === 'privacy' ? PRIVACY_EN : TERMS_EN,
    notice: ui.translationNotice,
    ui,
  };
}
