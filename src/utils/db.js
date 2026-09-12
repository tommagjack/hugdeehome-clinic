import { supabase, isSupabaseConfigured } from './supabase';

// LocalStorage Keys
const KEYS = {
  SETTINGS: 'hugdee_settings',
  SERVICES: 'hugdee_services',
  ARTICLES: 'hugdee_articles',
  PROMOTIONS: 'hugdee_promotions',
  GALLERY: 'hugdee_gallery',
  TESTIMONIALS: 'hugdee_testimonials',
  FAQS: 'hugdee_faqs',
  ADMIN_SESSION: 'hugdee_admin_session',
  ADMIN_USERS: 'hugdee_admin_users',
  ASSESSMENTS: 'hugdee_assessments'
};

// Initial Mock Data
const INITIAL_SETTINGS = {
  id: 1,
  name_th: 'บ้านฮักดี คลินิกการประกอบโรคศิลปะ สาขากิจกรรมบำบัด',
  name_en: 'Hug Dee Home Clinic',
  tagline_th: 'ทุกก้าวของลูก สำคัญสำหรับเรา',
  tagline_en: 'Every step of your child matters to us',
  description_th: 'บ้านฮักดี คลินิกกิจกรรมบำบัด ให้บริการประเมิน บำบัด และส่งเสริมพัฒนาการเด็กอายุ 6 เดือน – 12 ปี โดยนักกิจกรรมบำบัดวิชาชีพ',
  description_en: 'Hug Dee Home Clinic offers sensory, pediatric developmental assessment, and therapy for children aged 6 months to 12 years by professional occupational therapists.',
  logo_url: '',
  phone: '094-675-3557',
  line_id: '@hugdeehome',
  facebook_url: 'https://www.facebook.com/hugdeehome',
  address_th: '104/7 หมู่ 17 ตำบลบ้านต๋อม อำเภอเมือง จังหวัดพะเยา 56000',
  address_en: '104/7 Moo 17, Ban Tom, Mueang, Phayao 56000',
  maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.206497121404!2d99.88794837582522!3d19.197089948834415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d8329bc019cd51%3A0xe54d9b4b0e8b4e7a!2z4Lia4LmJ4Liy4LiZ4LmA4Lin4Liq4Li04Li1IOC4hOC4peC4tOC4meC4tOC4gSDguIHguLiy4Lia4Liy4LiB4Li04LiI4LiB4Lij4Lij4LiV4Liw4Lia4Lix4LiX4LiH!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth',
  opening_hours_th: 'อังคาร - ศุกร์ 17:00 - 20:00, เสาร์ - อาทิตย์ 09:00 - 18:00 (ปิดวันจันทร์)',
  opening_hours_en: 'Tuesday - Friday 17:00 - 20:00, Saturday - Sunday 09:00 - 18:00 (Closed on Monday)',
  hero_image_url: '',
  seo_title: 'บ้านฮักดี คลินิกกิจกรรมบำบัด พะเยา | กระตุ้นพัฒนาการเด็ก',
  seo_description: 'บ้านฮักดี คลินิกกิจกรรมบำบัด พะเยา ประเมินและบำบัดพัฒนาการเด็ก โดยนักกิจกรรมบำบัดวิชาชีพ อบอุ่น เป็นกันเอง ปลอดภัยสำหรับลูกน้อย',
  assessment_title_th: 'แบบประเมินพัฒนาการเด็กเบื้องต้น',
  assessment_title_en: 'Pediatric Initial Screening',
  assessment_description_th: 'ทำแบบประเมินความพร้อมและพฤติกรรมเด็ก โดยทำเครื่องหมายติ๊กเลือกหัวข้อที่ท่านมีความกังวลเพื่อคำนวณและวิเคราะห์ผลลัพธ์',
  assessment_description_en: 'Complete the form by checking behavior concerns to calculate initial screening suggestions.',
  assessment_image_url: '',
  assessment_cta_link: '',
};

const INITIAL_SERVICES = [
  {
    id: 's1',
    title_th: 'กระตุ้นพัฒนาการเด็ก',
    title_en: 'Child Development Promotion',
    description_th: 'ส่งเสริมทักษะที่เหมาะสมกับช่วงวัย ผ่านกิจกรรมที่สนุกและเหมาะกับเด็กแต่ละคน',
    description_en: 'Promoting age-appropriate skills through fun and customized activities tailored to each child.',
    icon: 'Baby',
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 1
  },
  {
    id: 's2',
    title_th: 'กิจกรรมบำบัด',
    title_en: 'Occupational Therapy',
    description_th: 'ส่งเสริมความสามารถในการทำกิจวัตรประจำวัน การเรียนรู้ การเล่น และการมีส่วนร่วมในชีวิตประจำวัน',
    description_en: 'Enhancing independence in daily activities, learning, play, and participation in everyday life.',
    icon: 'Activity',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 2
  },
  {
    id: 's3',
    title_th: 'ประเมินพัฒนาการ',
    title_en: 'Developmental Assessment',
    description_th: 'ประเมินความสามารถและพัฒนาการของเด็ก เพื่อค้นหาจุดแข็งและด้านที่ควรส่งเสริม',
    description_en: 'Assessing capabilities and development to identify strengths and areas that require support.',
    icon: 'ClipboardCheck',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 3
  },
  {
    id: 's4',
    title_th: 'ทักษะกล้ามเนื้อมัดเล็ก',
    title_en: 'Fine Motor Skills',
    description_th: 'ส่งเสริมการใช้มือ การหยิบจับ การเขียน และการประสานสัมพันธ์ระหว่างตาและมือ',
    description_en: 'Promoting hand usage, grasping, writing, and hand-eye coordination.',
    icon: 'Hand',
    image_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 4
  },
  {
    id: 's5',
    title_th: 'ทักษะกล้ามเนื้อมัดใหญ่',
    title_en: 'Gross Motor Skills',
    description_th: 'ส่งเสริมการเคลื่อนไหว การทรงตัว และการวางแผนการเคลื่อนไหว',
    description_en: 'Promoting movement, balance, and motor planning skills.',
    icon: 'Smile',
    image_url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 5
  },
  {
    id: 's6',
    title_th: 'สมาธิและการจดจ่อ',
    title_en: 'Attention & Focus',
    description_th: 'ส่งเสริมความสามารถในการจดจ่อ ควบคุมตนเอง และทำกิจกรรมอย่างต่อเนื่อง',
    description_en: 'Enhancing concentration, self-regulation, and sustained engagement in tasks.',
    icon: 'Target',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 6
  },
  {
    id: 's7',
    title_th: 'ส่งเสริมทักษะการสื่อสาร',
    title_en: 'Communication Skills Promotion',
    description_th: 'ส่งเสริมการสื่อสารและการมีส่วนร่วมในการทำกิจกรรม',
    description_en: 'Encouraging communication and active participation during therapy sessions.',
    icon: 'MessageSquare',
    image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 7
  },
  {
    id: 's8',
    title_th: 'ทักษะด้านอารมณ์และพฤติกรรม',
    title_en: 'Emotional & Behavioral Skills',
    description_th: 'ส่งเสริมการจัดการอารมณ์ การปรับตัว และการตอบสนองต่อสถานการณ์ต่าง ๆ',
    description_en: 'Promoting emotional regulation, adaptability, and constructive behavioral responses.',
    icon: 'Heart',
    image_url: 'https://images.unsplash.com/photo-1484981138541-3d074aa97716?w=600&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 8
  }
];

