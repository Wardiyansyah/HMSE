-- Drop existing tables and policies to start fresh
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
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
CREATE TABLE classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_kelas VARCHAR(20) UNIQUE NOT NULL,
    tingkat INTEGER NOT NULL,
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    jurusan VARCHAR(50),
    wali_kelas_id UUID REFERENCES users(id),
    tahun_ajaran VARCHAR(20) NOT NULL,
    kapasitas INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE subjects (
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
CREATE TABLE assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    mapel_id UUID NOT NULL REFERENCES subjects(id),
    kelas_id VARCHAR(20) NOT NULL,
    guru_id UUID NOT NULL REFERENCES users(id),
    tanggal_deadline TIMESTAMP WITH TIME ZONE,
    nilai_maksimal INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grades table
CREATE TABLE grades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES users(id),
    assignment_id UUID NOT NULL REFERENCES assignments(id),
    mapel_id UUID NOT NULL REFERENCES subjects(id),
    guru_id UUID NOT NULL REFERENCES users(id),
    nilai DECIMAL(5,2) NOT NULL,
    nilai_maksimal INTEGER NOT NULL DEFAULT 100,
    komentar TEXT,
    tanggal_dinilai TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, assignment_id)
);

-- Enable RLS (Row Level Security) but with simple policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies that allow all operations for now
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on classes" ON classes FOR ALL USING (true);
CREATE POLICY "Allow all operations on subjects" ON subjects FOR ALL USING (true);
CREATE POLICY "Allow all operations on assignments" ON assignments FOR ALL USING (true);
CREATE POLICY "Allow all operations on grades" ON grades FOR ALL USING (true);

-- Insert demo classes
INSERT INTO classes (nama_kelas, tingkat, jenjang, tahun_ajaran) VALUES
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
INSERT INTO subjects (nama_mata_pelajaran, kode_mata_pelajaran, jenjang, tingkat) VALUES
('Matematika', 'MTK', 'SD', ARRAY[1,2,3,4,5,6]),
('Bahasa Indonesia', 'BIN', 'SD', ARRAY[1,2,3,4,5,6]),
('IPA', 'IPA', 'SD', ARRAY[4,5,6]),
('IPS', 'IPS', 'SD', ARRAY[4,5,6]),
('Matematika', 'MTK-SMP', 'SMP', ARRAY[7,8,9]),
('Bahasa Indonesia', 'BIN-SMP', 'SMP', ARRAY[7,8,9]),
('IPA', 'IPA-SMP', 'SMP', ARRAY[7,8,9]),
('IPS', 'IPS-SMP', 'SMP', ARRAY[7,8,9]),
('Bahasa Inggris', 'ENG-SMP', 'SMP', ARRAY[7,8,9]),
('Matematika', 'MTK-SMA', 'SMA', ARRAY[10,11,12]),
('Bahasa Indonesia', 'BIN-SMA', 'SMA', ARRAY[10,11,12]),
('Bahasa Inggris', 'ENG-SMA', 'SMA', ARRAY[10,11,12]),
('Fisika', 'FIS', 'SMA', ARRAY[10,11,12]),
('Kimia', 'KIM', 'SMA', ARRAY[10,11,12]),
('Biologi', 'BIO', 'SMA', ARRAY[10,11,12]);

