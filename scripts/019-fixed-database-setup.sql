-- Complete Database Setup Script for HMS (School Management System)
-- This script creates all necessary tables and inserts demo data

-- Drop existing tables and policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;

DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.grades CASCADE;
DROP TABLE IF EXISTS public.assignments CASCADE;
DROP TABLE IF EXISTS public.teachers CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table (main authentication table)
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
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
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (for Supabase compatibility)
CREATE TABLE public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE public.classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_kelas VARCHAR(50) NOT NULL,
    tingkat INTEGER NOT NULL,
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    jurusan VARCHAR(50),
    wali_kelas_id UUID,
    tahun_ajaran VARCHAR(20) NOT NULL,
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

-- Create students table
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    class_id UUID REFERENCES public.classes(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE public.teachers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    specialization VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    hire_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES public.subjects(id),
    class_id UUID REFERENCES public.classes(id),
    teacher_id UUID REFERENCES public.teachers(id),
    due_date TIMESTAMP WITH TIME ZONE,
    max_score INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grades table
CREATE TABLE public.grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id),
    assignment_id UUID REFERENCES public.assignments(id),
    subject_id UUID REFERENCES public.subjects(id),
    teacher_id UUID REFERENCES public.teachers(id),
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL DEFAULT 100,
    grade_type VARCHAR(20) DEFAULT 'assignment' CHECK (grade_type IN ('assignment', 'quiz', 'exam', 'project')),
    comments TEXT,
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE public.submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID REFERENCES public.assignments(id),
    student_id UUID REFERENCES public.students(id),
    content TEXT,
    file_url TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'graded')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert demo classes
INSERT INTO public.classes (nama_kelas, tingkat, jenjang, tahun_ajaran, kapasitas) VALUES
('1-A', 1, 'SD', '2024/2025', 25),
('1-B', 1, 'SD', '2024/2025', 25),
('2-A', 2, 'SD', '2024/2025', 25),
('3-A', 3, 'SD', '2024/2025', 25),
('4-A', 4, 'SD', '2024/2025', 25),
('5-A', 5, 'SD', '2024/2025', 25),
('6-A', 6, 'SD', '2024/2025', 25),
('7-A', 7, 'SMP', '2024/2025', 30),
('7-B', 7, 'SMP', '2024/2025', 30),
('8-A', 8, 'SMP', '2024/2025', 30),
('8-B', 8, 'SMP', '2024/2025', 30),
('9-A', 9, 'SMP', '2024/2025', 30),
('9-B', 9, 'SMP', '2024/2025', 30),
('X-IPA-1', 10, 'SMA', '2024/2025', 32),
('X-IPA-2', 10, 'SMA', '2024/2025', 32),
('X-IPS-1', 10, 'SMA', '2024/2025', 32),
('XI-IPA-1', 11, 'SMA', '2024/2025', 32),
('XI-IPA-2', 11, 'SMA', '2024/2025', 32),
('XI-IPS-1', 11, 'SMA', '2024/2025', 32),
('XII-IPA-1', 12, 'SMA', '2024/2025', 32),
('XII-IPA-2', 12, 'SMA', '2024/2025', 32),
('XII-IPS-1', 12, 'SMA', '2024/2025', 32);

-- Insert demo subjects
INSERT INTO public.subjects (nama_mata_pelajaran, kode_mata_pelajaran, jenjang, tingkat, sks) VALUES
-- SD Subjects
('Bahasa Indonesia', 'BI-SD', 'SD', ARRAY[1,2,3,4,5,6], 6),
('Matematika', 'MAT-SD', 'SD', ARRAY[1,2,3,4,5,6], 6),
('IPA', 'IPA-SD', 'SD', ARRAY[4,5,6], 4),
('IPS', 'IPS-SD', 'SD', ARRAY[4,5,6], 3),
('PKn', 'PKN-SD', 'SD', ARRAY[1,2,3,4,5,6], 2),
('Agama', 'AG-SD', 'SD', ARRAY[1,2,3,4,5,6], 3),
('Seni Budaya', 'SB-SD', 'SD', ARRAY[1,2,3,4,5,6], 2),
('Penjas', 'PJ-SD', 'SD', ARRAY[1,2,3,4,5,6], 3),