const INITIAL_ARTICLES = [
  {
    id: 'a1',
    title_th: 'กิจกรรมบำบัดคืออะไร? และทำไมจึงสำคัญสำหรับเด็ก',
    title_en: 'What is Occupational Therapy? And Why is it Important for Children',
    slug: 'what-is-occupational-therapy',
    excerpt_th: 'ทำความรู้จักกับบทบาทของนักกิจกรรมบำบัดในการส่งเสริมทักษะชีวิต การเล่น และการเรียนรู้ของเด็ก ๆ',
    excerpt_en: 'Understand the role of occupational therapists in promoting life skills, play, and learning in children.',
    content_th: '## กิจกรรมบำบัด (Occupational Therapy) คืออะไร?\n\nกิจกรรมบำบัดในเด็ก คือวิชาชีพทางวิทยาศาสตร์สุขภาพที่มุ่งเน้นการประเมิน บำบัด และส่งเสริมพัฒนาการเด็กให้สามารถช่วยเหลือตัวเองและใช้ชีวิตประจำวันได้อย่างปกติสุขที่สุด โดยใช้ "กิจกรรม" เป็นสื่อกลางในการบำบัดรักษา\n\n### ขอบข่ายการดูแล\n\n1. **การช่วยเหลือตัวเอง (Self-care)**: เช่น การกินอาหาร การแต่งตัว การอาบน้ำ และการขับถ่าย\n2. **การเรียนรู้ (School/Learning)**: เช่น การจับดินสอเขียนหนังสือ การใช้กรรไกร การจดจ่อในห้องเรียน\n3. **การเล่น (Play)**: ซึ่งเป็นงานหลักของเด็กในการเรียนรู้สังคม การทรงตัว และการวางแผนการเคลื่อนไหว\n\nหากคุณพ่อคุณแม่สังเกตเห็นว่าลูกรักอาจมีความลำบากในด้านเหล่านี้ การเข้ารับการประเมินโดยนักกิจกรรมบำบัดวิชาชีพแต่เนิ่น ๆ จะช่วยส่งเสริมศักยภาพของลูกได้อย่างมีประสิทธิภาพครับ',
    content_en: '## What is Occupational Therapy (OT)?\n\nPediatric Occupational Therapy is a healthcare profession focused on assessing, treating, and promoting children\'s development so they can achieve independence in daily life. OTs use meaningful "activities" as therapeutic tools.\n\n### Areas of Focus\n\n1. **Self-care**: Eating, dressing, bathing, and toileting.\n2. **Learning**: Pencil grasp, scissors skills, and classroom attention.\n3. **Play**: The primary occupation of children to learn socialization, balance, and motor planning.\n\nIf you observe difficulties in these areas, an early assessment can greatly support your child\'s growth.',
    cover_image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60',
    category_th: 'ความรู้ทั่วไป',
    category_en: 'General Knowledge',
    author: 'กภ. พนักงานฮักดี',
    published_date: '2026-08-15',
    status: 'published'
  },
  {
    id: 'a2',
    title_th: 'พัฒนาการเด็ก 1 ขวบ ควรทำอะไรได้บ้าง? เช็คลิสต์สำหรับผู้ปกครอง',
    title_en: '1-Year-Old Developmental Checklist for Parents',
    slug: '1-year-old-developmental-checklist',
    excerpt_th: 'อายุ 1 ขวบคือช่วงวัยหัวเลี้ยวหัวต่อสำคัญ มาตรวจเช็คพัฒนาการกล้ามเนื้อ การสื่อสาร และการช่วยเหลือตัวเองเบื้องต้นกันครับ',
    excerpt_en: '1 year is a key transition age. Check your child\'s motor, communication, and self-help skills here.',
    content_th: '## พัฒนาการก้าวแรกวัย 1 ปี\n\nเด็กวัย 1 ขวบเป็นวัยแห่งการสำรวจและเริ่มต้นความเป็นอิสระ เช็คลิสต์ด้านล่างนี้คือแนวทางพัฒนาการทั่วไปที่คุณพ่อคุณแม่สามารถสังเกตและส่งเสริมได้ที่บ้าน:\n\n### 1. กล้ามเนื้อมัดใหญ่ (Gross Motor)\n* สามารถเกาะยืน หรือเหนี่ยวยึดเพื่อยืนขึ้นเองได้\n* บางคนเริ่มก้าวเดินได้ 2-3 ก้าวโดยไม่ต้องจับ\n\n### 2. กล้ามเนื้อมัดเล็ก (Fine Motor)\n* ใช้นิ้วชี้และนิ้วโป้งหยิบจับสิ่งของชิ้นเล็ก ๆ (Pincer Grasp) เช่น เมล็ดถั่วหรือขนมชิ้นเล็ก\n* ชอบใช้นิ้วชี้จิ้มสิ่งของต่าง ๆ\n\n### 3. การสื่อสารและการรับรู้ (Communication)\n* ตอบสนองต่อเสียงเรียกชื่อ\n* เลียนแบบท่าทางโบกมือบ๊ายบาย หรือตบมือ\n* เริ่มพูดคำที่มีความหมายสั้น ๆ ได้ เช่น "หม่ำ", "แม่"\n\n**คำแนะนำ**: การปล่อยให้เด็กได้สำรวจของเล่นต่างพื้นผิว ปล่อยให้หัดทานอาหารด้วยตัวเอง จะช่วยกระตุ้นประสาทสัมผัสและกล้ามเนื้อได้ดีมาก หากมีข้อกังวลเพิ่มเติม สามารถปรึกษาทางคลินิกเพื่อรับการประเมินได้ตลอดเวลาครับ',
    content_en: '## Developmental Milestones at 1 Year\n\nCheck out this brief checklist for 1-year-olds:\n\n### 1. Gross Motor\n* Stands holding onto furniture.\n* May take a few steps without support.\n\n### 2. Fine Motor\n* Pincer grasp (thumb and index finger) to pick up small objects.\n* Pokes with index finger.\n\n### 3. Communication\n* Responds to their name.\n* Waves goodbye or claps hands.\n* Says simple words like "mama" or "dada".',
    cover_image_url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=60',
    category_th: 'คู่มือพัฒนาการ',
    category_en: 'Development Guide',
    author: 'นักกิจกรรมบำบัดวิชาชีพ',
    published_date: '2026-08-20',
    status: 'published'
  },
  {
    id: 'a3',
    title_th: '5 สัญญาณเตือนด้านพัฒนาการที่ผู้ปกครองควรเริ่มสังเกต',
    title_en: '5 Developmental Warning Signs Parents Should Watch Out For',
    slug: '5-developmental-warning-signs',
    excerpt_th: 'สังเกตพฤติกรรมลูกรักเพื่อประเมินโอกาสติดขัดด้านการเคลื่อนไหว การจดจ่อ หรือการตอบรับประสาทสัมผัส',
    excerpt_en: 'Observe your child\'s behavior to assess possible issues in motor, focus, or sensory integration.',
    content_th: '## สัญญาณที่ควรได้รับการแนะนำเพิ่มเติม\n\nบางครั้งความล่าช้าของพัฒนาการอาจแสดงออกมาเป็นพฤติกรรมเล็ก ๆ น้อย ๆ ที่เรามองข้าม ต่อไปนี้คือ 5 สัญญาณสำคัญที่คุณพ่อคุณแม่ควรสังเกต:\n\n1. **ไม่สบตา หลีกเลี่ยงการสบตา**: เมื่อพูดคุย เล่น หรือเรียกชื่อ\n2. **ไม่พูด หรือสื่อสารความต้องการลำบาก**: ในวัยที่ควรเริ่มพูดเป็นคำ (1.5 - 2 ขวบขึ้นไป)\n3. **อยู่ไม่นิ่ง วิ่งวุ่นตลอดเวลา**: ไม่สามารถนั่งทำกิจกรรมสั้น ๆ หรือเล่นของเล่นได้เกิน 1-2 นาที\n4. **จับดินสอไม่กระชับ เขียนหนังสือยาก**: กล้ามเนื้อมือล้าเร็วเมื่อต้องเขียน หรือระบายสี\n5. **ไวต่อประสาทสัมผัสมากเป็นพิเศษ**: เช่น กลัวเสียงดังมากผิดปกติ, ร้องไห้โยเยเมื่อเหยียบพื้นหญ้าหรือพื้นทราย\n\n*หมายเหตุ: สัญญาณเหล่านี้ไม่ใช่การวินิจฉัยโรค แต่เป็นจุดบ่งชี้ว่าเด็กอาจได้รับประโยชน์จากการประเมินพัฒนาการอย่างละเอียดโดยนักกิจกรรมบำบัดเพื่อหาแนวทางกระตุ้นที่เหมาะสม*',
    content_en: '## 5 Key Warning Signs\n\n1. **Lack of eye contact** when interacting or playing.\n2. **Delayed speech** or difficulty communicating basic needs.\n3. **Hyperactivity / Inability to sit still** for simple activities.\n4. **Weak pencil grasp** or rapid hand fatigue.\n5. **Sensory sensitivity** (e.g. fear of common sounds, tactile aversion to sand/grass).',
    cover_image_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=60',
    category_th: 'ข้อควรระวัง',
    category_en: 'Sensory & Development',
    author: 'นักกิจกรรมบำบัดวิชาชีพ',
    published_date: '2026-08-25',
    status: 'published'
  }
];

