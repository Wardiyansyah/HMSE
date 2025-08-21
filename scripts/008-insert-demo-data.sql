-- Insert demo data for HMS system (SD, SMP, SMA)
BEGIN;

-- Insert demo classes for all levels
INSERT INTO classes (nama_kelas, tingkat, jenjang, jurusan, tahun_ajaran) VALUES
-- SD Classes (Kelas 1-6)
('1A', 1, 'SD', NULL, '2024/2025'),
('1B', 1, 'SD', NULL, '2024/2025'),
('2A', 2, 'SD', NULL, '2024/2025'),
('2B', 2, 'SD', NULL, '2024/2025'),
('3A', 3, 'SD', NULL, '2024/2025'),
('3B', 3, 'SD', NULL, '2024/2025'),
('4A', 4, 'SD', NULL, '2024/2025'),
('4B', 4, 'SD', NULL, '2024/2025'),
('5A', 5, 'SD', NULL, '2024/2025'),
('5B', 5, 'SD', NULL, '2024/2025'),
('6A', 6, 'SD', NULL, '2024/2025'),
('6B', 6, 'SD', NULL, '2024/2025'),

-- SMP Classes (Kelas 7-9)
('7A', 7, 'SMP', NULL, '2024/2025'),
('7B', 7, 'SMP', NULL, '2024/2025'),
('7C', 7, 'SMP', NULL, '2024/2025'),
('8A', 8, 'SMP', NULL, '2024/2025'),
('8B', 8, 'SMP', NULL, '2024/2025'),
('8C', 8, 'SMP', NULL, '2024/2025'),
('9A', 9, 'SMP', NULL, '2024/2025'),
('9B', 9, 'SMP', NULL, '2024/2025'),
('9C', 9, 'SMP', NULL, '2024/2025'),

-- SMA Classes (Kelas 10-12)
('X-IPA-1', 10, 'SMA', 'IPA', '2024/2025'),
('X-IPA-2', 10, 'SMA', 'IPA', '2024/2025'),
('X-IPS-1', 10, 'SMA', 'IPS', '2024/2025'),
('X-IPS-2', 10, 'SMA', 'IPS', '2024/2025'),
('XI-IPA-1', 11, 'SMA', 'IPA', '2024/2025'),
('XI-IPA-2', 11, 'SMA', 'IPA', '2024/2025'),
('XI-IPS-1', 11, 'SMA', 'IPS', '2024/2025'),
('XI-IPS-2', 11, 'SMA', 'IPS', '2024/2025'),
('XII-IPA-1', 12, 'SMA', 'IPA', '2024/2025'),
('XII-IPA-2', 12, 'SMA', 'IPA', '2024/2025'),
('XII-IPS-1', 12, 'SMA', 'IPS', '2024/2025'),
('XII-IPS-2', 12, 'SMA', 'IPS', '2024/2025');

-- Insert demo subjects for all levels
INSERT INTO subjects (nama_mapel, kode_mapel, deskripsi, tingkat, jenjang, jurusan) VALUES
-- SD Subjects
('Bahasa Indonesia', 'BI-SD', 'Mata pelajaran Bahasa Indonesia untuk SD', 1, 'SD', NULL),
('Matematika', 'MTK-SD', 'Mata pelajaran Matematika untuk SD', 1, 'SD', NULL),
('IPA', 'IPA-SD', 'Mata pelajaran Ilmu Pengetahuan Alam untuk SD', 4, 'SD', NULL),
('IPS', 'IPS-SD', 'Mata pelajaran Ilmu Pengetahuan Sosial untuk SD', 4, 'SD', NULL),
('PKn', 'PKN-SD', 'Mata pelajaran Pendidikan Kewarganegaraan untuk SD', 1, 'SD', NULL),
('Seni Budaya', 'SB-SD', 'Mata pelajaran Seni Budaya untuk SD', 1, 'SD', NULL),
('Penjas', 'PJ-SD', 'Mata pelajaran Pendidikan Jasmani untuk SD', 1, 'SD', NULL),

