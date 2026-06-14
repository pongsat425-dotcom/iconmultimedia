-- =========================================================================
-- SUPABASE DATABASE SETUP SCRIPT (ICON MULTIMEDIA)
-- คำสั่งติดตั้งและรีเซ็ตโครงสร้างฐานข้อมูลทั้งหมด (จัดระเบียบเรียบร้อยแล้ว)
-- =========================================================================

-- ─────────────────────────────────────────────────────────────────────────
-- 1. ตารางผู้ใช้งาน (Users Table)
-- ─────────────────────────────────────────────────────────────────────────

-- สร้างตาราง users สำหรับเก็บข้อมูลผู้ใช้ที่ sync กับ Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────
-- 1.1 Trigger: สร้าง user ใน public.users อัตโนมัติเมื่อมีการสมัครสมาชิกผ่าน Supabase Auth
-- ─────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'user'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ลบ trigger เก่าก่อน (ถ้ามี) แล้วสร้างใหม่
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- 2. ฟังก์ชันช่วยเช็คสิทธิ์ (Helper Functions)
-- ─────────────────────────────────────────────────────────────────────────

-- สร้างฟังก์ชันเช็คสิทธิ์ Admin แบบ SECURITY DEFINER (เพื่อหลีกเลี่ยงการเกิด Infinite Loop ใน RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────
-- 2. จัดการตาราง สินค้า (Products Table)
-- ─────────────────────────────────────────────────────────────────────────

-- ลบตารางเดิมออกก่อนหากต้องการรีเซ็ต (ระวัง: ข้อมูลเก่าในตารางนี้จะหายทั้งหมด)
DROP TABLE IF EXISTS public.products CASCADE;

-- สร้างตาราง products ใหม่พร้อมโครงสร้างที่ถูกต้อง (รวมคอลัมน์ images ย่อยเข้าไว้ด้วยกันแล้ว)
CREATE TABLE public.products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb, -- เก็บริรูปภาพย่อยแกลเลอรี
  category TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  stock INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  specs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────────────────────────────────────
-- 3. จัดการสิทธิ์การเข้าถึง (Row Level Security - RLS)
-- ─────────────────────────────────────────────────────────────────────────

-- 3.1 เคลียร์นโยบายสิทธิ์เก่าของตาราง users และ products ทั้งหมดเพื่อความถูกต้อง
DO $$
DECLARE
    pol record;
BEGIN
    -- ลบนโยบายทั้งหมดบนตาราง users
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'users'
    LOOP
        EXECUTE format('DROP POLICY %I ON public.users', pol.policyname);
    END LOOP;

    -- ลบนโยบายทั้งหมดบนตาราง products
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'products'
    LOOP
        EXECUTE format('DROP POLICY %I ON public.products', pol.policyname);
    END LOOP;
END $$;

-- 3.2 ตั้งค่า RLS สำหรับตาราง ผู้ใช้งาน (users)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- นโยบายการเลือกดูโปรไฟล์ (Select): ดูของตัวเองได้ หรือ Admin ดูได้ทั้งหมด
CREATE POLICY "Users can read own record or admins read all" ON public.users
  FOR SELECT USING (
    auth.role() = 'service_role' OR 
    auth.uid() = id OR 
    public.is_admin()
  );

-- นโยบายการแก้ไขข้อมูล (Update): แก้ของตัวเองได้ หรือ Admin แก้ไขได้ทั้งหมด
CREATE POLICY "Users can update own record or admins update all" ON public.users
  FOR UPDATE USING (
    auth.role() = 'service_role' OR 
    auth.uid() = id OR 
    public.is_admin()
  );

-- 3.3 ตั้งค่า RLS สำหรับตาราง สินค้า (products)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- นโยบายการเลือกดูสินค้า (Select): อนุญาตให้ลูกค้าและบุคคลทั่วไปดูสินค้าทั้งหมดได้
CREATE POLICY "Products are publicly readable" ON public.products
  FOR SELECT USING (true);

-- นโยบายจัดการสินค้า (All): อนุญาตให้เฉพาะ Admin หรือ Service Role จัดการสินค้าได้ทั้งหมด (เพิ่ม/แก้ไข/ลบ)
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    auth.role() = 'service_role' OR 
    public.is_admin()
  );