const INITIAL_PROMOTIONS = [
  {
    id: 'p1',
    title_th: 'แพ็กเกจประเมินพัฒนาการแรกรับ (สำหรับผู้รับบริการใหม่)',
    title_en: 'First-time Intake Developmental Assessment Package',
    description_th: 'ประเมินพัฒนาการรอบด้านโดยนักกิจกรรมบำบัดวิชาชีพ พร้อมรับสมุดรายงานผลการประเมินและการให้คำปรึกษาแนวทางการกระตุ้นพัฒนาการที่บ้านฟรี',
    description_en: 'Comprehensive development assessment by licensed occupational therapists. Includes a detailed report and free home program consultation.',
    original_price: 1500,
    promotion_price: 1200,
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60',
    start_date: '2026-08-01',
    end_date: '2026-12-31',
    cta_link: '#/contact',
    status: 'active'
  },
  {
    id: 'p2',
    title_th: 'คอร์สกิจกรรมบำบัดต่อเนื่อง 10 ครั้ง ฟรี 1 ครั้ง',
    title_en: 'Continuous Therapy Package (10 Sessions + 1 Free)',
    description_th: 'ฝึกกระตุ้นพัฒนาการเฉพาะบุคคลอย่างต่อเนื่องเพื่อผลลัพธ์ที่ดีที่สุด สำหรับเด็กที่มีความต้องการส่งเสริมด้านต่าง ๆ',
    description_en: 'Structured, continuous individualized occupational therapy to achieve the best developmental outcome.',
    original_price: 8000,
    promotion_price: 7500,
    image_url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=60',
    start_date: '2026-08-01',
    end_date: '2026-10-31',
    cta_link: '#/contact',
    status: 'active'
  }
];

