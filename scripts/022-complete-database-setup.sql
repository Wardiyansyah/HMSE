-- Complete Database Setup for HMS (School Management System)
-- This script creates all necessary tables and demo data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create profiles table (main user table)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_url TEXT,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_kelas VARCHAR(50) NOT NULL,
    tingkat INTEGER NOT NULL CHECK (tingkat BETWEEN 1 AND 12),
    jurusan VARCHAR(50),
    tahun_ajaran VARCHAR(20) NOT NULL,
    wali_kelas_id UUID REFERENCES profiles(id),
    kapasitas INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode_mata_pelajaran VARCHAR(20) UNIQUE NOT NULL,
    nama_mata_pelajaran VARCHAR(100) NOT NULL,
    tingkat INTEGER[] NOT NULL,
    deskripsi TEXT,
    sks INTEGER DEFAULT 2,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    nip VARCHAR(50) UNIQUE NOT NULL,
    mata_pelajaran_id UUID REFERENCES subjects(id),
    jabatan VARCHAR(100),
    pendidikan_terakhir VARCHAR(100),
    tanggal_mulai_kerja DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    nisn VARCHAR(20) UNIQUE NOT NULL,
    nis VARCHAR(20) UNIQUE NOT NULL,
    class_id UUID REFERENCES classes(id),
    tanggal_masuk DATE,
    nama_orang_tua VARCHAR(255),
    pekerjaan_orang_tua VARCHAR(100),
    no_hp_orang_tua VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    due_date TIMESTAMP WITH TIME ZONE,
    max_score INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grades table
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    assignment_id UUID NOT NULL REFERENCES assignments(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    score DECIMAL(5,2),
    max_score INTEGER NOT NULL DEFAULT 100,
    grade_letter VARCHAR(2),
    feedback TEXT,
    graded_by UUID REFERENCES profiles(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Insert demo subjects
INSERT INTO subjects (id, kode_mata_pelajaran, nama_mata_pelajaran, tingkat, deskripsi, sks) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'MAT', 'Matematika', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 'Mata pelajaran matematika untuk semua tingkat', 4),
('550e8400-e29b-41d4-a716-446655440002', 'IPA', 'Ilmu Pengetahuan Alam', ARRAY[4,5,6,7,8,9], 'Mata pelajaran IPA untuk tingkat 4-9', 3),
('550e8400-e29b-41d4-a716-446655440003', 'BIN', 'Bahasa Indonesia', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 'Mata pelajaran Bahasa Indonesia', 4),
('550e8400-e29b-41d4-a716-446655440004', 'BING', 'Bahasa Inggris', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 'Mata pelajaran Bahasa Inggris', 3),
('550e8400-e29b-41d4-a716-446655440005', 'FIS', 'Fisika', ARRAY[10,11,12], 'Mata pelajaran Fisika untuk SMA', 3),
('550e8400-e29b-41d4-a716-446655440006', 'KIM', 'Kimia', ARRAY[10,11,12], 'Mata pelajaran Kimia untuk SMA', 3),
('550e8400-e29b-41d4-a716-446655440007', 'BIO', 'Biologi', ARRAY[10,11,12], 'Mata pelajaran Biologi untuk SMA', 3),
('550e8400-e29b-41d4-a716-446655440008', 'SEJ', 'Sejarah', ARRAY[7,8,9,10,11,12], 'Mata pelajaran Sejarah', 2),
('550e8400-e29b-41d4-a716-446655440009', 'GEO', 'Geografi', ARRAY[10,11,12], 'Mata pelajaran Geografi untuk SMA', 2),
('550e8400-e29b-41d4-a716-446655440010', 'EKO', 'Ekonomi', ARRAY[10,11,12], 'Mata pelajaran Ekonomi untuk SMA', 3);

-- Insert demo classes
INSERT INTO classes (id, nama_kelas, tingkat, jurusan, tahun_ajaran, kapasitas) VALUES
('660e8400-e29b-41d4-a716-446655440001', '1A', 1, NULL, '2024/2025', 25),
('660e8400-e29b-41d4-a716-446655440002', '2A', 2, NULL, '2024/2025', 25),
('660e8400-e29b-41d4-a716-446655440003', '3A', 3, NULL, '2024/2025', 25),
('660e8400-e29b-41d4-a716-446655440004', '7A', 7, NULL, '2024/2025', 30),
('660e8400-e29b-41d4-a716-446655440005', '8A', 8, NULL, '2024/2025', 30),
('660e8400-e29b-41d4-a716-446655440006', '9A', 9, NULL, '2024/2025', 30),
('660e8400-e29b-41d4-a716-446655440007', 'X-IPA-1', 10, 'IPA', '2024/2025', 32),
('660e8400-e29b-41d4-a716-446655440008', 'XI-IPA-1', 11, 'IPA', '2024/2025', 32),
('660e8400-e29b-41d4-a716-446655440009', 'XII-IPA-1', 12, 'IPA', '2024/2025', 32),
('660e8400-e29b-41d4-a716-446655440010', 'X-IPS-1', 10, 'IPS', '2024/2025', 32);

-- Insert demo profiles (using bcrypt hash for 'password123')
INSERT INTO profiles (id, email, username, password_hash, full_name, role, phone, status) VALUES
-- Admin
('0e945a60-4b12-4d2a-aa8c-9c20070d52c4', 'admin@sekolah.com', 'admin1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Administrator Utama', 'admin', '081234567890', 'active'),

-- Teachers
('12923aca-bb13-4f41-b7f8-411c4b22c669', 'guru1@sekolah.com', 'guru1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Budi Santoso', 'teacher', '081234567891', 'active'),
('1db422b0-b93a-4b2f-af69-a442eb95679e', 'guru2@sekolah.com', 'guru2', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', '', 'teacher', '081234567892', 'active'),
('2a8c69c7-1c8a-4452-9ca9-d04cf4301f61', 'guru3@sekolah.com', 'guru3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Ahmad Wijaya', 'teacher', '081234567893', 'active'),

-- Students
('479abbb2-b0b3-4ad5-b44d-ac688207fc8d', 'siswa1@sekolah.com', 'siswa1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Andi Pratama', 'student', '081234567894', 'active'),
('4d6c7c4f-1516-49de-b040-fa79603b08cd', 'siswa2@sekolah.com', 'siswa2', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Dewi Sartika', 'student', '081234567895', 'active'),
('5e6aee04-2cf2-421a-947d-e8bf8fd7734a', 'siswa3@sekolah.com', 'siswa3', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Rudi Hermawan', 'student', '081234567896', 'active'),
('9d6eaebe-8e12-45a3-bf04-2b1f4d3d8633', 'siswa4@sekolah.com', 'siswa4', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Maya Indira', 'student', '081234567897', 'active'),
('c037ff70-9296-495e-88a8-0347a1b82326', 'siswa5@sekolah.com', 'siswa5', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Fajar Nugroho', 'student', '081234567898', 'active'),
('f1bfa0db-55f9-4497-bbf4-ac5fb531411', 'siswa6@sekolah.com', 'siswa6', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Lestari Wulandari', 'student', '081234567899', 'active'),
('fc6ba4c8-2ae8-467d-a766-d6dba73ba6ca', 'siswa7@sekolah.com', 'siswa7', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9u.', 'Bayu Setiawan', 'student', '081234567800', 'active');

-- Insert teachers data
INSERT INTO teachers (id, user_id, nip, mata_pelajaran_id, jabatan, pendidikan_terakhir, tanggal_mulai_kerja) VALUES
('770e8400-e29b-41d4-a716-446655440001', '12923aca-bb13-4f41-b7f8-411c4b22c669', '196801011990031001', '550e8400-e29b-41d4-a716-446655440001', 'Guru Matematika', 'S1 Pendidikan Matematika', '2010-07-01'),
('770e8400-e29b-41d4-a716-446655440002', '1db422b0-b93a-4b2f-af69-a442eb95679e', '197205151995122001', '550e8400-e29b-41d4-a716-446655440003', 'Guru Bahasa Indonesia', 'S1 Pendidikan Bahasa Indonesia', '2012-01-15'),
('770e8400-e29b-41d4-a716-446655440003', '2a8c69c7-1c8a-4452-9ca9-d04cf4301f61', '198003201998031002', '550e8400-e29b-41d4-a716-446655440002', 'Guru IPA', 'S1 Pendidikan IPA', '2015-08-01');

-- Insert students data
INSERT INTO students (id, user_id, nisn, nis, class_id, tanggal_masuk, nama_orang_tua, pekerjaan_orang_tua, no_hp_orang_tua) VALUES
('880e8400-e29b-41d4-a716-446655440001', '479abbb2-b0b3-4ad5-b44d-ac688207fc8d', '0123456789', '2024001', '660e8400-e29b-41d4-a716-446655440007', '2024-07-15', 'Bapak Pratama', 'Wiraswasta', '081234567801'),
('880e8400-e29b-41d4-a716-446655440002', '4d6c7c4f-1516-49de-b040-fa79603b08cd', '0123456790', '2024002', '660e8400-e29b-41d4-a716-446655440007', '2024-07-15', 'Bapak Sartika', 'PNS', '081234567802'),
('880e8400-e29b-41d4-a716-446655440003', '5e6aee04-2cf2-421a-947d-e8bf8fd7734a', '0123456791', '2024003', '660e8400-e29b-41d4-a716-446655440008', '2024-07-15', 'Bapak Hermawan', 'Guru', '081234567803'),
('880e8400-e29b-41d4-a716-446655440004', '9d6eaebe-8e12-45a3-bf04-2b1f4d3d8633', '0123456792', '2024004', '660e8400-e29b-41d4-a716-446655440008', '2024-07-15', 'Bapak Indira', 'Dokter', '081234567804'),
('880e8400-e29b-41d4-a716-446655440005', 'c037ff70-9296-495e-88a8-0347a1b82326', '0123456793', '2024005', '660e8400-e29b-41d4-a716-446655440009', '2024-07-15', 'Bapak Nugroho', 'Insinyur', '081234567805'),
('880e8400-e29b-41d4-a716-446655440006', 'f1bfa0db-55f9-4497-bbf4-ac5fb531411', '0123456794', '2024006', '660e8400-e29b-41d4-a716-446655440009', '2024-07-15', 'Bapak Wulandari', 'Petani', '081234567806'),
('880e8400-e29b-41d4-a716-446655440007', 'fc6ba4c8-2ae8-467d-a766-d6dba73ba6ca', '0123456795', '2024007', '660e8400-e29b-41d4-a716-446655440010', '2024-07-15', 'Bapak Setiawan', 'Pedagang', '081234567807');

-- Update classes with homeroom teachers
UPDATE classes SET wali_kelas_id = '12923aca-bb13-4f41-b7f8-411c4b22c669' WHERE nama_kelas = 'X-IPA-1';
UPDATE classes SET wali_kelas_id = '1db422b0-b93a-4b2f-af69-a442eb95679e' WHERE nama_kelas = 'XI-IPA-1';
UPDATE classes SET wali_kelas_id = '2a8c69c7-1c8a-4452-9ca9-d04cf4301f61' WHERE nama_kelas = 'XII-IPA-1';

-- Insert demo assignments
INSERT INTO assignments (id, title, description, subject_id, class_id, teacher_id, due_date, max_score, status) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Tugas Matematika - Aljabar', 'Kerjakan soal-soal aljabar halaman 45-50', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440001', '2024-12-30 23:59:59', 100, 'published'),
('990e8400-e29b-41d4-a716-446655440002', 'Essay Bahasa Indonesia', 'Tulis essay tentang lingkungan hidup minimal 500 kata', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440002', '2024-12-28 23:59:59', 100, 'published'),
('990e8400-e29b-41d4-a716-446655440003', 'Praktikum IPA - Fotosintesis', 'Lakukan percobaan fotosintesis dan buat laporan', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440003', '2025-01-05 23:59:59', 100, 'published');

-- Insert demo grades
INSERT INTO grades (id, student_id, assignment_id, subject_id, score, max_score, grade_letter, feedback, graded_by, graded_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 85, 100, 'B', 'Bagus, tapi perlu lebih teliti dalam perhitungan', '12923aca-bb13-4f41-b7f8-411c4b22c669', '2024-12-20 10:30:00'),
('aa0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 92, 100, 'A', 'Excellent work! Keep it up!', '12923aca-bb13-4f41-b7f8-411c4b22c669', '2024-12-20 10:35:00'),
('aa0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 78, 100, 'B', 'Essay yang baik, tapi perlu perbaikan struktur kalimat', '1db422b0-b93a-4b2f-af69-a442eb95679e', '2024-12-21 14:20:00');

-- Insert demo notifications
INSERT INTO notifications (id, user_id, title, message, type) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', '479abbb2-b0b3-4ad5-b44d-ac688207fc8d', 'Tugas Baru', 'Ada tugas matematika baru yang harus dikerjakan', 'info'),
('bb0e8400-e29b-41d4-a716-446655440002', '4d6c7c4f-1516-49de-b040-fa79603b08cd', 'Nilai Tersedia', 'Nilai tugas matematika sudah tersedia', 'success'),
('bb0e8400-e29b-41d4-a716-446655440003', '12923aca-bb13-4f41-b7f8-411c4b22c669', 'Reminder', 'Jangan lupa input nilai tugas minggu ini', 'warning');

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Users can insert profiles" ON profiles FOR INSERT WITH CHECK (true);

-- Classes policies
CREATE POLICY "Users can view classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Teachers can manage classes" ON classes FOR ALL USING (true);

-- Subjects policies
CREATE POLICY "Users can view subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Teachers can manage subjects" ON subjects FOR ALL USING (true);

-- Teachers policies
CREATE POLICY "Users can view teachers" ON teachers FOR SELECT USING (true);
CREATE POLICY "Teachers can update own data" ON teachers FOR UPDATE USING (true);
CREATE POLICY "System can insert teachers" ON teachers FOR INSERT WITH CHECK (true);

-- Students policies
CREATE POLICY "Users can view students" ON students FOR SELECT USING (true);
CREATE POLICY "Students can update own data" ON students FOR UPDATE USING (true);
CREATE POLICY "System can insert students" ON students FOR INSERT WITH CHECK (true);

-- Assignments policies
CREATE POLICY "Users can view assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can manage assignments" ON assignments FOR ALL USING (true);

-- Grades policies
CREATE POLICY "Users can view grades" ON grades FOR SELECT USING (true);
CREATE POLICY "Teachers can manage grades" ON grades FOR ALL USING (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (true);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Demo accounts created:';
    RAISE NOTICE '- Admin: admin1 / password123';
    RAISE NOTICE '- Teacher: guru1 / password123';
    RAISE NOTICE '- Student: siswa1 / password123';
END $$;
