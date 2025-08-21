-- Complete Database Setup Script for HMS K-12 System
-- This script will create all necessary tables and data

-- First, drop all existing tables and policies to start fresh
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow all operations on users" ON public.users;
DROP POLICY IF EXISTS "Allow all operations on classes" ON public.classes;
DROP POLICY IF EXISTS "Allow all operations on subjects" ON public.subjects;
DROP POLICY IF EXISTS "Allow all operations on assignments" ON public.assignments;
DROP POLICY IF EXISTS "Allow all operations on grades" ON public.grades;

-- Create users table
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    nisn VARCHAR(20) UNIQUE,
    no_hp VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    alamat TEXT,
    tanggal_lahir DATE,
    jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')),
    agama VARCHAR(20),
    nama_orang_tua VARCHAR(100),
    pekerjaan_orang_tua VARCHAR(100),
    no_hp_orang_tua VARCHAR(20),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE public.classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_kelas VARCHAR(20) UNIQUE NOT NULL,
    tingkat INTEGER NOT NULL,
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    jurusan VARCHAR(50),
    wali_kelas_id UUID REFERENCES public.users(id),
    tahun_ajaran VARCHAR(20) NOT NULL DEFAULT '2024/2025',
    kapasitas INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_mata_pelajaran VARCHAR(100) NOT NULL,
    kode_mata_pelajaran VARCHAR(20) UNIQUE NOT NULL,
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    tingkat INTEGER[] NOT NULL,
    jurusan VARCHAR(50),
    sks INTEGER DEFAULT 2,
    deskripsi TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    mata_pelajaran VARCHAR(100) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    guru_id UUID REFERENCES public.users(id),
    tanggal_dibuat DATE DEFAULT CURRENT_DATE,
    tanggal_deadline DATE NOT NULL,
    nilai_maksimal INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grades table
CREATE TABLE public.grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    siswa_id UUID REFERENCES public.users(id),
    assignment_id UUID REFERENCES public.assignments(id),
    mata_pelajaran VARCHAR(100) NOT NULL,
    nilai DECIMAL(5,2),
    keterangan TEXT,
    tanggal_nilai DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for now to avoid access issues
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon and authenticated users
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.classes TO anon, authenticated;
GRANT ALL ON public.subjects TO anon, authenticated;
GRANT ALL ON public.assignments TO anon, authenticated;
GRANT ALL ON public.grades TO anon, authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Insert demo classes
INSERT INTO public.classes (nama_kelas, tingkat, jenjang, tahun_ajaran) VALUES
('1A', 1, 'SD', '2024/2025'),
('2A', 2, 'SD', '2024/2025'),
('3A', 3, 'SD', '2024/2025'),
('4A', 4, 'SD', '2024/2025'),
('5A', 5, 'SD', '2024/2025'),
('6A', 6, 'SD', '2024/2025'),
('7A', 7, 'SMP', '2024/2025'),
('8A', 8, 'SMP', '2024/2025'),
('9A', 9, 'SMP', '2024/2025'),
('10A', 10, 'SMA', '2024/2025'),
('11A', 11, 'SMA', '2024/2025'),
('12A', 12, 'SMA', '2024/2025');

-- Insert demo subjects
INSERT INTO public.subjects (nama_mata_pelajaran, kode_mata_pelajaran, jenjang, tingkat) VALUES
('Matematika', 'MTK-SD', 'SD', ARRAY[1,2,3,4,5,6]),
('Bahasa Indonesia', 'BIN-SD', 'SD', ARRAY[1,2,3,4,5,6]),
('IPA', 'IPA-SD', 'SD', ARRAY[4,5,6]),
('IPS', 'IPS-SD', 'SD', ARRAY[4,5,6]),
('Matematika', 'MTK-SMP', 'SMP', ARRAY[7,8,9]),
('Bahasa Indonesia', 'BIN-SMP', 'SMP', ARRAY[7,8,9]),
('IPA', 'IPA-SMP', 'SMP', ARRAY[7,8,9]),
('IPS', 'IPS-SMP', 'SMP', ARRAY[7,8,9]),
('Bahasa Inggris', 'ENG-SMP', 'SMP', ARRAY[7,8,9]),
('Matematika', 'MTK-SMA', 'SMA', ARRAY[10,11,12]),
('Bahasa Indonesia', 'BIN-SMA', 'SMA', ARRAY[10,11,12]),
('Bahasa Inggris', 'ENG-SMA', 'SMA', ARRAY[10,11,12]),
('Fisika', 'FIS-SMA', 'SMA', ARRAY[10,11,12]),
('Kimia', 'KIM-SMA', 'SMA', ARRAY[10,11,12]),
('Biologi', 'BIO-SMA', 'SMA', ARRAY[10,11,12]);

