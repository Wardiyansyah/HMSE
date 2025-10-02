-- HMS K-12 Complete Database Setup
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

-- Insert K-12 Classes Data
INSERT INTO classes (nama_kelas, tingkat, jenjang, jurusan, tahun_ajaran, kapasitas) VALUES
-- SD Classes (Kelas 1-6)
('1A', 1, 'SD', NULL, '2024/2025', 25),
('1B', 1, 'SD', NULL, '2024/2025', 25),
('2A', 2, 'SD', NULL, '2024/2025', 25),
('2B', 2, 'SD', NULL, '2024/2025', 25),
('3A', 3, 'SD', NULL, '2024/2025', 25),
('3B', 3, 'SD', NULL, '2024/2025', 25),
('4A', 4, 'SD', NULL, '2024/2025', 25),
('4B', 4, 'SD', NULL, '2024/2025', 25),
('5A', 5, 'SD', NULL, '2024/2025', 25),
('5B', 5, 'SD', NULL, '2024/2025', 25),
('6A', 6, 'SD', NULL, '2024/2025', 25),
('6B', 6, 'SD', NULL, '2024/2025', 25),

-- SMP Classes (Kelas 7-9)
('7A', 7, 'SMP', NULL, '2024/2025', 30),
('7B', 7, 'SMP', NULL, '2024/2025', 30),
('7C', 7, 'SMP', NULL, '2024/2025', 30),
('8A', 8, 'SMP', NULL, '2024/2025', 30),
('8B', 8, 'SMP', NULL, '2024/2025', 30),
('8C', 8, 'SMP', NULL, '2024/2025', 30),
('9A', 9, 'SMP', NULL, '2024/2025', 30),
('9B', 9, 'SMP', NULL, '2024/2025', 30),
('9C', 9, 'SMP', NULL, '2024/2025', 30),

-- SMA Classes (Kelas 10-12)
('10 IPA 1', 10, 'SMA', 'IPA', '2024/2025', 32),
('10 IPA 2', 10, 'SMA', 'IPA', '2024/2025', 32),
('10 IPS 1', 10, 'SMA', 'IPS', '2024/2025', 32),
('10 IPS 2', 10, 'SMA', 'IPS', '2024/2025', 32),
('11 IPA 1', 11, 'SMA', 'IPA', '2024/2025', 32),
('11 IPA 2', 11, 'SMA', 'IPA', '2024/2025', 32),
('11 IPS 1', 11, 'SMA', 'IPS', '2024/2025', 32),
('11 IPS 2', 11, 'SMA', 'IPS', '2024/2025', 32),
('12 IPA 1', 12, 'SMA', 'IPA', '2024/2025', 32),
('12 IPA 2', 12, 'SMA', 'IPA', '2024/2025', 32),
('12 IPS 1', 12, 'SMA', 'IPS', '2024/2025', 32),
('12 IPS 2', 12, 'SMA', 'IPS', '2024/2025', 32);

-- Insert K-12 Subjects Data
INSERT INTO subjects (nama_mata_pelajaran, kode_mata_pelajaran, jenjang, tingkat, jurusan, sks, deskripsi) VALUES
-- SD Subjects
('Bahasa Indonesia', 'BI_SD', 'SD', '{1,2,3,4,5,6}', NULL, 6, 'Mata pelajaran Bahasa Indonesia untuk SD'),
('Matematika', 'MAT_SD', 'SD', '{1,2,3,4,5,6}', NULL, 6, 'Mata pelajaran Matematika untuk SD'),
('IPA', 'IPA_SD', 'SD', '{4,5,6}', NULL, 4, 'Ilmu Pengetahuan Alam untuk SD kelas 4-6'),
('IPS', 'IPS_SD', 'SD', '{4,5,6}', NULL, 4, 'Ilmu Pengetahuan Sosial untuk SD kelas 4-6'),
('PKn', 'PKN_SD', 'SD', '{1,2,3,4,5,6}', NULL, 2, 'Pendidikan Kewarganegaraan untuk SD'),
('Agama', 'AG_SD', 'SD', '{1,2,3,4,5,6}', NULL, 2, 'Pendidikan Agama untuk SD'),
('Seni Budaya', 'SB_SD', 'SD', '{1,2,3,4,5,6}', NULL, 2, 'Seni Budaya dan Prakarya untuk SD'),
('PJOK', 'PJOK_SD', 'SD', '{1,2,3,4,5,6}', NULL, 2, 'Pendidikan Jasmani Olahraga dan Kesehatan untuk SD'),

