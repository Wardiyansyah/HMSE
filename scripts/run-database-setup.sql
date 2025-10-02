-- Script ini akan menjalankan semua setup database yang diperlukan

-- 1. Jalankan script utama untuk membuat tabel
\i scripts/003-create-school-system-tables.sql

-- 2. Jalankan script untuk insert data demo
\i scripts/004-insert-demo-data.sql

-- 3. Verifikasi bahwa semua tabel telah dibuat
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 4. Verifikasi data demo
SELECT 'subjects' as table_name, count(*) as record_count FROM public.subjects
UNION ALL
SELECT 'classes' as table_name, count(*) as record_count FROM public.classes
UNION ALL
SELECT 'profiles' as table_name, count(*) as record_count FROM public.profiles;

-- 5. Tampilkan struktur RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
