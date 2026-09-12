-- SQL script for creating CMS tables in Supabase for Hug Dee Home Clinic website.
-- To run this, open your Supabase Dashboard, go to SQL Editor, and execute this script.

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS gallery;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS clinic_settings;
DROP TABLE IF EXISTS admin_users;

-- 1. Clinic Settings Table
CREATE TABLE clinic_settings (
    id INT PRIMARY KEY DEFAULT 1,
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    tagline_th VARCHAR(255),
    tagline_en VARCHAR(255),
    description_th TEXT,
    description_en TEXT,
    logo_url TEXT,
    phone VARCHAR(50),
    line_id VARCHAR(100),
    facebook_url TEXT,
    address_th TEXT,
    address_en TEXT,
    maps_url TEXT,
    opening_hours_th TEXT,
    opening_hours_en TEXT,
    hero_image_url TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    assessment_title_th VARCHAR(255),
    assessment_title_en VARCHAR(255),
    assessment_description_th TEXT,
    assessment_description_en TEXT,
    assessment_image_url TEXT,
    assessment_cta_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- 2. Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_th VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_th TEXT,
    description_en TEXT,
    icon VARCHAR(100), -- Lucide icon name, e.g. "Baby", "Activity"
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Articles Table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_th VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt_th TEXT,
    excerpt_en TEXT,
    content_th TEXT,
    content_en TEXT,
    cover_image_url TEXT,
    category_th VARCHAR(100),
    category_en VARCHAR(100),
    author VARCHAR(100) DEFAULT 'นักกิจกรรมบำบัดวิชาชีพ',
    published_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Promotions Table
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_th VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_th TEXT,
    description_en TEXT,
    original_price NUMERIC(10, 2),
    promotion_price NUMERIC(10, 2),
    image_url TEXT,
    start_date DATE,
    end_date DATE,
    cta_link TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Gallery Table
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL, -- e.g. "บรรยากาศคลินิก", "ห้องกิจกรรม", "อุปกรณ์"
    caption_th VARCHAR(255),
    caption_en VARCHAR(255),
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Testimonials Table
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_th VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    content_th TEXT NOT NULL,
    content_en TEXT NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. FAQs Table
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_th TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_th TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'ทั่วไป',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Admin Users Table (For Local Authentication Fallback / Logging)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Hashed password
    role VARCHAR(50) DEFAULT 'Admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Initial Clinic Settings Row
INSERT INTO clinic_settings (
    id, name_th, name_en, tagline_th, tagline_en, 
    description_th, description_en, logo_url, phone, line_id, facebook_url, 
    address_th, address_en, maps_url, opening_hours_th, opening_hours_en,
    hero_image_url, seo_title, seo_description
) VALUES (
    1,
    'บ้านฮักดี คลินิกการประกอบโรคศิลปะ สาขากิจกรรมบำบัด',
    'Hug Dee Home Clinic',
    'ทุกก้าวของลูก สำคัญสำหรับเรา',
    'Every step of your child matters to us',
    'บ้านฮักดี คลินิกกิจกรรมบำบัด ให้บริการประเมิน บำบัด และส่งเสริมพัฒนาการเด็กอายุ 6 เดือน – 12 ปี โดยนักกิจกรรมบำบัดวิชาชีพ',
    'Hug Dee Home Clinic offers sensory, pediatric developmental assessment, and therapy for children aged 6 months to 12 years by professional occupational therapists.',
    '', -- Empty initially (will fallback to default logo)
    '094-675-3557',
    '@hugdeehome',
    'https://www.facebook.com/hugdeehome',
    '104/7 หมู่ 17 ตำบลบ้านต๋อม อำเภอเมือง จังหวัดพะเยา 56000',
    '104/7 Moo 17, Ban Tom, Mueang, Phayao 56000',
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.206497121404!2d99.88794837582522!3d19.197089948834415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d8329bc019cd51%3A0xe54d9b4b0e8b4e7a!2z4Lia4LmJ4Liy4LiZ4LmA4Lin4Liq4Li04Li1IOC4hOC4peC4tOC4meC4tOC4gSDguIHguLiy4Lia4Liy4LiB4Li04LiI4LiB4Lij4Lij4LiV4Liw4Lia4Lix4LiX4LiH!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth',
    'อังคาร - ศุกร์ 17:00 - 20:00, เสาร์ - อาทิตย์ 09:00 - 18:00 (ปิดวันจันทร์)',
    'Tuesday - Friday 17:00 - 20:00, Saturday - Sunday 09:00 - 18:00 (Closed on Monday)',
    '', -- Empty initially (will fallback to default hero)
    'บ้านฮักดี คลินิกกิจกรรมบำบัด พะเยา | กระตุ้นพัฒนาการเด็ก',
    'บ้านฮักดี คลินิกกิจกรรมบำบัด พะเยา ประเมินและบำบัดพัฒนาการเด็ก โดยนักกิจกรรมบำบัดวิชาชีพ อบอุ่น เป็นกันเอง ปลอดภัยสำหรับลูกน้อย'
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Access (Read-Only)
CREATE POLICY "Public read clinic settings" ON clinic_settings FOR SELECT USING (true);
CREATE POLICY "Public read active services" ON services FOR SELECT USING (status = 'active');
CREATE POLICY "Public read published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read active promotions" ON promotions FOR SELECT USING (status = 'active');
CREATE POLICY "Public read active gallery" ON gallery FOR SELECT USING (status = 'active');
CREATE POLICY "Public read active testimonials" ON testimonials FOR SELECT USING (status = 'active');
CREATE POLICY "Public read active faqs" ON faqs FOR SELECT USING (status = 'active');

-- Create Policies for Authenticated Admins (Full Control CRUD)
-- Note: authenticated users are users logged into Supabase Auth.
CREATE POLICY "Admins full control clinic settings" ON clinic_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full control services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full control articles" ON articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full control promotions" ON promotions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full control gallery" ON gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full control testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full control faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins full control admin users" ON admin_users FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. Assessments Table
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    title_th VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    short_th TEXT,
    short_en TEXT,
    description_th TEXT,
    description_en TEXT,
    image_url TEXT,
    cta_link TEXT,
    status VARCHAR(50) DEFAULT 'active',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active assessments" ON assessments FOR SELECT USING (status = 'active');
CREATE POLICY "Admins full control assessments" ON assessments FOR ALL TO authenticated USING (true) WITH CHECK (true);

