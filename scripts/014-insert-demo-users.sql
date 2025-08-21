-- Insert Demo Users for K-12 HMS System
-- This script creates demo accounts for testing all functionality

BEGIN;

-- Clear existing demo users (keep admin if exists)
DELETE FROM users WHERE username != 'admin';

-- Insert Admin User
INSERT INTO users (
    username, password_hash, nama, kelas, role, email, no_hp, status
) VALUES (
    'admin', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Administrator Sistem', 
    'ADMIN', 
    'admin', 
    'admin@hms-school.edu', 
    '081234567890', 
    'active'
) ON CONFLICT (username) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    nama = EXCLUDED.nama,
    updated_at = NOW();

-- Insert SD Teachers (3 teachers)
INSERT INTO users (
    username, password_hash, nama, kelas, role, email, no_hp, status
) VALUES 
(
    'guru_sd1', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Siti Nurhaliza', 
    '1A', 
    'teacher', 
    'siti.nurhaliza@hms-school.edu', 
    '081234567891',
    'active'
),
(
    'guru_sd2', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Budi Santoso', 
    '3A', 
    'teacher', 
    'budi.santoso@hms-school.edu', 
    '081234567892',
    'active'
),
(
    'guru_sd3', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Dewi Sartika', 
    '6A', 
    'teacher', 
    'dewi.sartika@hms-school.edu', 
    '081234567893',
    'active'
);

-- Insert SMP Teachers (3 teachers)
INSERT INTO users (
    username, password_hash, nama, kelas, role, email, no_hp, status
) VALUES 
(
    'guru_smp1', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Ahmad Fauzi', 
    '7A', 
    'teacher', 
    'ahmad.fauzi@hms-school.edu', 
    '081234567894',
    'active'
),
(
    'guru_smp2', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Rina Marlina', 
    '8B', 
    'teacher', 
    'rina.marlina@hms-school.edu', 
    '081234567895',
    'active'
),
(
    'guru_smp3', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Hendra Wijaya', 
    '9C', 
    'teacher', 
    'hendra.wijaya@hms-school.edu', 
    '081234567896',
    'active'
);

-- Insert SMA Teachers (3 teachers)
INSERT INTO users (
    username, password_hash, nama, kelas, role, email, no_hp, status
) VALUES 
(
    'guru_sma1', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Dr. Indra Gunawan', 
    'X-IPA-1', 
    'teacher', 
    'indra.gunawan@hms-school.edu', 
    '081234567897',
    'active'
),
(
    'guru_sma2', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Dra. Maya Sari', 
    'XI-IPS-1', 
    'teacher', 
    'maya.sari@hms-school.edu', 
    '081234567898',
    'active'
),
(
    'guru_sma3', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Prof. Bambang Sutrisno', 
    'XII-IPA-2', 
    'teacher', 
    'bambang.sutrisno@hms-school.edu', 
    '081234567899',
    'active'
);

-- Insert SD Students (3 students)
INSERT INTO users (
    username, password_hash, nama, kelas, role, nisn, email, no_hp, alamat, tanggal_lahir, jenis_kelamin, agama, nama_orang_tua, pekerjaan_orang_tua, no_hp_orang_tua, status
) VALUES 
(
    'siswa_sd1', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Andi Pratama', 
    '1A', 
    'student', 
    '1234567890', 
    'andi.pratama@student.hms-school.edu', 
    '081234560001',
    'Jl. Merdeka No. 1, Jakarta', 
    '2017-05-15', 
    'L', 
    'Islam',
    'Budi Pratama', 
    'Pegawai Swasta', 
    '081234560101', 
    'active'
),
(
    'siswa_sd2', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Sari Indah', 
    '3A', 
    'student', 
    '1234567891', 
    'sari.indah@student.hms-school.edu', 
    '081234560002',
    'Jl. Sudirman No. 2, Jakarta', 
    '2015-08-20', 
    'P', 
    'Islam',
    'Indah Sari', 
    'Guru', 
    '081234560102', 
    'active'
),
(
    'siswa_sd3', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Reza Maulana', 
    '6A', 
    'student', 
    '1234567892', 
    'reza.maulana@student.hms-school.edu', 
    '081234560003',
    'Jl. Thamrin No. 3, Jakarta', 
    '2012-12-10', 
    'L', 
    'Islam',
    'Maulana Reza', 
    'Dokter', 
    '081234560103', 
    'active'
);

