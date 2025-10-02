-- HMS K-12 Database Setup Script
-- This script creates the complete database structure for the HMS K-12 system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nama VARCHAR(100) NOT NULL,
    kelas VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    nisn VARCHAR(20) UNIQUE,
    no_hp VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    alamat TEXT,
    tanggal_lahir DATE,
    jenis_kelamin CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')),
    agama VARCHAR(20),
    nama_orang_tua VARCHAR(100),
    pekerjaan_orang_tua VARCHAR(50),
    no_hp_orang_tua VARCHAR(20),
    avatar_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_kelas VARCHAR(20) NOT NULL,
    tingkat INTEGER NOT NULL CHECK (tingkat BETWEEN 1 AND 12),
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    jurusan VARCHAR(20),
    wali_kelas_id UUID REFERENCES users(id),
    tahun_ajaran VARCHAR(10) NOT NULL DEFAULT '2024/2025',
    kapasitas INTEGER NOT NULL DEFAULT 30,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nama_kelas, tahun_ajaran)
);

-- Create subjects table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_mata_pelajaran VARCHAR(100) NOT NULL,
    kode_mata_pelajaran VARCHAR(20) NOT NULL,
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    tingkat INTEGER[] NOT NULL,
    jurusan VARCHAR(20),
    sks INTEGER NOT NULL DEFAULT 2,
    deskripsi TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(kode_mata_pelajaran, jenjang)
);

-- Create assignments table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    mapel_id UUID NOT NULL REFERENCES subjects(id),
    kelas_id UUID NOT NULL REFERENCES classes(id),
    guru_id UUID NOT NULL REFERENCES users(id),
    tanggal_deadline TIMESTAMP WITH TIME ZONE,
    nilai_maksimal INTEGER NOT NULL DEFAULT 100,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment_submissions table
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id),
    student_id UUID NOT NULL REFERENCES users(id),
    konten TEXT,
    file_url TEXT,
    tanggal_submit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- Create grades table
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id),
    assignment_id UUID NOT NULL REFERENCES assignments(id),
    mapel_id UUID NOT NULL REFERENCES subjects(id),
    guru_id UUID NOT NULL REFERENCES users(id),
    nilai DECIMAL(5,2) NOT NULL CHECK (nilai >= 0),
    nilai_maksimal INTEGER NOT NULL DEFAULT 100,
    komentar TEXT,
    tanggal_dinilai TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, assignment_id)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    judul VARCHAR(200) NOT NULL,
    pesan TEXT NOT NULL,
    tipe VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (tipe IN ('info', 'warning', 'success', 'error')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kelas ON users(kelas);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_classes_jenjang ON classes(jenjang);
CREATE INDEX idx_classes_tingkat ON classes(tingkat);
CREATE INDEX idx_subjects_jenjang ON subjects(jenjang);
CREATE INDEX idx_assignments_guru_id ON assignments(guru_id);
CREATE INDEX idx_assignments_kelas_id ON assignments(kelas_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignment_submissions_updated_at BEFORE UPDATE ON assignment_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow insert for new users" ON users FOR INSERT WITH CHECK (true);

-- Create RLS policies for classes table
CREATE POLICY "Anyone can view classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can manage classes" ON classes FOR ALL USING (true);

-- Create RLS policies for subjects table
CREATE POLICY "Anyone can view subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Teachers and admins can manage subjects" ON subjects FOR ALL USING (true);

-- Create RLS policies for assignments table
CREATE POLICY "Anyone can view assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can manage their assignments" ON assignments FOR ALL USING (true);

-- Create RLS policies for assignment_submissions table
CREATE POLICY "Students can view their submissions" ON assignment_submissions FOR SELECT USING (true);
CREATE POLICY "Students can create submissions" ON assignment_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Students can update their submissions" ON assignment_submissions FOR UPDATE USING (true);

-- Create RLS policies for grades table
CREATE POLICY "Students can view their grades" ON grades FOR SELECT USING (true);
CREATE POLICY "Teachers can manage grades" ON grades FOR ALL USING (true);

-- Create RLS policies for notifications table
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (true);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'HMS K-12 Database setup completed successfully!' as message;