-- ─────────────────────────────────────────────────────────────────────────
-- 4. จัดการถังเก็บไฟล์รูปภาพสินค้า (Storage Buckets & Policies)
-- ─────────────────────────────────────────────────────────────────────────

-- สร้าง Bucket 'product-images' สำหรับจัดเก็บรูปภาพสินค้า (ข้ามหากมีอยู่แล้ว)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images', 
  'product-images', 
  true, 
  5242880, -- จำกัดขนาดไฟล์สูงสุด 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- เคลียร์นโยบายความปลอดภัยของเก็บภาพสินค้าเดิม
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;

-- ตั้งนโยบายสิทธิ์ความปลอดภัยใหม่สำหรับเก็บภาพสินค้า
-- 1) อนุญาตให้บุคคลทั่วไปเปิดดูรูปภาพได้โดยตรง (Select)
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- 2) อนุญาตเฉพาะผู้ดูแลระบบ (Admin) ในการเพิ่มรูปภาพใหม่ (Insert)
CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'product-images' AND public.is_admin()
  );

-- 3) อนุญาตเฉพาะผู้ดูแลระบบ (Admin) ในการแก้ไขข้อมูลรูปภาพ (Update)
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'product-images' AND public.is_admin()
  );

-- 4) อนุญาตเฉพาะผู้ดูแลระบบ (Admin) ในการลบรูปภาพ (Delete)
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'product-images' AND public.is_admin()
  );


-- ─────────────────────────────────────────────────────────────────────────
-- 5. จัดการตารางสไลด์หน้าโฮมเพจ (Hero Slides)
-- ─────────────────────────────────────────────────────────────────────────

-- สร้างตาราง hero_slides ใหม่หากไม่มี
CREATE TABLE IF NOT EXISTS public.hero_slides (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NULL,
  subtitle TEXT NULL,
  description TEXT NULL,
  button_text_1 TEXT NULL,
  button_link_1 TEXT NULL,
  button_text_2 TEXT NULL,
  button_link_2 TEXT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- เปิดใช้งาน RLS สำหรับตาราง hero_slides
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- ลบนโยบายเก่าของตาราง hero_slides
DROP POLICY IF EXISTS "Anyone can view hero slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admins can insert hero slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admins can update hero slides" ON public.hero_slides;
DROP POLICY IF EXISTS "Admins can delete hero slides" ON public.hero_slides;

-- สร้างนโยบายการเข้าถึงข้อมูลใหม่ของ hero_slides
CREATE POLICY "Anyone can view hero slides" ON public.hero_slides
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert hero slides" ON public.hero_slides
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update hero slides" ON public.hero_slides
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete hero slides" ON public.hero_slides
  FOR DELETE TO authenticated USING (public.is_admin());

-- ใส่ข้อมูลตั้งต้น 3 สไลด์หลัก
INSERT INTO public.hero_slides (id, title, subtitle, description, button_text_1, button_link_1, button_text_2, button_link_2, image_url, order_index)
VALUES 
(
  'slide-1',
  'Next-Gen Computing Power',
  'Mega Sale 2026',
  'ค้นพบแล็ปท็อป พีซีตั้งโต๊ะ และชิ้นส่วนฮาร์ดแวร์ประสิทธิภาพสูงล่าสุด อัปเกรดเซ็ตอัปของคุณด้วยคุณภาพและการบริการที่เหนือระดับ',
  'ช้อปเลย',
  '/shop',
  'ดูโปรโมชั่น',
  '/promotions',
  'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?q=80&w=1600&auto=format&fit=crop',
  0
),
(
  'slide-2',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1600&auto=format&fit=crop',
  1
),
(
  'slide-3',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1600&auto=format&fit=crop',
  2
)
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────────────
-- 6. จัดการตารางคำสั่งซื้อ (Orders Table)
-- ─────────────────────────────────────────────────────────────────────────

-- สร้างตาราง orders หากยังไม่มี หรือปรับปรุงโครงสร้างตาราง
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตรวจสอบและเพิ่มคอลัมน์ items และ updated_at หากตารางมีอยู่แล้วแต่ไม่มีคอลัมน์เหล่านี้
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='orders' AND column_name='items'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN items JSONB NOT NULL DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='orders' AND column_name='updated_at'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- เปิดใช้งาน RLS สำหรับตาราง orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ลบนโยบายเก่าของตาราง orders
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;

-- สร้างนโยบายการเข้าถึงข้อมูลใหม่ของ orders
-- 1) ให้ลูกค้าดูออเดอร์ของตัวเองได้ หรือ Admin ดูได้ทั้งหมด
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    auth.role() = 'service_role' OR 
    auth.uid() = user_id OR 
    public.is_admin()
  );