-- SMP Subjects
('Bahasa Indonesia', 'BI-SMP', 'SMP', ARRAY[7,8,9], 6),
('Matematika', 'MAT-SMP', 'SMP', ARRAY[7,8,9], 6),
('IPA', 'IPA-SMP', 'SMP', ARRAY[7,8,9], 5),
('IPS', 'IPS-SMP', 'SMP', ARRAY[7,8,9], 4),
('Bahasa Inggris', 'ENG-SMP', 'SMP', ARRAY[7,8,9], 4),
('PKn', 'PKN-SMP', 'SMP', ARRAY[7,8,9], 3),
('Agama', 'AG-SMP', 'SMP', ARRAY[7,8,9], 3),
('Seni Budaya', 'SB-SMP', 'SMP', ARRAY[7,8,9], 2),
('Penjas', 'PJ-SMP', 'SMP', ARRAY[7,8,9], 3),
('Prakarya', 'PK-SMP', 'SMP', ARRAY[7,8,9], 2),

-- SMA Subjects
('Bahasa Indonesia', 'BI-SMA', 'SMA', ARRAY[10,11,12], 4),
('Matematika', 'MAT-SMA', 'SMA', ARRAY[10,11,12], 4),
('Bahasa Inggris', 'ENG-SMA', 'SMA', ARRAY[10,11,12], 3),
('PKn', 'PKN-SMA', 'SMA', ARRAY[10,11,12], 2),
('Agama', 'AG-SMA', 'SMA', ARRAY[10,11,12], 3),
('Sejarah', 'SEJ-SMA', 'SMA', ARRAY[10,11,12], 3),
('Seni Budaya', 'SB-SMA', 'SMA', ARRAY[10,11,12], 2),
('Penjas', 'PJ-SMA', 'SMA', ARRAY[10,11,12], 3),

-- SMA IPA Subjects
('Fisika', 'FIS-SMA', 'SMA', ARRAY[10,11,12], 4),
('Kimia', 'KIM-SMA', 'SMA', ARRAY[10,11,12], 4),
('Biologi', 'BIO-SMA', 'SMA', ARRAY[10,11,12], 4),

-- SMA IPS Subjects
('Geografi', 'GEO-SMA', 'SMA', ARRAY[10,11,12], 4),
('Ekonomi', 'EKO-SMA', 'SMA', ARRAY[10,11,12], 4),
('Sosiologi', 'SOS-SMA', 'SMA', ARRAY[10,11,12], 3);