-- SMP Subjects
('Bahasa Indonesia', 'BI_SMP', 'SMP', '{7,8,9}', NULL, 4, 'Mata pelajaran Bahasa Indonesia untuk SMP'),
('Bahasa Inggris', 'BING_SMP', 'SMP', '{7,8,9}', NULL, 4, 'Mata pelajaran Bahasa Inggris untuk SMP'),
('Matematika', 'MAT_SMP', 'SMP', '{7,8,9}', NULL, 4, 'Mata pelajaran Matematika untuk SMP'),
('IPA', 'IPA_SMP', 'SMP', '{7,8,9}', NULL, 5, 'Ilmu Pengetahuan Alam untuk SMP'),
('IPS', 'IPS_SMP', 'SMP', '{7,8,9}', NULL, 4, 'Ilmu Pengetahuan Sosial untuk SMP'),
('PKn', 'PKN_SMP', 'SMP', '{7,8,9}', NULL, 3, 'Pendidikan Kewarganegaraan untuk SMP'),
('Agama', 'AG_SMP', 'SMP', '{7,8,9}', NULL, 3, 'Pendidikan Agama untuk SMP'),
('Seni Budaya', 'SB_SMP', 'SMP', '{7,8,9}', NULL, 3, 'Seni Budaya untuk SMP'),
('PJOK', 'PJOK_SMP', 'SMP', '{7,8,9}', NULL, 3, 'Pendidikan Jasmani Olahraga dan Kesehatan untuk SMP'),
('Prakarya', 'PK_SMP', 'SMP', '{7,8,9}', NULL, 2, 'Prakarya untuk SMP'),

-- SMA Subjects - Common
('Bahasa Indonesia', 'BI_SMA', 'SMA', '{10,11,12}', NULL, 4, 'Mata pelajaran Bahasa Indonesia untuk SMA'),
('Bahasa Inggris', 'BING_SMA', 'SMA', '{10,11,12}', NULL, 3, 'Mata pelajaran Bahasa Inggris untuk SMA'),
('Matematika Wajib', 'MAT_W_SMA', 'SMA', '{10,11,12}', NULL, 4, 'Matematika Wajib untuk SMA'),
('Sejarah Indonesia', 'SEJ_SMA', 'SMA', '{10,11,12}', NULL, 3, 'Sejarah Indonesia untuk SMA'),
('PKn', 'PKN_SMA', 'SMA', '{10,11,12}', NULL, 2, 'Pendidikan Kewarganegaraan untuk SMA'),
('Agama', 'AG_SMA', 'SMA', '{10,11,12}', NULL, 3, 'Pendidikan Agama untuk SMA'),
('PJOK', 'PJOK_SMA', 'SMA', '{10,11,12}', NULL, 3, 'Pendidikan Jasmani Olahraga dan Kesehatan untuk SMA'),
('Seni Budaya', 'SB_SMA', 'SMA', '{10,11,12}', NULL, 2, 'Seni Budaya untuk SMA'),

-- SMA IPA Subjects
('Matematika Peminatan', 'MAT_P_IPA', 'SMA', '{10,11,12}', 'IPA', 4, 'Matematika Peminatan untuk IPA'),
('Fisika', 'FIS_SMA', 'SMA', '{10,11,12}', 'IPA', 4, 'Fisika untuk SMA IPA'),
('Kimia', 'KIM_SMA', 'SMA', '{10,11,12}', 'IPA', 4, 'Kimia untuk SMA IPA'),
('Biologi', 'BIO_SMA', 'SMA', '{10,11,12}', 'IPA', 4, 'Biologi untuk SMA IPA'),

-- SMA IPS Subjects
('Geografi', 'GEO_SMA', 'SMA', '{10,11,12}', 'IPS', 4, 'Geografi untuk SMA IPS'),
('Sejarah Peminatan', 'SEJ_P_IPS', 'SMA', '{10,11,12}', 'IPS', 4, 'Sejarah Peminatan untuk IPS'),
('Sosiologi', 'SOS_SMA', 'SMA', '{10,11,12}', 'IPS', 4, 'Sosiologi untuk SMA IPS'),
('Ekonomi', 'EKO_SMA', 'SMA', '{10,11,12}', 'IPS', 4, 'Ekonomi untuk SMA IPS');

-- Insert Demo Users with bcrypt hashed passwords (password123)
INSERT INTO users (username, password_hash, nama, kelas, role, nisn, no_hp, email, alamat, tanggal_lahir, jenis_kelamin, agama, nama_orang_tua, pekerjaan_orang_tua, no_hp_orang_tua, status) VALUES
-- Admin Users
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator HMS', 'Admin', 'admin', NULL, '081234567890', 'admin@hms.sch.id', 'Jl. Pendidikan No. 1', '1985-01-01', 'L', 'Islam', NULL, NULL, NULL, 'active'),