-- 2) ให้ลูกค้าทั่วไปกดสร้างออเดอร์ของตัวเองได้ (Insert)
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3) ให้ผู้ดูแลระบบ (Admin) หรือ Service Role จัดการออเดอร์ได้ทั้งหมด
CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (
    auth.role() = 'service_role' OR 
    public.is_admin()
  );


-- ─────────────────────────────────────────────────────────────────────────
-- 7. จัดการตารางการตั้งค่าของเว็บไซต์ (Site Settings Table)
-- ─────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- เปิดใช้งาน RLS สำหรับตาราง site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ลบนโยบายเก่าของตาราง site_settings
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

-- สร้างนโยบายการเข้าถึงข้อมูลใหม่ของ site_settings
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (
    auth.role() = 'service_role' OR 
    public.is_admin()
  );

-- ใส่ค่าเริ่มต้นสำหรับแสดงผลหน้าแรก (Homepage Layout Visibility Settings)
INSERT INTO public.site_settings (key, value)
VALUES (
  'homepage_sections',
  '{"show_new_arrivals": true, "show_best_sellers": true, "visible_categories": ["laptops", "desktops", "components", "external-devices", "printers", "mainboard", "ram", "storage", "gpu", "power-supply", "cooling", "monitor", "keyboard", "headset", "router"]}'::jsonb
)
ON CONFLICT (key) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────────────
-- 8. จัดการตารางรีวิวสินค้า (Product Reviews Table)
-- ─────────────────────────────────────────────────────────────────────────

-- ลบตารางเดิมออกก่อนหากต้องการรีเซ็ต (เพื่อป้องกันปัญหา Foreign Key หายไปหลังจาก DROP TABLE products CASCADE)
DROP TABLE IF EXISTS public.product_reviews CASCADE;

CREATE TABLE public.product_reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- เปิดการใช้งาน Row Level Security (RLS) สำหรับตารางรีวิว
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- ลบนโยบายเก่าของตารางรีวิวสินค้า
DROP POLICY IF EXISTS "Anyone can view product reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "Admins can manage product reviews" ON public.product_reviews;

-- นโยบายสิทธิ์การใช้งาน
CREATE POLICY "Anyone can view product reviews" ON public.product_reviews
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage product reviews" ON public.product_reviews
  FOR ALL USING (
    auth.role() = 'service_role' OR 
    public.is_admin()
  );


-- ฟังก์ชันและ Trigger สำหรับคำนวณคะแนนและจำนวนรีวิวอัตโนมัติในตาราง products
CREATE OR REPLACE FUNCTION public.update_product_rating_on_review()
RETURNS TRIGGER AS $$
DECLARE
  v_rating NUMERIC;
  v_reviews INTEGER;
  v_prod_id TEXT;
BEGIN
  -- เลือกรหัสสินค้า
  v_prod_id := COALESCE(NEW.product_id, OLD.product_id);

  -- คำนวณคะแนนเฉลี่ยและจำนวนรีวิวทั้งหมด
  SELECT COALESCE(AVG(rating), 0), COUNT(*)
  INTO v_rating, v_reviews
  FROM public.product_reviews
  WHERE product_id = v_prod_id;

  -- อัปเดตข้อมูลย้อนกลับไปยังตาราง products
  UPDATE public.products
  SET rating = ROUND(v_rating, 1),
      reviews = v_reviews
  WHERE id = v_prod_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ลบ Trigger เดิมหากมีอยู่ป้องกันการทับซ้อน
DROP TRIGGER IF EXISTS update_product_rating_trigger ON public.product_reviews;

-- สร้าง Trigger ตัวใหม่
CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_product_rating_on_review();