-- SMP Subjects
('Bahasa Indonesia', 'BI-SMP', 'Mata pelajaran Bahasa Indonesia untuk SMP', 7, 'SMP', NULL),
('Matematika', 'MTK-SMP', 'Mata pelajaran Matematika untuk SMP', 7, 'SMP', NULL),
('IPA', 'IPA-SMP', 'Mata pelajaran Ilmu Pengetahuan Alam untuk SMP', 7, 'SMP', NULL),
('IPS', 'IPS-SMP', 'Mata pelajaran Ilmu Pengetahuan Sosial untuk SMP', 7, 'SMP', NULL),
('Bahasa Inggris', 'BIG-SMP', 'Mata pelajaran Bahasa Inggris untuk SMP', 7, 'SMP', NULL),
('PKn', 'PKN-SMP', 'Mata pelajaran Pendidikan Kewarganegaraan untuk SMP', 7, 'SMP', NULL),
('Seni Budaya', 'SB-SMP', 'Mata pelajaran Seni Budaya untuk SMP', 7, 'SMP', NULL),
('Penjas', 'PJ-SMP', 'Mata pelajaran Pendidikan Jasmani untuk SMP', 7, 'SMP', NULL),
('Prakarya', 'PK-SMP', 'Mata pelajaran Prakarya untuk SMP', 7, 'SMP', NULL),

-- SMA Subjects - Common
('Bahasa Indonesia', 'BI-SMA', 'Mata pelajaran Bahasa Indonesia untuk SMA', 10, 'SMA', NULL),
('Matematika', 'MTK-SMA', 'Mata pelajaran Matematika untuk SMA', 10, 'SMA', NULL),
('Bahasa Inggris', 'BIG-SMA', 'Mata pelajaran Bahasa Inggris untuk SMA', 10, 'SMA', NULL),
('PKn', 'PKN-SMA', 'Mata pelajaran Pendidikan Kewarganegaraan untuk SMA', 10, 'SMA', NULL),
('Sejarah', 'SEJ-SMA', 'Mata pelajaran Sejarah untuk SMA', 10, 'SMA', NULL),
('Seni Budaya', 'SB-SMA', 'Mata pelajaran Seni Budaya untuk SMA', 10, 'SMA', NULL),
('Penjas', 'PJ-SMA', 'Mata pelajaran Pendidikan Jasmani untuk SMA', 10, 'SMA', NULL),

-- SMA IPA Subjects
('Fisika', 'FIS', 'Mata pelajaran Fisika untuk SMA IPA', 10, 'SMA', 'IPA'),
('Kimia', 'KIM', 'Mata pelajaran Kimia untuk SMA IPA', 10, 'SMA', 'IPA'),
('Biologi', 'BIO', 'Mata pelajaran Biologi untuk SMA IPA', 10, 'SMA', 'IPA'),

-- SMA IPS Subjects
('Geografi', 'GEO', 'Mata pelajaran Geografi untuk SMA IPS', 10, 'SMA', 'IPS'),
('Ekonomi', 'EKO', 'Mata pelajaran Ekonomi untuk SMA IPS', 10, 'SMA', 'IPS'),
('Sosiologi', 'SOS', 'Mata pelajaran Sosiologi untuk SMA IPS', 11, 'SMA', 'IPS');

-- Insert demo users (passwords are hashed version of 'password123')
-- Note: In real implementation, use proper bcrypt hashing
INSERT INTO users (username, password_hash, nama, kelas, role, nisn, no_hp, email) VALUES
-- Admin
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Administrator HMS', 'Admin', 'admin', NULL, '081234567890', 'admin@hms.sch.id'),