-- Teacher Users
('guru_sd1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Siti Nurhaliza', 'Guru SD', 'teacher', NULL, '081234567891', 'siti@hms.sch.id', 'Jl. Guru No. 1', '1980-05-15', 'P', 'Islam', NULL, NULL, NULL, 'active'),
('guru_sd2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmad Fauzi', 'Guru SD', 'teacher', NULL, '081234567892', 'ahmad@hms.sch.id', 'Jl. Guru No. 2', '1982-08-20', 'L', 'Islam', NULL, NULL, NULL, 'active'),
('guru_smp1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dewi Sartika', 'Guru SMP', 'teacher', NULL, '081234567893', 'dewi@hms.sch.id', 'Jl. Guru No. 3', '1978-12-10', 'P', 'Kristen', NULL, NULL, NULL, 'active'),
('guru_smp2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Budi Santoso', 'Guru SMP', 'teacher', NULL, '081234567894', 'budi@hms.sch.id', 'Jl. Guru No. 4', '1975-03-25', 'L', 'Islam', NULL, NULL, NULL, 'active'),
('guru_sma1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Ratna Sari', 'Guru SMA', 'teacher', NULL, '081234567895', 'ratna@hms.sch.id', 'Jl. Guru No. 5', '1970-07-18', 'P', 'Hindu', NULL, NULL, NULL, 'active'),
('guru_sma2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Prof. Joko Widodo', 'Guru SMA', 'teacher', NULL, '081234567896', 'joko@hms.sch.id', 'Jl. Guru No. 6', '1968-11-30', 'L', 'Islam', NULL, NULL, NULL, 'active'),

