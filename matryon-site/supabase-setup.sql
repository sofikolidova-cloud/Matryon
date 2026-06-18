-- ============================================================
-- SQL-скрипт для настройки Supabase (profiles + reviews)
-- Запустите в SQL-редакторе Supabase Dashboard
-- ============================================================

-- 1. Таблица профилей (привязана к auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  email TEXT,
  full_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Триггер: автосоздание профиля при регистрации
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Reviews: все могут читать
DROP POLICY IF EXISTS "Reviews public read" ON reviews;
CREATE POLICY "Reviews public read" ON reviews
  FOR SELECT USING (true);

-- Reviews: только авторизованные могут добавлять
DROP POLICY IF EXISTS "Reviews auth insert" ON reviews;
CREATE POLICY "Reviews auth insert" ON reviews
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Reviews: авторы могут редактировать свои
DROP POLICY IF EXISTS "Reviews own update" ON reviews;
CREATE POLICY "Reviews own update" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Reviews: авторы могут удалять свои
DROP POLICY IF EXISTS "Reviews own delete" ON reviews;
CREATE POLICY "Reviews own delete" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews: админы могут удалять любые
DROP POLICY IF EXISTS "Reviews admin delete" ON reviews;
CREATE POLICY "Reviews admin delete" ON reviews
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Profiles: только владелец видит свой профиль
DROP POLICY IF EXISTS "Profiles own select" ON profiles;
CREATE POLICY "Profiles own select" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Profiles: владелец может обновлять
DROP POLICY IF EXISTS "Profiles own update" ON profiles;
CREATE POLICY "Profiles own update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. Таблица товаров
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('speaker', 'lamp', 'socket')),
  name TEXT NOT NULL,
  "desc" TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  specs JSONB,
  serial TEXT,
  image TEXT
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products public read" ON products;
CREATE POLICY "Products public read" ON products
  FOR SELECT USING (true);

-- Products: только админы могут добавлять
DROP POLICY IF EXISTS "Products admin insert" ON products;
CREATE POLICY "Products admin insert" ON products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Products: только админы могут обновлять
DROP POLICY IF EXISTS "Products admin update" ON products;
CREATE POLICY "Products admin update" ON products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Products: только админы могут удалять
DROP POLICY IF EXISTS "Products admin delete" ON products;
CREATE POLICY "Products admin delete" ON products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- 6. Заполняем товары (только если таблица пуста)
INSERT INTO products (id, type, name, "desc", price, specs, serial)
SELECT * FROM (VALUES
  ('sp-base', 'speaker', 'Matryon Base', 'СОЗДАНА ДЛЯ ТЕХ, КТО ЦЕНИТ БАЛАНС МЕЖДУ ТЕХНОЛОГИЙ И ТИШИНОЙ', '15 690', '{"display": "1.7\"", "memory": "4 ГБ", "speaker": "60 Вт"}'::jsonb, NULL),
  ('sp-light', 'speaker', 'Matryon Light', 'СОЗДАНА ДЛЯ ТЕХ, КТО ЦЕНИТ СВЕТ И АТМОСФЕРУ КАЖДЫЙ ДЕНЬ', '16 490', '{"display": "1.7\"", "memory": "4 ГБ", "speaker": "60 Вт"}'::jsonb, NULL),
  ('sp-pro', 'speaker', 'Matryon Pro', 'СОЗДАНА ДЛЯ ТЕХ, КТО СТРЕМИТСЯ К ПРОФЕССИОНАЛЬНОМУ ЗВУЧАНИЮ', '22 890', '{"display": "2.1\"", "memory": "8 ГБ", "speaker": "65 Вт"}'::jsonb, NULL),
  ('sp-mini', 'speaker', 'Matryon Mini', 'СОЗДАНА ДЛЯ ТЕХ, КТО ЦЕНИТ КОМПАКТНОСТЬ И СТИЛЬ', '12 490', '{"display": "1.7\"", "memory": "4 ГБ", "speaker": "60 Вт"}'::jsonb, NULL),
  ('sp-air', 'speaker', 'Matryon Air', 'СОЗДАНА ДЛЯ ТЕХ, КТО ВСЕГДА В ДВИЖЕНИИ И ЛЮБИТ МУЗЫКУ', '18 690', '{"display": "1.7\"", "memory": "8 ГБ", "speaker": "60 Вт"}'::jsonb, NULL),
  ('sp-max', 'speaker', 'Matryon Max', 'СОЗДАНА ДЛЯ ТЕХ, КТО ХОЧЕТ МАКСИМУМА ОТ КАЖДОГО МОМЕНТА', '28 990', '{"display": "2.8\"", "memory": "16 ГБ", "speaker": "65 Вт"}'::jsonb, NULL),
  ('sp-home', 'speaker', 'Matryon Home', 'СОЗДАНА ДЛЯ ТЕХ, КТО ПРЕВРАЩАЕТ ДОМ В МЕСТО СИЛЫ', '20 890', '{"display": "2.1\"", "memory": "8 ГБ", "speaker": "60 Вт"}'::jsonb, NULL),
  ('sp-duo', 'speaker', 'Matryon Duo', 'СОЗДАНА ДЛЯ ТЕХ, КТО ИЩЕТ ГАРМОНИЮ В КАЖДОЙ ДЕТАЛИ', '24 590', '{"display": "2.1\"", "memory": "16 ГБ", "speaker": "65 Вт"}'::jsonb, NULL),
  ('lp-one', 'lamp', 'Lampochka One', 'МЯГКИЙ СВЕТ ДЛЯ УЮТНЫХ ВЕЧЕРОВ И РАССЛАБЛЯЮЩЕЙ АТМОСФЕРЫ', '8 990', NULL, 'MAT-LP-1001'),
  ('lp-duo', 'lamp', 'Lampochka Duo', 'ДВА РЕЖИМА ОСВЕЩЕНИЯ ДЛЯ ЛЮБЫХ ЗАДАЧ И НАСТРОЕНИЯ', '11 490', NULL, 'MAT-LP-2001'),
  ('lp-color', 'lamp', 'Lampochka Color', '16 МИЛЛИОНОВ ЦВЕТОВ ДЛЯ ТВОЕГО ИДЕАЛЬНОГО ИНТЕРЬЕРА', '13 990', NULL, 'MAT-LP-3001'),
  ('lp-smart', 'lamp', 'Lampochka Smart', 'УПРАВЛЕНИЕ С ГОЛОСА И СМАРТФОНА ДЛЯ МАКСИМАЛЬНОГО КОМФОРТА', '15 490', NULL, 'MAT-LP-4001'),
  ('lp-dim', 'lamp', 'Lampochka Dim', 'ПЛАВНАЯ РЕГУЛИРОВКА ЯРКОСТИ ОТ РАССВЕТА ДО ЗАКАТА', '9 990', NULL, 'MAT-LP-5001'),
  ('lp-pro', 'lamp', 'Lampochka Pro', 'ПРОФЕССИОНАЛЬНОЕ ОСВЕЩЕНИЕ ДЛЯ РАБОТЫ И ТВОРЧЕСТВА', '18 490', NULL, 'MAT-LP-6001'),
  ('rz-smart', 'socket', 'Rozetka Smart', 'УМНАЯ РОЗЕТКА С ГОЛОСОВЫМ УПРАВЛЕНИЕМ И ТАЙМЕРОМ', '4 990', NULL, '2025-24'),
  ('rz-pro', 'socket', 'Rozetka Pro', 'РОЗЕТКА С ЗАЩИТОЙ ОТ ПЕРЕГРУЗОК И ДИСТАНЦИОННЫМ УПРАВЛЕНИЕМ', '5 990', NULL, '2025-25'),
  ('rz-mini', 'socket', 'Rozetka Mini', 'КОМПАКТНАЯ РОЗЕТКА ДЛЯ НЕЗАМЕТНОЙ ИНТЕГРАЦИИ В ИНТЕРЬЕР', '3 990', NULL, '2025-26')
) AS seed(id, type, name, "desc", price, specs, serial)
WHERE NOT EXISTS (SELECT 1 FROM products);