const INITIAL_GALLERY = [
  {
    id: 'g1',
    category: 'บรรยากาศคลินิก',
    caption_th: 'มุมต้อนรับอันอบอุ่นและเป็นกันเองสำหรับผู้ปกครองและเด็ก ๆ',
    caption_en: 'Warm and friendly welcoming area for parents and children.',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=60',
    display_order: 1,
    status: 'active'
  },
  {
    id: 'g2',
    category: 'ห้องกิจกรรม',
    caption_th: 'ห้องฝึกกิจกรรมบำบัด กว้างขวาง ปลอดภัย พร้อมอุปกรณ์รองรับพัฒนาการ',
    caption_en: 'Spacious and safe occupational therapy room with sensory equipment.',
    image_url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=60',
    display_order: 2,
    status: 'active'
  },
  {
    id: 'g3',
    category: 'อุปกรณ์และสื่อ',
    caption_th: 'ของเล่นไม้และบอร์ดเกมคัดสรรเพื่อฝึกทักษะสมองและการวางแผนการเคลื่อนไหว',
    caption_en: 'Carefully selected wooden toys and board games to boost executive function and planning.',
    image_url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=60',
    display_order: 3,
    status: 'active'
  }
];

const INITIAL_TESTIMONIALS = [
  {
    id: 't1',
    name_th: 'คุณแม่น้องพายุ',
    name_en: 'Nong Storm\'s Mother',
    content_th: 'น้องพายุเคยมีปัญหาเรื่องอยู่ไม่นิ่ง สมาธิสั้น เขียนหนังสือจับดินสอไม่ถนัด หลังจากมาฝึกที่บ้านฮักดีได้ประมาณ 3 เดือน น้องนิ่งขึ้นมาก จับดินสอเขียนหนังสือได้ดีขึ้น คุณครูที่โรงเรียนก็ชมค่ะ',
    content_en: 'Storm used to have focus issues and hand fatigue. After 3 months here, he has calmed down and writes much better. His teacher also praised his improvement.',
    image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 1
  },
  {
    id: 't2',
    name_th: 'คุณแม่น้องน้ำใส',
    name_en: 'Nong Namsai\'s Mother',
    content_th: 'คลินิกสะอาดมาก บรรยากาศเป็นกันเองเหมือนมาเล่นบ้านเพื่อน น้องน้ำใสไม่กลัวเลยค่ะ สนุกกับทุกกิจกรรม และได้ฝึกประสาทสัมผัสการทรงตัวดีมากค่ะ',
    content_en: 'The clinic is clean and cozy. Namsai wasn\'t scared at all. She enjoyed the sensory integration activities.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    status: 'active',
    display_order: 2
  }
];

const INITIAL_FAQS = [
  {
    id: 'f1',
    question_th: 'เด็กอายุเท่าไหร่สามารถเข้ารับบริการประเมินและกระตุ้นพัฒนาการได้บ้าง?',
    question_en: 'What age group of children can receive assessment and development promotion?',
    answer_th: 'บ้านฮักดี คลินิกกิจกรรมบำบัด ให้บริการประเมินและส่งเสริมพัฒนาการเด็กอายุตั้งแต่ 6 เดือน จนถึง 12 ปีบริบูรณ์ครับ',
    answer_en: 'Hug Dee Home Clinic provides services for children aged 6 months up to 12 years old.',
    category: 'ข้อมูลทั่วไป',
    status: 'active',
    display_order: 1
  },
  {
    id: 'f2',
    question_th: 'จำเป็นต้องผ่านการประเมินพัฒนาการก่อนเริ่มต้นฝึกหรือไม่?',
    question_en: 'Is a developmental assessment required before starting therapy sessions?',
    answer_th: 'จำเป็นครับ เนื่องจากเด็กแต่ละคนมีระดับความสามารถ จุดเด่น และจุดที่ควรส่งเสริมที่แตกต่างกัน การประเมินแรกรับโดยนักกิจกรรมบำบัดวิชาชีพจะช่วยออกแบบโปรแกรมการบำบัดที่เหมาะสมและตรงจุดที่สุดให้กับลูกรักครับ',
    answer_en: 'Yes. Because each child has different abilities and needs, an initial assessment by a licensed therapist is critical to tailor the program correctly.',
    category: 'ขั้นตอนการรับบริการ',
    status: 'active',
    display_order: 2
  },
  {
    id: 'f3',
    question_th: 'ควรเตรียมตัวหรือเตรียมสิ่งใดมาบ้างในวันนัดหมายประเมิน?',
    question_en: 'What should we prepare for the initial assessment appointment?',
    answer_th: 'ผู้ปกครองควรจัดเวลาว่างประมาณ 1.5 - 2 ชั่วโมง ให้เด็กรับประทานอาหารและพักผ่อนให้เพียงพอ ใส่เสื้อผ้าที่เคลื่อนไหวสะดวก (กางเกงยืด/ขาสั้น) และสามารถนำสมุดบันทึกพัฒนาการ (เล่มสีชมพู) หรือรายงานทางการแพทย์เดิมมาด้วยได้ครับ',
    answer_en: 'Please allocate 1.5-2 hours. Ensure the child is well-rested and fed. Dress them in comfortable activewear. You may bring developmental logs (pink book) or prior medical records.',
    category: 'การเตรียมตัว',
    status: 'active',
    display_order: 3
  },
  {
    id: 'f4',
    question_th: 'การฝึกแต่ละครั้งใช้เวลาเท่าไหร่?',
    question_en: 'How long does each therapy session take?',
    answer_th: 'การให้บริการประเมินแรกรับจะใช้เวลาประมาณ 60 - 90 นาที สำหรับการฝึกหรือกระตุ้นพัฒนาการรายครั้งจะใช้เวลาครั้งละ 60 นาที (ฝึกกิจกรรม 50 นาที และให้คำแนะนำผู้ปกครอง/สรุปผล 10 นาที) ครับ',
    answer_en: 'The initial assessment takes 60-90 minutes. Regular therapy sessions are 60 minutes long (50 minutes of structured activity + 10 minutes of parent consultation).',
    category: 'ข้อมูลทั่วไป',
    status: 'active',
    display_order: 4
  },
  {
    id: 'f5',
    question_th: 'ผู้ปกครองสามารถเข้ารับฟังหรือเข้าสังเกตการณ์ในห้องกิจกรรมได้หรือไม่?',
    question_en: 'Can parents join or observe inside the activity room?',
    answer_th: 'สามารถเข้าได้ครับ ทั้งนี้ขึ้นอยู่กับความเหมาะสมและดุลยพินิจของนักกิจกรรมบำบัด ในเด็กบางรายที่อาจเสียสมาธิได้ง่ายเมื่อมีผู้ปกครองอยู่ร่วมด้วย นักกิจกรรมบำบัดอาจขอความร่วมมือให้ผู้ปกครองรับชมผ่านกระจกมองด้านนอก และจะอธิบายแนวทางฝึกอย่างละเอียดในช่วง 10 นาทีท้ายของชั่วโมงครับ',
    answer_en: 'Yes. However, it depends on the therapist\'s discretion. If a child gets easily distracted, we might suggest observing through our view-glass, followed by a briefing at the end.',
    category: 'การเตรียมตัว',
    status: 'active',
    display_order: 5
  }
];

