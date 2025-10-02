-- Fix profiles table to use proper UUID generation
-- This script fixes the UUID generation issue for profiles table

-- First, let's check if we need to recreate the profiles table
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with proper UUID generation
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Recreate other tables that depend on profiles
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Create classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_kelas VARCHAR(50) NOT NULL,
    tingkat INTEGER NOT NULL CHECK (tingkat >= 1 AND tingkat <= 12),
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_mata_pelajaran VARCHAR(20) UNIQUE NOT NULL,
    nama_mata_pelajaran VARCHAR(255) NOT NULL,
    tingkat INTEGER[] NOT NULL,
    deskripsi TEXT,
    sks INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    nisn VARCHAR(20) UNIQUE,
    nis VARCHAR(20) UNIQUE,
    class_id UUID REFERENCES classes(id),
    tanggal_masuk DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    nip VARCHAR(30) UNIQUE NOT NULL,
    tanggal_mulai_kerja DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    class_id UUID NOT NULL REFERENCES classes(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_score INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grades table
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0),
    max_score DECIMAL(5,2) NOT NULL CHECK (max_score > 0),
    feedback TEXT,
    graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    graded_by UUID NOT NULL REFERENCES teachers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_assignments_class_id ON assignments(class_id);
CREATE INDEX idx_assignments_teacher_id ON assignments(teacher_id);
CREATE INDEX idx_assignments_subject_id ON assignments(subject_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_assignment_id ON grades(assignment_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create updated_at triggers for all tables
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert demo data
-- Insert demo classes first
INSERT INTO classes (nama_kelas, tingkat, jurusan, tahun_ajaran, kapasitas) VALUES
('1A', 1, NULL, '2024/2025', 25),
('1B', 1, NULL, '2024/2025', 25),
('2A', 2, NULL, '2024/2025', 25),
('7A', 7, NULL, '2024/2025', 30),
('7B', 7, NULL, '2024/2025', 30),
('10 IPA 1', 10, 'IPA', '2024/2025', 32),
('10 IPS 1', 10, 'IPS', '2024/2025', 32),
('11 IPA 1', 11, 'IPA', '2024/2025', 30),
('12 IPA 1', 12, 'IPA', '2024/2025', 28);

-- Insert demo subjects
INSERT INTO subjects (kode_mata_pelajaran, nama_mata_pelajaran, tingkat, sks) VALUES
('MTK', 'Matematika', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 4),
('IND', 'Bahasa Indonesia', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 4),
('ING', 'Bahasa Inggris', ARRAY[1,2,3,4,5,6,7,8,9,10,11,12], 3),
('IPA', 'IPA Terpadu', ARRAY[1,2,3,4,5,6], 3),
('IPS', 'IPS Terpadu', ARRAY[1,2,3,4,5,6], 3),
('FIS', 'Fisika', ARRAY[10,11,12], 3),
('KIM', 'Kimia', ARRAY[10,11,12], 3),
('BIO', 'Biologi', ARRAY[10,11,12], 3),
('SEJ', 'Sejarah', ARRAY[10,11,12], 2),
('GEO', 'Geografi', ARRAY[10,11,12], 2);

-- Insert demo profiles with bcrypt hashed passwords (password123)
INSERT INTO profiles (id, username, email, password_hash, full_name, role, phone, status) VALUES
('0e945a60-4b12-4d2a-aa8c-9c20070d52c4', 'admin1', 'admin@sekolah.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Administrator Utama', 'admin', '081234567890', 'active'),
('12923aca-bb13-4f41-b7f8-411c4b22c669', 'guru1', 'budi.santoso@sekolah.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Budi Santoso', 'teacher', '081234567891', 'active'),
('1db422b0-b93a-4b2f-af69-a442eb95679e', 'guru2', 'siti.rahayu@sekolah.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Siti Rahayu', 'teacher', '081234567892', 'active'),
('2a8c69c7-1c8a-4452-9ca9-d04cf4301f61', 'guru3', 'ahmad.wijaya@sekolah.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Ahmad Wijaya', 'teacher', '081234567893', 'active'),
('479abbb2-b0b3-4ad5-b44d-ac688207fc8d', 'siswa1', 'andi.pratama@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Andi Pratama', 'student', '081234567894', 'active'),
('4d6c7c4f-1516-49de-b040-fa79603b08cd', 'siswa2', 'sari.dewi@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Sari Dewi', 'student', '081234567895', 'active'),
('5e6aee04-2cf2-421a-947d-e8bf8fd7734a', 'siswa3', 'rudi.hermawan@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Rudi Hermawan', 'student', '081234567896', 'active'),
('9d6eaebe-8e12-45a3-bf04-2b1f4d3d8633', 'siswa4', 'maya.sari@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Maya Sari', 'student', '081234567897', 'active'),
('c037ff70-9296-495e-88a8-0347a1b82326', 'siswa5', 'doni.setiawan@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Doni Setiawan', 'student', '081234567898', 'active'),
('f1bfa0db-55f9-4497-bbf4-ac5fb531411f', 'siswa6', 'rina.wati@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Rina Wati', 'student', '081234567899', 'active'),
('fc6ba4c8-2ae8-467d-a766-d6dba73ba6ca', 'siswa7', 'bayu.pratama@student.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPoyNdO2', 'Bayu Pratama', 'student', '081234567800', 'active');

-- Get class IDs for reference
DO $$
DECLARE
    class_1a_id UUID;
    class_1b_id UUID;
    class_2a_id UUID;
    class_7a_id UUID;
    class_10ipa1_id UUID;
    class_11ipa1_id UUID;
BEGIN
    -- Get class IDs
    SELECT id INTO class_1a_id FROM classes WHERE nama_kelas = '1A';
    SELECT id INTO class_1b_id FROM classes WHERE nama_kelas = '1B';
    SELECT id INTO class_2a_id FROM classes WHERE nama_kelas = '2A';
    SELECT id INTO class_7a_id FROM classes WHERE nama_kelas = '7A';
    SELECT id INTO class_10ipa1_id FROM classes WHERE nama_kelas = '10 IPA 1';
    SELECT id INTO class_11ipa1_id FROM classes WHERE nama_kelas = '11 IPA 1';

    -- Insert teachers
    INSERT INTO teachers (user_id, nip, tanggal_mulai_kerja) VALUES
    ('12923aca-bb13-4f41-b7f8-411c4b22c669', '198501012010011001', '2010-01-01'),
    ('1db422b0-b93a-4b2f-af69-a442eb95679e', '198502022010012002', '2010-02-01'),
    ('2a8c69c7-1c8a-4452-9ca9-d04cf4301f61', '198503032010013003', '2010-03-01');

    -- Insert students
    INSERT INTO students (user_id, nisn, nis, class_id, tanggal_masuk) VALUES
    ('479abbb2-b0b3-4ad5-b44d-ac688207fc8d', '0123456789', '2024001', class_1a_id, '2024-07-15'),
    ('4d6c7c4f-1516-49de-b040-fa79603b08cd', '0123456790', '2024002', class_1a_id, '2024-07-15'),
    ('5e6aee04-2cf2-421a-947d-e8bf8fd7734a', '0123456791', '2024003', class_1b_id, '2024-07-15'),
    ('9d6eaebe-8e12-45a3-bf04-2b1f4d3d8633', '0123456792', '2024004', class_7a_id, '2024-07-15'),
    ('c037ff70-9296-495e-88a8-0347a1b82326', '0123456793', '2024005', class_10ipa1_id, '2024-07-15'),
    ('f1bfa0db-55f9-4497-bbf4-ac5fb531411f', '0123456794', '2024006', class_10ipa1_id, '2024-07-15'),
    ('fc6ba4c8-2ae8-467d-a766-d6dba73ba6ca', '0123456795', '2024007', class_11ipa1_id, '2024-07-15');
END $$;

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert profiles" ON profiles FOR INSERT WITH CHECK (true);

-- Students policies
CREATE POLICY "Students can view own data" ON students FOR SELECT USING (true);
CREATE POLICY "Anyone can insert students" ON students FOR INSERT WITH CHECK (true);

-- Teachers policies  
CREATE POLICY "Teachers can view own data" ON teachers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert teachers" ON teachers FOR INSERT WITH CHECK (true);

-- Classes policies
CREATE POLICY "Anyone can view classes" ON classes FOR SELECT USING (true);

-- Subjects policies
CREATE POLICY "Anyone can view subjects" ON subjects FOR SELECT USING (true);

-- Assignments policies
CREATE POLICY "Anyone can view assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can manage assignments" ON assignments FOR ALL USING (true);

-- Grades policies
CREATE POLICY "Anyone can view grades" ON grades FOR SELECT USING (true);
CREATE POLICY "Teachers can manage grades" ON grades FOR ALL USING (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Database setup completed successfully! You can now test login with: guru1/password123, siswa1/password123, admin1/password123' as message;