-- 7. Начальные демо-отзывы (привязываются к первому зарегистрированному пользователю)
INSERT INTO reviews (user_id, name, model, text)
SELECT
  (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1),
  name, model, text
FROM (VALUES
  ('ОЛЬГА ИВАНОВА', '(MATRYON PLUS 2)', '-Когда бабушка впервые увидела Matryon, она подумала, что это антиквариат. Потом услышала, как она напоминает про лекарства. Теперь она зовет ее "внучкой"'),
  ('АННА ПЕТРОВА', '(MATRYON AIR)', '-Покупала Matryon для мамы. Теперь она сама настраивает будильник голосом и говорит, что это лучший подарок за последние годы.'),
  ('СЕРГЕЙ КОЗЛОВ', '(MATRYON PRO)', '-Купил для всей семьи. Дети в восторге от голосового помощника, а жена оценила дизайн. Матрёшка стала центром нашего дома.'),
  ('ЕЛЕНА СОКОЛОВА', '(MATRYON LIGHT)', '-Световые эффекты поражают! Можно настроить под любое настроение. Matryon стала моим любимым гаджетом в доме.'),
  ('ДМИТРИЙ ВОЛКОВ', '(MATRYON MAX)', '-Звук на высшем уровне! Использую для домашних вечеринок и просто для фоновой музыки. Рекомендую всем друзьям.'),
  ('МАРИЯ СМИРНОВА', '(MATRYON MINI)', '-Купила мини-версию для кухни. Теперь готовить намного веселее, а голосовое управление очень удобно, когда руки заняты.')
) AS seed(name, model, text)
WHERE EXISTS (SELECT 1 FROM auth.users)
  AND NOT EXISTS (SELECT 1 FROM reviews);

-- 8. Storage bucket для аватарок
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars');

-- Разрешаем загрузку авторизованным пользователям
DROP POLICY IF EXISTS "Avatar upload" ON storage.objects;
CREATE POLICY "Avatar upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.role() = 'authenticated'
  );

-- Разрешаем чтение аватарок всем
DROP POLICY IF EXISTS "Avatar public read" ON storage.objects;
CREATE POLICY "Avatar public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Разрешаем обновлять только свои аватарки
DROP POLICY IF EXISTS "Avatar own update" ON storage.objects;
CREATE POLICY "Avatar own update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid() = owner
  );

-- 9. Таблица корзины
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cart items own select" ON cart_items;
CREATE POLICY "Cart items own select" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Cart items own insert" ON cart_items;
CREATE POLICY "Cart items own insert" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Cart items own update" ON cart_items;
CREATE POLICY "Cart items own update" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Cart items own delete" ON cart_items;
CREATE POLICY "Cart items own delete" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- 10. Функция проверки существования email (для регистрации)
CREATE OR REPLACE FUNCTION check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users WHERE email = email_to_check
  );
END;
$$;