const INITIAL_ASSESSMENTS = [
  {
    id: 'c1',
    title_th: 'ไม่ค่อยพูด / สื่อสารยาก',
    title_en: 'Speech Delay / Communication Difficulty',
    short_th: 'น้องมีปฏิกิริยาตอบโต้ลดลง หรือพูดเป็นคำที่เข้าใจยากเมื่อเทียบกับวัย',
    short_en: 'Reduced responsive babbling or difficult vocabulary compared to peers.',
    description_th: 'เด็กในวัยเดียวกันเริ่มประกอบคำสั้น ๆ ได้แล้ว แต่น้องยังนิ่งเงียบ หรือใช้วิธีร้องงอแงแทนการชี้บอกความต้องการ หรือใช้น้ำเสียงสื่อความหมายไม่ได้อย่างถูกต้องตามวัย\n\n**สัญญาณที่ควรประเมินเพิ่มเติม**: อาจเป็นการสะท้อนด้านความล่าช้าของการเชื่อมโยงความคิด กล้ามเนื้อปาก หรือการจดจ่อที่ลดลง แนะนำให้ประเมินอย่างละเอียดร่วมกับนักกิจกรรมบำบัดเพื่อกระตุ้นทักษะร่วมกับการเล่นอย่างเป็นธรรมชาติครับ',
    description_en: 'While peers can form simple sentences, the child remains quiet, points without babbling, or screams to express needs.\n\n**Recommendation**: Suggests assessing cognitive association, oral motor coordination, or social attention. Play-based pediatric therapy may help.',
    image_url: '',
    cta_link: '',
    status: 'active',
    display_order: 1
  },
  {
    id: 'c2',
    title_th: 'ไม่ค่อยสบตา',
    title_en: 'Avoids Eye Contact',
    short_th: 'น้องไม่ชอบสบตาเวลาคุย หลีกเลี่ยงสายตา หรือดูเหม่อลอย',
    short_en: 'Avoids look contacts during conversation, looks elsewhere.',
    description_th: 'เมื่อเรียกชื่อหรือชวนทำกิจกรรม น้องมักหลบตาหรือมองไปทิศทางอื่น เหม่อลอย เหมือนอยู่ในโลกส่วนตัว ไม่ตอบรับสายตาของผู้ใหญ่\n\n**สัญญาณที่ควรประเมินเพิ่มเติม**: ทักษะสมาธิการจดจ่อและการมีส่วนร่วมทางสังคม (Social Engagement) มีความสำคัญอย่างยิ่งต่อการเรียนรู้ สัญญาณดังกล่าวบ่งบอกว่าควรส่งเสริมพัฒนาการจดจ่ออย่างเหมาะสมและเป็นกันเองครับ',
    description_en: 'The child avoids holding eye contact when called or when playing, appearing preoccupied or disconnected.\n\n**Recommendation**: Social engagement is vital for early education. Recommended to promote focus and parallel play under professional guidance.',
    image_url: '',
    cta_link: '',
    status: 'active',
    display_order: 2
  },
  {
    id: 'c3',
    title_th: 'อยู่ไม่นิ่ง',
    title_en: 'Hyperactivity / Restlessness',
    short_th: 'น้องวิ่งเล่นวุ่นวายตลอดเวลา ทรงตัวบนเก้าอี้ไม่ได้ นั่งไม่ติดที่',
    short_en: 'Runs around constantly, cannot sit still on a chair.',
    description_th: 'น้องมักชอบวิ่งกระโดด นั่งเก้าอี้โยกเยกไปมา ไม่สามารถนั่งทำกิจกรรมเล็ก ๆ นิ่ง ๆ ได้เลย หรือเปลี่ยนพฤติกรรมอย่างรวดเร็ว\n\n**สัญญาณที่ควรประเมินเพิ่มเติม**: นี่อาจสะท้อนถึงการทำงานที่ยังไม่สมดุลของระบบประสาทส่วนกลางในการรับรู้การเคลื่อนไหวและการทรงตัว (Vestibular System) การทำกิจกรรมบำบัดกระตุ้นความตระหนักรู้ร่างกายจะช่วยเสริมทักษะนี้ได้ดีครับ',
    description_en: 'Shows persistent restless behavior, jumps, climbs, or wiggles. Inability to hold sitting postures during games.\n\n**Recommendation**: May indicate sensory imbalance in Vestibular processing. Occupational therapy targeting sensory integration helps organize movement.',
    image_url: '',
    cta_link: '',
    status: 'active',
    display_order: 3
  },
  {
    id: 'c4',
    title_th: 'จดจ่อกับกิจกรรมได้ไม่นาน',
    title_en: 'Short Attention Span',
    short_th: 'น้องทำงานไม่เสร็จ เปลี่ยนของเล่นไปมาอย่างรวดเร็ว ทำแป๊บเดียวเบื่อ',
    short_en: 'Quickly leaves tasks unfinished, switches toys rapidly.',
    description_th: 'น้องชอบปล่อยวางของเล่นที่หยิบขึ้นมาภายในเวลาไม่ถึงนาที วอกแวกง่ายจากเสียงภายนอก ไม่ยอมทำชิ้นงานที่ต้องใช้ความตั้งใจจนสำเร็จ\n\n**สัญญาณที่ควรประเมินเพิ่มเติม**: ระดับสมาธิและการควบคุมตนเอง (Self-Regulation) ที่จำกัดอาจส่งผลระยะยาวต่อทักษะการเรียนรู้ในระดับชั้นเรียน การประเมินและฝึกด้วยกิจกรรมโครงสร้างที่ค่อยเป็นค่อยไปจะสามารถช่วยปรับปรุงส่วนนี้ได้อย่างเหมาะสมครับ',
    description_en: 'Leaves tasks unfinished, easily distracted by minor background noises or changes. Switches games within minutes.\n\n**Recommendation**: Short concentration and low self-regulation can affect classroom learning. Recommended to slowly build focus through structured tasks.',
    image_url: '',
    cta_link: '',
    status: 'active',
    display_order: 4
  },
  {
    id: 'c5',
    title_th: 'เขียนหนังสือยาก / จับดินสอไม่ถนัด',
    title_en: 'Difficulty Writing / Weak Grasp',
    short_th: 'น้องบ่นเมื่อยมือล้าเร็วเมื่อเขียนหนังสือ หรือกุมดินสอผิดวิธี',
    short_en: 'Complains of hand fatigue quickly, holds pencil incorrectly.',
    description_th: 'น้องจับดินสอโดยใช้กำปั้นกำ หรือกดดินสอเบาเกินไปจนเส้นจาง บ่นเจ็บมือเมื่อเริ่มระบายสีหรือเขียนหนังสือเพียงไม่กี่นาที\n\n**สัญญาณที่ควรประเมินเพิ่มเติม**: สะท้อนว่าความแข็งแรงของกล้ามเนื้อมือและนิ้วมัดเล็ก (Fine Motor) อาจยังพัฒนาไม่สมบูรณ์ตามวัย การประเมินเพื่อหาข้อติดขัดและการฝึกดินน้ำมัน กรรไกร หรือคีบของเล่นจะช่วยเตรียมความพร้อมเขียนหนังสือได้เป็นอย่างดีครับ',
    description_en: 'Grasps pencil with fist, writes too lightly, or complains of severe hand pain when writing or coloring.\n\n**Recommendation**: Indicates fine motor muscle weakness. Therapy exercises like playdough sculpting or scissor tasks build coordination.',
    image_url: '',
    cta_link: '',
    status: 'active',
    display_order: 5
  },
  {
    id: 'c6',
    title_th: 'ช่วยเหลือตัวเองได้ช้า',
    title_en: 'Delayed Self-Help Skills',
    short_th: 'น้องติดกระดุมไม่ได้ สวมรองเท้าเองไม่ได้ หรือช้อนตักอาหารไม่ถนัด',
    short_en: 'Cannot button clothes, wear shoes, or use utensils.',
    description_th: 'เมื่อถึงช่วงวัยที่ควรสวมใส่เสื้อผ้า สวมรองเท้าแปะเทป หรือตักอาหารกินเองได้ น้องยังต้องมีผู้ปกครองช่วยจัดการทำทุกอย่างให้เกือบทั้งหมด\n\n**สัญญาณที่ควรประเมินเพิ่มเติม**: อาจเป็นผลมาจากระดับการวางแผนเคลื่อนไหวร่างกาย (Motor Planning) หรือความคล่องแคล่วของนิ้วมือ แนะนำให้ประเมินทักษะและการแยกทักษะเพื่อฝึกฝนอย่างเหมาะสมครับ',
    description_en: 'The child struggles with basic tasks like putting on shoes, buttoning, or self-feeding at an age where independence is expected.\n\n**Recommendation**: May point to difficulties in fine motor planning. Occupational therapists break down tasks to train independence.',
    image_url: '',
    cta_link: '',
    status: 'active',
    display_order: 6
  },
  {
    id: 'c7',
    title_th: 'ไม่ชอบสัมผัสบางอย่าง / ไม่ชอบเสียงดัง',
    title_en: 'Sensory Over-Sensitivity',
    short_th: 'น้องกลัวเสียงดังมากผิดปกติ หรือร้องงอแงเมื่อเดินบนพื้นทราย/หญ้า',
    short_en: 'Distressed by everyday sounds, avoids grass or sand.',
    description_th: 'น้องมีปฏิกิริยาตกใจ ร้องไห้ และใช้มือปิดหูเมื่อได้ยินเสียงทั่วไป เช่น เครื่องปั่น ไดร์เป่าผม หรือไม่ยอมเหยียบพื้นหญ้า ดิน ทราย ด้วยเท้าเปล่า\n\n**สัญญาณที่ควรประเมินเพิ่มเติม**: เด็กอาจมีภาวะไวต่อประสาทสัมผัสรับรู้ที่ผิวหนังหรือหูส่วนนอก การประเมินและปรับระดับประสาทสัมผัส (Sensory Integration Therapy) จะช่วยให้น้องปรับตัวและเปิดรับสิ่งแวดล้อมได้ปกติสุขขึ้นครับ',
    description_en: 'Triggers panic or crying in response to common sounds (hairdryers, blenders) or textures (sand, grass, clay).\n\n**Recommendation**: Points to sensory modulation difficulties. Sensory integration programs slowly desensitize reactions.',
    image_url: '',
    cta_link: '',
    status: 'active',
    display_order: 7
  },
  {
    id: 'c8',
    title_th: 'เล่นกับเพื่อนได้ยาก / ควบคุมอารมณ์ลำบาก',
    title_en: 'Difficulty Socializing / Tantrums',
    short_th: 'น้องชอบแย่งของเล่น ไม่เข้าใจกติกา หรือกรีดร้องเมื่อขัดใจ',
    short_en: 'Tantrums when disappointed, cannot share or play in groups.',
    description_th: 'เมื่อเข้าเล่นแบบกลุ่ม น้องมักทำตามกติกาไม่ได้ แย่งของเล่นเพื่อน ทะเลาะ หรือร้องไห้กรีดร้องยาวนานเมื่อพบความไม่ได้ดั่งใจ\n\n**สัญญาณที่ควรประเมินเพิ่มเติม**: ทักษะสังคมและการจัดการอารมณ์ร่วม (Self-Regulation & Peer Play) ต้องอาศัยทักษะความยืดหยุ่นทางความคิด แนะนำให้ปรึกษาเพื่อรับคำแนะนำการสร้างแรงจูงใจและการฝึกอย่างมีขั้นตอนควบคู่ไปกับคุณพ่อคุณแม่ครับ',
    description_en: 'Struggles to share, follow rules, or calm down during disappointment. Throws temper tantrums that disrupt group activities.\n\n**Recommendation**: Requires cognitive flexibility and emotional regulation. We help model positive coping methods alongside parents.',
    image_url: '',
    cta_link: '',
    status: 'active',
    display_order: 8
  }
];