-- Insert demo users with bcrypt hashed passwords (password123)
-- Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO
INSERT INTO public.users (username, password_hash, nama, kelas, role, nisn, no_hp, email, status) VALUES
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Administrator', 'ADMIN', 'admin', NULL, '081234567890', 'admin@hms.com', 'active'),
('guru1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Budi Santoso', 'GURU', 'teacher', NULL, '081234567891', 'budi@hms.com', 'active'),
('guru2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Siti Nurhaliza', 'GURU', 'teacher', NULL, '081234567892', 'siti@hms.com', 'active'),
('siswa1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Ahmad Fauzi', '5A', 'student', '1234567890', '081234567893', 'ahmad@student.com', 'active'),
('siswa2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Fatimah Zahra', '5A', 'student', '1234567891', '081234567894', 'fatimah@student.com', 'active'),
('siswa3', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Muhammad Ali', '8A', 'student', '1234567892', '081234567895', 'ali@student.com', 'active'),
('siswa4', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Aisyah Putri', '11A', 'student', '1234567893', '081234567896', 'aisyah@student.com', 'active');

-- Insert demo assignments
INSERT INTO public.assignments (judul, deskripsi, mata_pelajaran, kelas, guru_id, tanggal_deadline) VALUES
('Latihan Soal Matematika Bab 1', 'Kerjakan soal-soal matematika tentang penjumlahan dan pengurangan', 'Matematika', '5A', (SELECT id FROM public.users WHERE username = 'guru1'), CURRENT_DATE + INTERVAL '7 days'),
('Menulis Karangan Bebas', 'Buatlah karangan bebas dengan tema "Liburan Sekolah" minimal 200 kata', 'Bahasa Indonesia', '5A', (SELECT id FROM public.users WHERE username = 'guru2'), CURRENT_DATE + INTERVAL '5 days'),
('Praktikum IPA - Percobaan Magnet', 'Lakukan percobaan sederhana tentang sifat-sifat magnet dan buat laporan', 'IPA', '5A', (SELECT id FROM public.users WHERE username = 'guru1'), CURRENT_DATE + INTERVAL '10 days'),
('Tugas IPS - Peta Indonesia', 'Gambar peta Indonesia dan sebutkan nama-nama provinsi', 'IPS', '5A', (SELECT id FROM public.users WHERE username = 'guru2'), CURRENT_DATE + INTERVAL '3 days'),
('Latihan Soal Matematika Bab 2', 'Kerjakan soal-soal tentang perkalian dan pembagian', 'Matematika', '5A', (SELECT id FROM public.users WHERE username = 'guru1'), CURRENT_DATE + INTERVAL '14 days');

-- Insert demo grades
INSERT INTO public.grades (siswa_id, assignment_id, mata_pelajaran, nilai, keterangan, tanggal_nilai) VALUES
((SELECT id FROM public.users WHERE username = 'siswa1'), (SELECT id FROM public.assignments WHERE judul = 'Latihan Soal Matematika Bab 1'), 'Matematika', 85.5, 'Pekerjaan bagus! Terus tingkatkan kemampuan matematika.', CURRENT_DATE - INTERVAL '2 days'),
((SELECT id FROM public.users WHERE username = 'siswa1'), (SELECT id FROM public.assignments WHERE judul = 'Menulis Karangan Bebas'), 'Bahasa Indonesia', 92.0, 'Karangan yang sangat menarik dan kreatif. Tata bahasa sudah baik.', CURRENT_DATE - INTERVAL '1 day'),
((SELECT id FROM public.users WHERE username = 'siswa1'), (SELECT id FROM public.assignments WHERE judul = 'Tugas IPS - Peta Indonesia'), 'IPS', 78.0, 'Peta sudah benar, tapi tulisan masih perlu diperbaiki.', CURRENT_DATE - INTERVAL '3 days'),
((SELECT id FROM public.users WHERE username = 'siswa2'), (SELECT id FROM public.assignments WHERE judul = 'Latihan Soal Matematika Bab 1'), 'Matematika', 95.0, 'Excellent! Semua jawaban benar.', CURRENT_DATE - INTERVAL '2 days'),
((SELECT id FROM public.users WHERE username = 'siswa2'), (SELECT id FROM public.assignments WHERE judul = 'Menulis Karangan Bebas'), 'Bahasa Indonesia', 88.5, 'Karangan bagus, ide kreatif.', CURRENT_DATE - INTERVAL '1 day');

-- Create indexes for better performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_kelas ON public.users(kelas);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_assignments_kelas ON public.assignments(kelas);
CREATE INDEX idx_assignments_status ON public.assignments(status);
CREATE INDEX idx_grades_siswa ON public.grades(siswa_id);
CREATE INDEX idx_grades_assignment ON public.grades(assignment_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the setup
SELECT 'Setup completed successfully!' as status;
SELECT 'Users created: ' || count(*) as info FROM public.users;
SELECT 'Classes created: ' || count(*) as info FROM public.classes;
SELECT 'Subjects created: ' || count(*) as info FROM public.subjects;
SELECT 'Assignments created: ' || count(*) as info FROM public.assignments;
SELECT 'Grades created: ' || count(*) as info FROM public.grades;