-- Insert demo users with bcrypt hashed passwords (password123)
-- Hash for 'password123': $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO
INSERT INTO users (username, password_hash, nama, kelas, role, nisn, no_hp, email, status) VALUES
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Administrator', 'ADMIN', 'admin', NULL, '081234567890', 'admin@hms.com', 'active'),
('guru1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Budi Santoso', 'GURU', 'teacher', NULL, '081234567891', 'budi@hms.com', 'active'),
('guru2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Siti Nurhaliza', 'GURU', 'teacher', NULL, '081234567892', 'siti@hms.com', 'active'),
('siswa1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Ahmad Fauzi', '5A', 'student', '1234567890', '081234567893', 'ahmad@student.com', 'active'),
('siswa2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Fatimah Zahra', '5A', 'student', '1234567891', '081234567894', 'fatimah@student.com', 'active'),
('siswa3', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Muhammad Ali', '8A', 'student', '1234567892', '081234567895', 'ali@student.com', 'active'),
('siswa4', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Aisyah Putri', '11A', 'student', '1234567893', '081234567896', 'aisyah@student.com', 'active');

-- Insert demo assignments
INSERT INTO assignments (judul, deskripsi, mapel_id, kelas_id, guru_id, tanggal_deadline, nilai_maksimal, status)
SELECT 
    'Latihan Soal Matematika Bab 1',
    'Kerjakan soal-soal matematika tentang penjumlahan dan pengurangan',
    s.id,
    '5A',
    u.id,
    NOW() + INTERVAL '7 days',
    100,
    'published'
FROM subjects s, users u 
WHERE s.kode_mata_pelajaran = 'MTK' AND s.jenjang = 'SD' AND u.username = 'guru1'
LIMIT 1;

INSERT INTO assignments (judul, deskripsi, mapel_id, kelas_id, guru_id, tanggal_deadline, nilai_maksimal, status)
SELECT 
    'Menulis Karangan Bebas',
    'Buatlah karangan bebas dengan tema "Liburan Sekolah" minimal 200 kata',
    s.id,
    '5A',
    u.id,
    NOW() + INTERVAL '5 days',
    100,
    'published'
FROM subjects s, users u 
WHERE s.kode_mata_pelajaran = 'BIN' AND s.jenjang = 'SD' AND u.username = 'guru2'
LIMIT 1;

INSERT INTO assignments (judul, deskripsi, mapel_id, kelas_id, guru_id, tanggal_deadline, nilai_maksimal, status)
SELECT 
    'Praktikum IPA - Percobaan Magnet',
    'Lakukan percobaan sederhana tentang sifat-sifat magnet dan buat laporan',
    s.id,
    '5A',
    u.id,
    NOW() + INTERVAL '10 days',
    100,
    'published'
FROM subjects s, users u 
WHERE s.kode_mata_pelajaran = 'IPA' AND s.jenjang = 'SD' AND u.username = 'guru1'
LIMIT 1;

-- Insert demo grades
INSERT INTO grades (student_id, assignment_id, mapel_id, guru_id, nilai, nilai_maksimal, komentar, tanggal_dinilai)
SELECT 
    u.id,
    a.id,
    a.mapel_id,
    a.guru_id,
    85,
    100,
    'Pekerjaan bagus! Terus tingkatkan kemampuan matematika.',
    NOW() - INTERVAL '2 days'
FROM users u, assignments a
WHERE u.username = 'siswa1' AND a.judul = 'Latihan Soal Matematika Bab 1'
LIMIT 1;

INSERT INTO grades (student_id, assignment_id, mapel_id, guru_id, nilai, nilai_maksimal, komentar, tanggal_dinilai)
SELECT 
    u.id,
    a.id,
    a.mapel_id,
    a.guru_id,
    92,
    100,
    'Karangan yang sangat menarik dan kreatif. Tata bahasa sudah baik.',
    NOW() - INTERVAL '1 day'
FROM users u, assignments a
WHERE u.username = 'siswa1' AND a.judul = 'Menulis Karangan Bebas'
LIMIT 1;

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kelas ON users(kelas);
CREATE INDEX idx_assignments_kelas ON assignments(kelas_id);
CREATE INDEX idx_assignments_status ON assignments(status);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_assignment ON grades(assignment_id);

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
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify data
SELECT 'Users created:' as info, count(*) as count FROM users;
SELECT 'Classes created:' as info, count(*) as count FROM classes;
SELECT 'Subjects created:' as info, count(*) as count FROM subjects;
SELECT 'Assignments created:' as info, count(*) as count FROM assignments;
SELECT 'Grades created:' as info, count(*) as count FROM grades;