// Helper to initialize local storage if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  }
  if (!localStorage.getItem(KEYS.SERVICES)) {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  }
  if (!localStorage.getItem(KEYS.ARTICLES)) {
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(INITIAL_ARTICLES));
  }
  if (!localStorage.getItem(KEYS.PROMOTIONS)) {
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
  }
  if (!localStorage.getItem(KEYS.GALLERY)) {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
  }
  if (!localStorage.getItem(KEYS.TESTIMONIALS)) {
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
  }
  if (!localStorage.getItem(KEYS.FAQS)) {
    localStorage.setItem(KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
  }
  if (!localStorage.getItem(KEYS.ASSESSMENTS)) {
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(INITIAL_ASSESSMENTS));
  }
  
  // Set default admin credentials (username: admin, password: password123)
  if (!localStorage.getItem(KEYS.ADMIN_USERS)) {
    localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify([
      { username: 'admin', passwordHash: 'password123' } // simple secure local hash in realistic apps, here plain placeholder
    ]));
  }
};

initializeLocalStorage();

// Unified DB API
export const db = {
  // 1. Clinic Settings
  getClinicSettings: async () => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('clinic_settings')
          .select('*')
          .eq('id', 1)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
      }
    }
    const localData = JSON.parse(localStorage.getItem(KEYS.SETTINGS));
    return localData ? { ...INITIAL_SETTINGS, ...localData } : INITIAL_SETTINGS;
  },

  updateClinicSettings: async (settings) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from('clinic_settings')
          .update(settings)
          .eq('id', 1);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase updateClinicSettings failed', err);
      }
    }
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify({ ...INITIAL_SETTINGS, ...settings, id: 1 }));
    return true;
  },

  // 2. Services
  getServices: async (includeInactive = false) => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('services').select('*').order('display_order', { ascending: true });
        if (!includeInactive) {
          query = query.eq('status', 'active');
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase getServices failed, falling back to LocalStorage', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.SERVICES)) || INITIAL_SERVICES;
    return includeInactive ? items : items.filter(item => item.status === 'active');
  },

  createService: async (service) => {
    const newService = { ...service, id: `s_${Date.now()}` };
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').insert([service]);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase createService failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.SERVICES)) || INITIAL_SERVICES;
    items.push(newService);
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(items));
    return true;
  },

  updateService: async (id, service) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').update(service).eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase updateService failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.SERVICES)) || INITIAL_SERVICES;
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...service };
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(items));
    }
    return true;
  },

  deleteService: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase deleteService failed', err);
      }
    }
    let items = JSON.parse(localStorage.getItem(KEYS.SERVICES)) || INITIAL_SERVICES;
    items = items.filter(item => item.id !== id);
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(items));
    return true;
  },

  // 3. Articles
  getArticles: async (includeDrafts = false) => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('articles').select('*').order('published_date', { ascending: false });
        if (!includeDrafts) {
          query = query.eq('status', 'published');
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase getArticles failed, falling back to LocalStorage', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.ARTICLES)) || INITIAL_ARTICLES;
    return includeDrafts ? items : items.filter(item => item.status === 'published');
  },

  getArticleBySlug: async (slug) => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase getArticleBySlug failed, falling back to LocalStorage', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.ARTICLES)) || INITIAL_ARTICLES;
    return items.find(item => item.slug === slug);
  },

  createArticle: async (article) => {
    const newArticle = { ...article, id: `a_${Date.now()}` };
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('articles').insert([article]);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase createArticle failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.ARTICLES)) || INITIAL_ARTICLES;
    items.push(newArticle);
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(items));
    return true;
  },

  updateArticle: async (id, article) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('articles').update(article).eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase updateArticle failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.ARTICLES)) || INITIAL_ARTICLES;
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...article };
      localStorage.setItem(KEYS.ARTICLES, JSON.stringify(items));
    }
    return true;
  },

  deleteArticle: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase deleteArticle failed', err);
      }
    }
    let items = JSON.parse(localStorage.getItem(KEYS.ARTICLES)) || INITIAL_ARTICLES;
    items = items.filter(item => item.id !== id);
    localStorage.setItem(KEYS.ARTICLES, JSON.stringify(items));
    return true;
  },

  // 4. Promotions (Auto hides expired ones for public view)
  getPromotions: async (includeInactive = false) => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('promotions').select('*').order('created_at', { ascending: false });
        if (!includeInactive) {
          query = query.eq('status', 'active');
        }
        const { data, error } = await query;
        if (error) throw error;
        
        if (includeInactive) return data;
        // Filter out expired promotions on the client side for safety
        return data.filter(promo => {
          const startValid = promo.start_date ? promo.start_date <= currentDate : true;
          const endValid = promo.end_date ? promo.end_date >= currentDate : true;
          return startValid && endValid;
        });
      } catch (err) {
        console.warn('Supabase getPromotions failed, falling back to LocalStorage', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.PROMOTIONS)) || INITIAL_PROMOTIONS;
    if (includeInactive) return items;
    
    return items.filter(promo => {
      const activeState = promo.status === 'active';
      const startValid = promo.start_date ? promo.start_date <= currentDate : true;
      const endValid = promo.end_date ? promo.end_date >= currentDate : true;
      return activeState && startValid && endValid;
    });
  },

  createPromotion: async (promo) => {
    const newPromo = { ...promo, id: `p_${Date.now()}` };
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('promotions').insert([promo]);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase createPromotion failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.PROMOTIONS)) || INITIAL_PROMOTIONS;
    items.push(newPromo);
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(items));
    return true;
  },

  updatePromotion: async (id, promo) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('promotions').update(promo).eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase updatePromotion failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.PROMOTIONS)) || INITIAL_PROMOTIONS;
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...promo };
      localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(items));
    }
    return true;
  },

  deletePromotion: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('promotions').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase deletePromotion failed', err);
      }
    }
    let items = JSON.parse(localStorage.getItem(KEYS.PROMOTIONS)) || INITIAL_PROMOTIONS;
    items = items.filter(item => item.id !== id);
    localStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(items));
    return true;
  },

  // 5. Gallery
  getGallery: async (includeInactive = false) => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('gallery').select('*').order('display_order', { ascending: true });
        if (!includeInactive) {
          query = query.eq('status', 'active');
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase getGallery failed, falling back to LocalStorage', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.GALLERY)) || INITIAL_GALLERY;
    return includeInactive ? items : items.filter(item => item.status === 'active');
  },

  createGallery: async (item) => {
    const newItem = { ...item, id: `g_${Date.now()}` };
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('gallery').insert([item]);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase createGallery failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.GALLERY)) || INITIAL_GALLERY;
    items.push(newItem);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(items));
    return true;
  },

  deleteGallery: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase deleteGallery failed', err);
      }
    }
    let items = JSON.parse(localStorage.getItem(KEYS.GALLERY)) || INITIAL_GALLERY;
    items = items.filter(item => item.id !== id);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(items));
    return true;
  },

  // 6. Testimonials
  getTestimonials: async (includeInactive = false) => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('testimonials').select('*').order('display_order', { ascending: true });
        if (!includeInactive) {
          query = query.eq('status', 'active');
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase getTestimonials failed, falling back to LocalStorage', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS)) || INITIAL_TESTIMONIALS;
    return includeInactive ? items : items.filter(item => item.status === 'active');
  },

  createTestimonial: async (testimonial) => {
    const newTestimonial = { ...testimonial, id: `t_${Date.now()}` };
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('testimonials').insert([testimonial]);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase createTestimonial failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS)) || INITIAL_TESTIMONIALS;
    items.push(newTestimonial);
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(items));
    return true;
  },

  updateTestimonial: async (id, testimonial) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('testimonials').update(testimonial).eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase updateTestimonial failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS)) || INITIAL_TESTIMONIALS;
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...testimonial };
      localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(items));
    }
    return true;
  },

  deleteTestimonial: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase deleteTestimonial failed', err);
      }
    }
    let items = JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS)) || INITIAL_TESTIMONIALS;
    items = items.filter(item => item.id !== id);
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(items));
    return true;
  },

  // 7. FAQs
  getFAQs: async (includeInactive = false) => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('faqs').select('*').order('display_order', { ascending: true });
        if (!includeInactive) {
          query = query.eq('status', 'active');
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase getFAQs failed, falling back to LocalStorage', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.FAQS)) || INITIAL_FAQS;
    return includeInactive ? items : items.filter(item => item.status === 'active');
  },

  createFAQ: async (faq) => {
    const newFAQ = { ...faq, id: `f_${Date.now()}` };
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('faqs').insert([faq]);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase createFAQ failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.FAQS)) || INITIAL_FAQS;
    items.push(newFAQ);
    localStorage.setItem(KEYS.FAQS, JSON.stringify(items));
    return true;
  },

  updateFAQ: async (id, faq) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('faqs').update(faq).eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase updateFAQ failed', err);
      }
    }
    const items = JSON.parse(localStorage.getItem(KEYS.FAQS)) || INITIAL_FAQS;
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...faq };
      localStorage.setItem(KEYS.FAQS, JSON.stringify(items));
    }
    return true;
  },

  deleteFAQ: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase deleteFAQ failed', err);
      }
    }
    let items = JSON.parse(localStorage.getItem(KEYS.FAQS)) || INITIAL_FAQS;
    items = items.filter(item => item.id !== id);
    localStorage.setItem(KEYS.FAQS, JSON.stringify(items));
    return true;
  },

  // 7.5. Assessment Types (Screening Checklist)
  getAssessments: async (includeInactive = false) => {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('assessments').select('*').order('display_order', { ascending: true });
        if (!includeInactive) {
          query = query.eq('status', 'active');
        }
        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase getAssessments failed, falling back to LocalStorage', err);
      }
    }
    const list = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS)) || INITIAL_ASSESSMENTS;
    const sorted = [...list].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    if (includeInactive) return sorted;
    return sorted.filter(item => item.status === 'active');
  },

  createAssessment: async (data) => {
    const newItem = { ...data, id: `c_${Date.now()}` };
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('assessments').insert([data]);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase createAssessment failed', err);
        throw err;
      }
    }
    const list = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS)) || INITIAL_ASSESSMENTS;
    list.push(newItem);
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(list));
    return true;
  },

  updateAssessment: async (id, data) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('assessments').update(data).eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase updateAssessment failed', err);
        throw err;
      }
    }
    const list = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS)) || INITIAL_ASSESSMENTS;
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(list));
    }
    return true;
  },

  deleteAssessment: async (id) => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('assessments').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase deleteAssessment failed', err);
        throw err;
      }
    }
    let list = JSON.parse(localStorage.getItem(KEYS.ASSESSMENTS)) || INITIAL_ASSESSMENTS;
    list = list.filter(item => item.id !== id);
    localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(list));
    return true;
  },

  // 8. Admin Authentication
  login: async (username, password) => {
    if (isSupabaseConfigured) {
      try {
        // Authenticate using Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username.includes('@') ? username : `${username}@hugdee.com`, // support using username as email suffix
          password: password
        });
        if (error) throw error;
        
        const session = {
          token: data.session.access_token,
          user: {
            username: data.user.email.split('@')[0],
            email: data.user.email,
            role: 'Admin'
          },
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        };
        localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(session));
        return { success: true, user: session.user };
      } catch (err) {
        console.error('Supabase login failed, trying Local Fallback', err);
      }
    }
    
    // Local Fallback
    const adminUsers = JSON.parse(localStorage.getItem(KEYS.ADMIN_USERS)) || [];
    const user = adminUsers.find(u => u.username === username && u.passwordHash === password);
    if (user) {
      const session = {
        token: `mock_token_${Date.now()}`,
        user: {
          username: user.username,
          role: 'Admin'
        },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      };
      localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(session));
      return { success: true, user: session.user };
    }
    
    return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  },

  logout: () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(err => console.error('Supabase signout failed', err));
    }
    localStorage.removeItem(KEYS.ADMIN_SESSION);
  },

  getCurrentUser: () => {
    const sessionStr = localStorage.getItem(KEYS.ADMIN_SESSION);
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(KEYS.ADMIN_SESSION);
      return null;
    }
    return session.user;
  }
};