-- Insert demo users with hashed passwords
INSERT INTO public.users (username, password_hash, nama, kelas, role, nisn, no_hp, email, status) VALUES
-- Students
('siswa1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Ahmad Rizki', '7-A', 'student', '1234567890', '081234567890', 'ahmad.rizki@student.com', 'active'),
('siswa2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Siti Nurhaliza', '7-A', 'student', '1234567891', '081234567891', 'siti.nurhaliza@student.com', 'active'),
('siswa3', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Budi Santoso', '8-A', 'student', '1234567892', '081234567892', 'budi.santoso@student.com', 'active'),
('siswa4', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Dewi Sartika', '9-A', 'student', '1234567893', '081234567893', 'dewi.sartika@student.com', 'active'),
('siswa5', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Andi Wijaya', 'X-IPA-1', 'student', '1234567894', '081234567894', 'andi.wijaya@student.com', 'active'),

-- Teachers
('guru1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Dr. Sari Indah', 'Guru', 'teacher', NULL, '081234567895', 'sari.indah@teacher.com', 'active'),
('guru2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Prof. Bambang Sutrisno', 'Guru', 'teacher', NULL, '081234567896', 'bambang.sutrisno@teacher.com', 'active'),
('guru3', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Dra. Ratna Sari', 'Guru', 'teacher', NULL, '081234567897', 'ratna.sari@teacher.com', 'active'),

-- Admin
('admin1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/k/K', 'Administrator', 'Admin', 'admin', NULL, '081234567898', 'admin@school.com', 'active');

-- Create profiles for all users
INSERT INTO public.profiles (user_id, full_name, email, role)
SELECT id, nama, email, role FROM public.users;

-- Get class and user IDs for foreign key references
DO $$
DECLARE
    class_7a_id UUID;
    class_8a_id UUID;
    class_9a_id UUID;
    class_x_ipa1_id UUID;
    
    user_siswa1_id UUID;
    user_siswa2_id UUID;
    user_siswa3_id UUID;
    user_siswa4_id UUID;
    user_siswa5_id UUID;
    
    user_guru1_id UUID;
    user_guru2_id UUID;
    user_guru3_id UUID;
    
    teacher1_id UUID;
    teacher2_id UUID;
    teacher3_id UUID;
    
    student1_id UUID;
    student2_id UUID;
    student3_id UUID;
    student4_id UUID;
    student5_id UUID;
    
    subject_math_smp_id UUID;
    subject_ipa_smp_id UUID;
    subject_bing_smp_id UUID;
    subject_math_sma_id UUID;
    subject_fisika_id UUID;
    
    assignment1_id UUID;
    assignment2_id UUID;
    assignment3_id UUID;
BEGIN
    -- Get class IDs
    SELECT id INTO class_7a_id FROM public.classes WHERE nama_kelas = '7-A';
    SELECT id INTO class_8a_id FROM public.classes WHERE nama_kelas = '8-A';
    SELECT id INTO class_9a_id FROM public.classes WHERE nama_kelas = '9-A';
    SELECT id INTO class_x_ipa1_id FROM public.classes WHERE nama_kelas = 'X-IPA-1';
    
    -- Get user IDs
    SELECT id INTO user_siswa1_id FROM public.users WHERE username = 'siswa1';
    SELECT id INTO user_siswa2_id FROM public.users WHERE username = 'siswa2';
    SELECT id INTO user_siswa3_id FROM public.users WHERE username = 'siswa3';
    SELECT id INTO user_siswa4_id FROM public.users WHERE username = 'siswa4';
    SELECT id INTO user_siswa5_id FROM public.users WHERE username = 'siswa5';
    
    SELECT id INTO user_guru1_id FROM public.users WHERE username = 'guru1';
    SELECT id INTO user_guru2_id FROM public.users WHERE username = 'guru2';
    SELECT id INTO user_guru3_id FROM public.users WHERE username = 'guru3';
    
    -- Insert teachers
    INSERT INTO public.teachers (user_id, employee_id, specialization) VALUES
    (user_guru1_id, 'T001', 'Matematika'),
    (user_guru2_id, 'T002', 'IPA'),
    (user_guru3_id, 'T003', 'Bahasa Inggris');
    
    -- Get teacher IDs
    SELECT id INTO teacher1_id FROM public.teachers WHERE employee_id = 'T001';
    SELECT id INTO teacher2_id FROM public.teachers WHERE employee_id = 'T002';
    SELECT id INTO teacher3_id FROM public.teachers WHERE employee_id = 'T003';
    
    -- Insert students
    INSERT INTO public.students (user_id, student_id, class_id) VALUES
    (user_siswa1_id, 'S001', class_7a_id),
    (user_siswa2_id, 'S002', class_7a_id),
    (user_siswa3_id, 'S003', class_8a_id),
    (user_siswa4_id, 'S004', class_9a_id),
    (user_siswa5_id, 'S005', class_x_ipa1_id);
    
    -- Get student IDs
    SELECT id INTO student1_id FROM public.students WHERE student_id = 'S001';
    SELECT id INTO student2_id FROM public.students WHERE student_id = 'S002';
    SELECT id INTO student3_id FROM public.students WHERE student_id = 'S003';
    SELECT id INTO student4_id FROM public.students WHERE student_id = 'S004';
    SELECT id INTO student5_id FROM public.students WHERE student_id = 'S005';
    
    -- Get subject IDs
    SELECT id INTO subject_math_smp_id FROM public.subjects WHERE kode_mata_pelajaran = 'MAT-SMP';
    SELECT id INTO subject_ipa_smp_id FROM public.subjects WHERE kode_mata_pelajaran = 'IPA-SMP';
    SELECT id INTO subject_bing_smp_id FROM public.subjects WHERE kode_mata_pelajaran = 'ENG-SMP';
    SELECT id INTO subject_math_sma_id FROM public.subjects WHERE kode_mata_pelajaran = 'MAT-SMA';
    SELECT id INTO subject_fisika_id FROM public.subjects WHERE kode_mata_pelajaran = 'FIS-SMA';
    
    -- Insert assignments
    INSERT INTO public.assignments (title, description, subject_id, class_id, teacher_id, due_date, max_score, status) VALUES
    ('Latihan Aljabar Dasar', 'Kerjakan soal-soal aljabar pada buku halaman 45-50', subject_math_smp_id, class_7a_id, teacher1_id, NOW() + INTERVAL '7 days', 100, 'published'),
    ('Praktikum Fotosintesis', 'Lakukan percobaan fotosintesis dan buat laporan', subject_ipa_smp_id, class_8a_id, teacher2_id, NOW() + INTERVAL '14 days', 100, 'published'),
    ('Essay: My Future Dreams', 'Write an essay about your future dreams (minimum 200 words)', subject_bing_smp_id, class_9a_id, teacher3_id, NOW() + INTERVAL '10 days', 100, 'published'),
    ('Persamaan Kuadrat', 'Selesaikan soal-soal persamaan kuadrat', subject_math_sma_id, class_x_ipa1_id, teacher1_id, NOW() + INTERVAL '5 days', 100, 'published'),
    ('Hukum Newton', 'Analisis penerapan hukum Newton dalam kehidupan sehari-hari', subject_fisika_id, class_x_ipa1_id, teacher2_id, NOW() + INTERVAL '12 days', 100, 'published');
    
    -- Get assignment IDs
    SELECT id INTO assignment1_id FROM public.assignments WHERE title = 'Latihan Aljabar Dasar';
    SELECT id INTO assignment2_id FROM public.assignments WHERE title = 'Praktikum Fotosintesis';
    SELECT id INTO assignment3_id FROM public.assignments WHERE title = 'Essay: My Future Dreams';
    
    -- Insert some grades
    INSERT INTO public.grades (student_id, assignment_id, subject_id, teacher_id, score, max_score, grade_type, comments) VALUES
    (student1_id, assignment1_id, subject_math_smp_id, teacher1_id, 85, 100, 'assignment', 'Bagus, tapi masih ada beberapa kesalahan perhitungan'),
    (student2_id, assignment1_id, subject_math_smp_id, teacher1_id, 92, 100, 'assignment', 'Excellent work! Keep it up'),
    (student3_id, assignment2_id, subject_ipa_smp_id, teacher2_id, 88, 100, 'assignment', 'Laporan lengkap dan rapi'),
    (student4_id, assignment3_id, subject_bing_smp_id, teacher3_id, 90, 100, 'assignment', 'Good grammar and vocabulary usage'),
    (student1_id, NULL, subject_math_smp_id, teacher1_id, 78, 100, 'quiz', 'Quiz Bab 1 - Perlu lebih banyak latihan'),
    (student2_id, NULL, subject_math_smp_id, teacher1_id, 95, 100, 'quiz', 'Quiz Bab 1 - Sangat baik!'),
    (student3_id, NULL, subject_ipa_smp_id, teacher2_id, 82, 100, 'quiz', 'Quiz Fotosintesis - Cukup baik'),
    (student4_id, NULL, subject_bing_smp_id, teacher3_id, 87, 100, 'quiz', 'Vocabulary Quiz - Good job'),
    (student5_id, NULL, subject_math_sma_id, teacher1_id, 91, 100, 'quiz', 'Quiz Fungsi - Excellent understanding');
    
    -- Insert some submissions
    INSERT INTO public.submissions (assignment_id, student_id, content, status, submitted_at) VALUES
    (assignment1_id, student1_id, 'Jawaban soal aljabar: 1. x = 5, 2. y = 3, 3. z = 7...', 'submitted', NOW() - INTERVAL '2 days'),
    (assignment1_id, student2_id, 'Penyelesaian lengkap dengan langkah-langkah: 1. x = 5 (cara: ...)...', 'submitted', NOW() - INTERVAL '1 day'),
    (assignment2_id, student3_id, 'Laporan Praktikum Fotosintesis: Tujuan, Alat dan Bahan, Prosedur...', 'submitted', NOW() - INTERVAL '3 days'),
    (assignment3_id, student4_id, 'My Future Dreams: I want to become a doctor because...', 'submitted', NOW() - INTERVAL '1 day');
    
END $$;

-- Add foreign key constraints after data insertion
ALTER TABLE public.classes ADD CONSTRAINT fk_classes_wali_kelas 
    FOREIGN KEY (wali_kelas_id) REFERENCES public.teachers(id);

-- Disable RLS (Row Level Security) for all tables
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create indexes for better performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_students_class_id ON public.students(class_id);
CREATE INDEX idx_assignments_class_id ON public.assignments(class_id);
CREATE INDEX idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX idx_grades_student_id ON public.grades(student_id);
CREATE INDEX idx_grades_assignment_id ON public.grades(assignment_id);
CREATE INDEX idx_submissions_assignment_id ON public.submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON public.submissions(student_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Demo accounts created:';
    RAISE NOTICE '- Students: siswa1, siswa2, siswa3, siswa4, siswa5 (password: password123)';
    RAISE NOTICE '- Teachers: guru1, guru2, guru3 (password: password123)';
    RAISE NOTICE '- Admin: admin1 (password: password123)';
    RAISE NOTICE 'You can now test the login functionality.';
END $$;