-- Insert SMP Students (3 students)
INSERT INTO users (
    username, password_hash, nama, kelas, role, nisn, email, no_hp, alamat, tanggal_lahir, jenis_kelamin, agama, nama_orang_tua, pekerjaan_orang_tua, no_hp_orang_tua, status
) VALUES 
(
    'siswa_smp1', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Dina Amelia', 
    '7A', 
    'student', 
    '2234567890', 
    'dina.amelia@student.hms-school.edu', 
    '081234560004',
    'Jl. Gatot Subroto No. 4, Jakarta', 
    '2010-03-25', 
    'P', 
    'Islam',
    'Amelia Dina', 
    'Pengusaha', 
    '081234560104', 
    'active'
),
(
    'siswa_smp2', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Fajar Ramadhan', 
    '8B', 
    'student', 
    '2234567891', 
    'fajar.ramadhan@student.hms-school.edu', 
    '081234560005',
    'Jl. Kuningan No. 5, Jakarta', 
    '2009-07-18', 
    'L', 
    'Islam',
    'Ramadhan Fajar', 
    'Insinyur', 
    '081234560105', 
    'active'
),
(
    'siswa_smp3', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Lila Permata', 
    '9C', 
    'student', 
    '2234567892', 
    'lila.permata@student.hms-school.edu', 
    '081234560006',
    'Jl. Senayan No. 6, Jakarta', 
    '2008-11-30', 
    'P', 
    'Islam',
    'Permata Lila', 
    'Akuntan', 
    '081234560106', 
    'active'
);

-- Insert SMA Students (4 students)
INSERT INTO users (
    username, password_hash, nama, kelas, role, nisn, email, no_hp, alamat, tanggal_lahir, jenis_kelamin, agama, nama_orang_tua, pekerjaan_orang_tua, no_hp_orang_tua, status
) VALUES 
(
    'siswa1', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Arif Hidayat', 
    'X-IPA-1', 
    'student', 
    '3234567890', 
    'arif.hidayat@student.hms-school.edu', 
    '081234560007',
    'Jl. Kemang No. 7, Jakarta', 
    '2007-01-12', 
    'L', 
    'Islam',
    'Hidayat Arif', 
    'Manager', 
    '081234560107', 
    'active'
),
(
    'siswa2', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Putri Maharani', 
    'XI-IPS-1', 
    'student', 
    '3234567891', 
    'putri.maharani@student.hms-school.edu', 
    '081234560008',
    'Jl. Menteng No. 8, Jakarta', 
    '2006-04-22', 
    'P', 
    'Islam',
    'Maharani Putri', 
    'Direktur', 
    '081234560108', 
    'active'
),
(
    'siswa3', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Bayu Setiawan', 
    'XII-IPA-2', 
    'student', 
    '3234567892', 
    'bayu.setiawan@student.hms-school.edu', 
    '081234560009',
    'Jl. Cikini No. 9, Jakarta', 
    '2005-09-08', 
    'L', 
    'Islam',
    'Setiawan Bayu', 
    'Profesor', 
    '081234560109', 
    'active'
),
(
    'siswa4', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSforHgK', -- password123
    'Nadia Safitri', 
    'XII-IPS-1', 
    'student', 
    '3234567893', 
    'nadia.safitri@student.hms-school.edu', 
    '081234560010',
    'Jl. Blok M No. 10, Jakarta', 
    '2005-06-14', 
    'P', 
    'Islam',
    'Safitri Nadia', 
    'Hakim', 
    '081234560110', 
    'active'
);

-- Update classes with wali_kelas_id
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_sd1') WHERE nama_kelas = '1A';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_sd2') WHERE nama_kelas = '3A';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_sd3') WHERE nama_kelas = '6A';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_smp1') WHERE nama_kelas = '7A';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_smp2') WHERE nama_kelas = '8B';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_smp3') WHERE nama_kelas = '9C';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_sma1') WHERE nama_kelas = 'X-IPA-1';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_sma2') WHERE nama_kelas = 'XI-IPS-1';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru_sma3') WHERE nama_kelas = 'XII-IPA-2';

COMMIT;

-- Verify demo users were created
SELECT 'Demo users inserted successfully!' as message,
       COUNT(*) as total_users
FROM users;