-- Student Users - SD
('siswa_sd1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Andi Pratama', '1A', 'student', '2018001001', '081234567897', 'andi@student.hms.sch.id', 'Jl. Siswa SD No. 1', '2012-04-15', 'L', 'Islam', 'Bapak Andi', 'Pegawai Swasta', '081234567801', 'active'),
('siswa_sd2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sari Indah', '2A', 'student', '2017002001', '081234567898', 'sari@student.hms.sch.id', 'Jl. Siswa SD No. 2', '2011-08-22', 'P', 'Kristen', 'Ibu Sari', 'Guru', '081234567802', 'active'),
('siswa_sd3', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Budi Kecil', '3A', 'student', '2016003001', '081234567899', 'budikecil@student.hms.sch.id', 'Jl. Siswa SD No. 3', '2010-12-05', 'L', 'Islam', 'Bapak Budi', 'Wiraswasta', '081234567803', 'active'),

-- Student Users - SMP
('siswa_smp1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maya Sari', '7A', 'student', '2011007001', '081234567900', 'maya@student.hms.sch.id', 'Jl. Siswa SMP No. 1', '2007-06-10', 'P', 'Islam', 'Ibu Maya', 'Dokter', '081234567804', 'active'),
('siswa_smp2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rudi Hartono', '8B', 'student', '2010008001', '081234567901', 'rudi@student.hms.sch.id', 'Jl. Siswa SMP No. 2', '2006-09-18', 'L', 'Kristen', 'Bapak Rudi', 'Insinyur', '081234567805', 'active'),
('siswa_smp3', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lina Marlina', '9C', 'student', '2009009001', '081234567902', 'lina@student.hms.sch.id', 'Jl. Siswa SMP No. 3', '2005-02-28', 'P', 'Hindu', 'Ibu Lina', 'Pengacara', '081234567806', 'active'),

-- Student Users - SMA
('siswa1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Agus Setiawan', '12 IPA 1', 'student', '2006010001', '081234567903', 'agus@student.hms.sch.id', 'Jl. Siswa SMA No. 1', '2004-03-12', 'L', 'Islam', 'Bapak Agus', 'PNS', '081234567807', 'active'),
('siswa_sma2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Putri Ayu', '11 IPS 1', 'student', '2007011001', '081234567904', 'putri@student.hms.sch.id', 'Jl. Siswa SMA No. 2', '2005-07-25', 'P', 'Islam', 'Ibu Putri', 'Dosen', '081234567808', 'active'),
('siswa_sma3', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Doni Prasetyo', '10 IPA 2', 'student', '2008012001', '081234567905', 'doni@student.hms.sch.id', 'Jl. Siswa SMA No. 3', '2006-11-08', 'L', 'Kristen', 'Bapak Doni', 'Pilot', '081234567809', 'active');

-- Insert Sample Assignments
INSERT INTO assignments (judul, deskripsi, mapel_id, kelas_id, guru_id, tanggal_deadline, nilai_maksimal, status) VALUES
('Tugas Matematika Bab 1', 'Kerjakan soal-soal tentang bilangan bulat', 
 (SELECT id FROM subjects WHERE kode_mata_pelajaran = 'MAT_SMA' LIMIT 1),
 (SELECT id FROM classes WHERE nama_kelas = '12 IPA 1' LIMIT 1),
 (SELECT id FROM users WHERE username = 'guru_sma1' LIMIT 1),
 NOW() + INTERVAL '7 days', 100, 'published'),

('Essay Bahasa Indonesia', 'Tulis essay tentang kemerdekaan Indonesia dengan minimal 500 kata',
 (SELECT id FROM subjects WHERE kode_mata_pelajaran = 'BI_SMA' LIMIT 1),
 (SELECT id FROM classes WHERE nama_kelas = '12 IPA 1' LIMIT 1),
 (SELECT id FROM users WHERE username = 'guru_sma2' LIMIT 1),
 NOW() + INTERVAL '5 days', 100, 'published'),

('Praktikum Fisika', 'Laporan praktikum tentang hukum Newton',
 (SELECT id FROM subjects WHERE kode_mata_pelajaran = 'FIS_SMA' LIMIT 1),
 (SELECT id FROM classes WHERE nama_kelas = '12 IPA 1' LIMIT 1),
 (SELECT id FROM users WHERE username = 'guru_sma1' LIMIT 1),
 NOW() + INTERVAL '10 days', 100, 'published');

-- Insert Sample Grades
INSERT INTO grades (student_id, assignment_id, mapel_id, guru_id, nilai, nilai_maksimal, komentar, tanggal_dinilai) VALUES
((SELECT id FROM users WHERE username = 'siswa1' LIMIT 1),
 (SELECT id FROM assignments WHERE judul = 'Tugas Matematika Bab 1' LIMIT 1),
 (SELECT id FROM subjects WHERE kode_mata_pelajaran = 'MAT_SMA' LIMIT 1),
 (SELECT id FROM users WHERE username = 'guru_sma1' LIMIT 1),
 85, 100, 'Bagus, tapi masih ada beberapa kesalahan perhitungan', NOW() - INTERVAL '2 days'),

((SELECT id FROM users WHERE username = 'siswa1' LIMIT 1),
 (SELECT id FROM assignments WHERE judul = 'Essay Bahasa Indonesia' LIMIT 1),
 (SELECT id FROM subjects WHERE kode_mata_pelajaran = 'BI_SMA' LIMIT 1),
 (SELECT id FROM users WHERE username = 'guru_sma2' LIMIT 1),
 92, 100, 'Essay yang sangat baik, struktur dan isi sudah tepat', NOW() - INTERVAL '1 day');

-- Insert Sample Notifications
INSERT INTO notifications (user_id, judul, pesan, tipe, is_read) VALUES
((SELECT id FROM users WHERE username = 'siswa1' LIMIT 1),
 'Tugas Baru: Praktikum Fisika',
 'Anda mendapat tugas baru dari mata pelajaran Fisika. Deadline: 10 hari lagi.',
 'info', false),

((SELECT id FROM users WHERE username = 'siswa1' LIMIT 1),
 'Nilai Sudah Keluar',
 'Nilai untuk tugas Essay Bahasa Indonesia sudah tersedia. Nilai Anda: 92/100',
 'success', false),

((SELECT id FROM users WHERE username = 'siswa1' LIMIT 1),
 'Deadline Mendekat',
 'Tugas Essay Bahasa Indonesia akan berakhir dalam 2 hari. Segera kumpulkan!',
 'warning', true);

-- Success message
SELECT 'HMS K-12 Database setup completed successfully!' as message,
       (SELECT COUNT(*) FROM users) as total_users,
       (SELECT COUNT(*) FROM classes) as total_classes,
       (SELECT COUNT(*) FROM subjects) as total_subjects,
       (SELECT COUNT(*) FROM assignments) as total_assignments;

-- Show demo accounts
SELECT 'Demo Accounts Available:' as info,
       username,
       nama,
       role,
       kelas
FROM users 
WHERE username IN ('admin', 'guru_sd1', 'guru_smp1', 'guru_sma1', 'siswa1', 'siswa_sd1', 'siswa_smp1')
ORDER BY role, username;