-- Teachers
('guru1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Siti Nurhaliza, S.Pd', 'Guru', 'teacher', NULL, '081234567891', 'siti.nurhaliza@hms.sch.id'),
('guru2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Budi Santoso, S.Pd', 'Guru', 'teacher', NULL, '081234567892', 'budi.santoso@hms.sch.id'),
('guru3', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Ahmad Fauzi, S.Si', 'Guru', 'teacher', NULL, '081234567893', 'ahmad.fauzi@hms.sch.id'),
('guru4', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Dewi Sartika, S.Sos', 'Guru', 'teacher', NULL, '081234567894', 'dewi.sartika@hms.sch.id'),

-- Students SD
('siswa_sd1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Andi Pratama', '1A', 'student', '1234567890', '081234567895', 'andi.pratama@student.hms.sch.id'),
('siswa_sd2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Sari Indah', '3A', 'student', '1234567891', '081234567896', 'sari.indah@student.hms.sch.id'),
('siswa_sd3', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Rizki Ramadhan', '6A', 'student', '1234567892', '081234567897', 'rizki.ramadhan@student.hms.sch.id'),

-- Students SMP
('siswa_smp1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Maya Sari', '7A', 'student', '1234567893', '081234567898', 'maya.sari@student.hms.sch.id'),
('siswa_smp2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Fajar Nugroho', '8B', 'student', '1234567894', '081234567899', 'fajar.nugroho@student.hms.sch.id'),
('siswa_smp3', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Indah Permata', '9C', 'student', '1234567895', '081234567900', 'indah.permata@student.hms.sch.id'),

-- Students SMA
('siswa1', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Dian Sastro', 'X-IPA-1', 'student', '1234567896', '081234567901', 'dian.sastro@student.hms.sch.id'),
('siswa2', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Bayu Skak', 'XI-IPS-1', 'student', '1234567897', '081234567902', 'bayu.skak@student.hms.sch.id'),
('siswa3', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrOrBiW', 'Cinta Laura', 'XII-IPA-2', 'student', '1234567898', '081234567903', 'cinta.laura@student.hms.sch.id');

-- Update classes with wali kelas
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru1') WHERE nama_kelas = '1A';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru2') WHERE nama_kelas = '7A';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru3') WHERE nama_kelas = 'X-IPA-1';
UPDATE classes SET wali_kelas_id = (SELECT id FROM users WHERE username = 'guru4') WHERE nama_kelas = 'XI-IPS-1';

-- Insert demo assignments
INSERT INTO assignments (judul, deskripsi, mapel_id, kelas_id, guru_id, tanggal_deadline, nilai_maksimal, status) VALUES
('Tugas Membaca', 'Membaca cerita pendek dan menjawab pertanyaan', 
 (SELECT id FROM subjects WHERE kode_mapel = 'BI-SD'), 
 (SELECT id FROM classes WHERE nama_kelas = '1A'), 
 (SELECT id FROM users WHERE username = 'guru1'), 
 NOW() + INTERVAL '7 days', 100, 'published'),

('Quiz Matematika', 'Quiz tentang penjumlahan dan pengurangan', 
 (SELECT id FROM subjects WHERE kode_mapel = 'MTK-SMP'), 
 (SELECT id FROM classes WHERE nama_kelas = '7A'), 
 (SELECT id FROM users WHERE username = 'guru2'), 
 NOW() + INTERVAL '3 days', 100, 'published'),

('Praktikum Fisika', 'Percobaan tentang gerak lurus beraturan', 
 (SELECT id FROM subjects WHERE kode_mapel = 'FIS'), 
 (SELECT id FROM classes WHERE nama_kelas = 'X-IPA-1'), 
 (SELECT id FROM users WHERE username = 'guru3'), 
 NOW() + INTERVAL '14 days', 100, 'published');

-- Insert demo notifications
INSERT INTO notifications (user_id, judul, pesan, tipe) VALUES
((SELECT id FROM users WHERE username = 'siswa_sd1'), 'Tugas Baru', 'Ada tugas baru di mata pelajaran Bahasa Indonesia', 'info'),
((SELECT id FROM users WHERE username = 'siswa_smp1'), 'Quiz Besok', 'Jangan lupa quiz Matematika besok!', 'warning'),
((SELECT id FROM users WHERE username = 'siswa1'), 'Praktikum', 'Praktikum Fisika minggu depan, siapkan alat tulis', 'info');

COMMIT;

-- Display summary
SELECT 'Demo data inserted successfully!' as message;
SELECT 'Users created:' as info, COUNT(*) as count FROM users;
SELECT 'Classes created:' as info, COUNT(*) as count FROM classes;
SELECT 'Subjects created:' as info, COUNT(*) as count FROM subjects;
SELECT 'Assignments created:' as info, COUNT(*) as count FROM assignments;
SELECT 'Notifications created:' as info, COUNT(*) as count FROM notifications;

-- Show class distribution
SELECT 'Class Distribution:' as info;
SELECT jenjang, COUNT(*) as jumlah_kelas FROM classes GROUP BY jenjang ORDER BY jenjang;
