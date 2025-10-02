-- Create HMS Database Schema for SD, SMP, SMA
BEGIN;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table (main table for authentication and user data)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    nisn VARCHAR(10) UNIQUE, -- Only for students
    no_hp VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table (SD: 1-6, SMP: 7-9, SMA: 10-12)
CREATE TABLE classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_kelas VARCHAR(20) NOT NULL,
    tingkat INTEGER NOT NULL CHECK (tingkat BETWEEN 1 AND 12),
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    jurusan VARCHAR(50), -- Only for SMA (IPA, IPS, Bahasa, etc.)
    wali_kelas_id UUID REFERENCES users(id),
    tahun_ajaran VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_mapel VARCHAR(100) NOT NULL,
    kode_mapel VARCHAR(10) UNIQUE NOT NULL,
    deskripsi TEXT,
    tingkat INTEGER NOT NULL CHECK (tingkat BETWEEN 1 AND 12),
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    jurusan VARCHAR(50), -- Only for SMA subjects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    mapel_id UUID REFERENCES subjects(id) NOT NULL,
    kelas_id UUID REFERENCES classes(id) NOT NULL,
    guru_id UUID REFERENCES users(id) NOT NULL,
    tanggal_deadline TIMESTAMP WITH TIME ZONE,
    nilai_maksimal INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment_submissions table
CREATE TABLE assignment_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID REFERENCES assignments(id) NOT NULL,
    student_id UUID REFERENCES users(id) NOT NULL,
    konten TEXT,
    file_url TEXT,
    tanggal_submit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- Create grades table
CREATE TABLE grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES users(id) NOT NULL,
    assignment_id UUID REFERENCES assignments(id) NOT NULL,
    mapel_id UUID REFERENCES subjects(id) NOT NULL,
    guru_id UUID REFERENCES users(id) NOT NULL,
    nilai INTEGER NOT NULL CHECK (nilai >= 0),
    nilai_maksimal INTEGER DEFAULT 100,
    komentar TEXT,
    tanggal_dinilai TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, assignment_id)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    judul VARCHAR(200) NOT NULL,
    pesan TEXT NOT NULL,
    tipe VARCHAR(20) DEFAULT 'info' CHECK (tipe IN ('info', 'warning', 'success', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kelas ON users(kelas);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_classes_nama_kelas ON classes(nama_kelas);
CREATE INDEX idx_classes_tingkat ON classes(tingkat);
CREATE INDEX idx_classes_jenjang ON classes(jenjang);
CREATE INDEX idx_subjects_kode_mapel ON subjects(kode_mapel);
CREATE INDEX idx_subjects_jenjang ON subjects(jenjang);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_assignments_guru_id ON assignments(guru_id);
CREATE INDEX idx_assignment_submissions_student_id ON assignment_submissions(student_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignment_submissions_updated_at BEFORE UPDATE ON assignment_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Allow public read access for authentication" ON users
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert for registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (true);

-- Create RLS policies for other tables (allow all for now, can be refined later)
CREATE POLICY "Allow all access to classes" ON classes FOR ALL USING (true);
CREATE POLICY "Allow all access to subjects" ON subjects FOR ALL USING (true);
CREATE POLICY "Allow all access to assignments" ON assignments FOR ALL USING (true);
CREATE POLICY "Allow all access to assignment_submissions" ON assignment_submissions FOR ALL USING (true);
CREATE POLICY "Allow all access to grades" ON grades FOR ALL USING (true);
CREATE POLICY "Allow all access to notifications" ON notifications FOR ALL USING (true);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMIT;
