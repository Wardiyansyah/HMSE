-- Insert K-12 Subjects Data
-- This script inserts all subjects for SD, SMP, and SMA levels

-- Insert SD Subjects (Grades 1-6)
INSERT INTO subjects (nama_mata_pelajaran, kode_mata_pelajaran, jenjang, tingkat, sks, deskripsi, status) VALUES
-- Core SD subjects
('Pendidikan Agama Islam', 'PAI-SD', 'SD', ARRAY[1,2,3,4,5,6], 2, 'Pendidikan agama Islam untuk tingkat SD', 'active'),
('Pendidikan Pancasila dan Kewarganegaraan', 'PPKn-SD', 'SD', ARRAY[1,2,3,4,5,6], 2, 'Pendidikan karakter dan kewarganegaraan', 'active'),
('Bahasa Indonesia', 'BIND-SD', 'SD', ARRAY[1,2,3,4,5,6], 4, 'Bahasa Indonesia untuk tingkat SD', 'active'),
('Matematika', 'MAT-SD', 'SD', ARRAY[1,2,3,4,5,6], 4, 'Matematika dasar untuk tingkat SD', 'active'),
('Ilmu Pengetahuan Alam', 'IPA-SD', 'SD', ARRAY[3,4,5,6], 3, 'Sains dasar untuk kelas 3-6 SD', 'active'),
('Ilmu Pengetahuan Sosial', 'IPS-SD', 'SD', ARRAY[3,4,5,6], 3, 'Pengetahuan sosial untuk kelas 3-6 SD', 'active'),
('Seni Budaya dan Prakarya', 'SBP-SD', 'SD', ARRAY[1,2,3,4,5,6], 2, 'Seni, budaya, dan prakarya', 'active'),
('Pendidikan Jasmani, Olahraga, dan Kesehatan', 'PJOK-SD', 'SD', ARRAY[1,2,3,4,5,6], 2, 'Pendidikan jasmani dan kesehatan', 'active'),
('Bahasa Inggris', 'BING-SD', 'SD', ARRAY[4,5,6], 2, 'Bahasa Inggris untuk kelas 4-6 SD', 'active'),

-- Insert SMP Subjects (Grades 7-9)
('Pendidikan Agama Islam', 'PAI-SMP', 'SMP', ARRAY[7,8,9], 3, 'Pendidikan agama Islam untuk tingkat SMP', 'active'),
('Pendidikan Pancasila dan Kewarganegaraan', 'PPKn-SMP', 'SMP', ARRAY[7,8,9], 3, 'Pendidikan karakter dan kewarganegaraan SMP', 'active'),
('Bahasa Indonesia', 'BIND-SMP', 'SMP', ARRAY[7,8,9], 4, 'Bahasa Indonesia untuk tingkat SMP', 'active'),
('Matematika', 'MAT-SMP', 'SMP', ARRAY[7,8,9], 4, 'Matematika untuk tingkat SMP', 'active'),
('Ilmu Pengetahuan Alam', 'IPA-SMP', 'SMP', ARRAY[7,8,9], 4, 'Sains terpadu untuk tingkat SMP', 'active'),
('Ilmu Pengetahuan Sosial', 'IPS-SMP', 'SMP', ARRAY[7,8,9], 4, 'Pengetahuan sosial terpadu SMP', 'active'),
('Bahasa Inggris', 'BING-SMP', 'SMP', ARRAY[7,8,9], 3, 'Bahasa Inggris untuk tingkat SMP', 'active'),
('Seni Budaya', 'SB-SMP', 'SMP', ARRAY[7,8,9], 2, 'Seni budaya untuk tingkat SMP', 'active'),
('Pendidikan Jasmani, Olahraga, dan Kesehatan', 'PJOK-SMP', 'SMP', ARRAY[7,8,9], 2, 'Pendidikan jasmani SMP', 'active'),
('Prakarya', 'PK-SMP', 'SMP', ARRAY[7,8,9], 2, 'Prakarya dan kewirausahaan SMP', 'active'),
('Teknologi Informasi dan Komunikasi', 'TIK-SMP', 'SMP', ARRAY[7,8,9], 2, 'Teknologi informasi SMP', 'active'),

-- Insert SMA Core Subjects (All majors)
('Pendidikan Agama Islam', 'PAI-SMA', 'SMA', ARRAY[10,11,12], 3, 'Pendidikan agama Islam SMA', 'active'),
('Pendidikan Pancasila dan Kewarganegaraan', 'PPKn-SMA', 'SMA', ARRAY[10,11,12], 2, 'PPKn untuk tingkat SMA', 'active'),
('Bahasa Indonesia', 'BIND-SMA', 'SMA', ARRAY[10,11,12], 4, 'Bahasa Indonesia SMA', 'active'),
('Matematika Wajib', 'MAT-W-SMA', 'SMA', ARRAY[10,11,12], 4, 'Matematika wajib untuk semua jurusan', 'active'),
('Sejarah Indonesia', 'SEJ-SMA', 'SMA', ARRAY[10,11,12], 2, 'Sejarah Indonesia wajib', 'active'),
('Bahasa Inggris', 'BING-SMA', 'SMA', ARRAY[10,11,12], 3, 'Bahasa Inggris SMA', 'active'),
('Seni Budaya', 'SB-SMA', 'SMA', ARRAY[10,11,12], 2, 'Seni budaya SMA', 'active'),
('Pendidikan Jasmani, Olahraga, dan Kesehatan', 'PJOK-SMA', 'SMA', ARRAY[10,11,12], 2, 'PJOK SMA', 'active'),
('Prakarya dan Kewirausahaan', 'PKK-SMA', 'SMA', ARRAY[10,11,12], 2, 'Prakarya dan kewirausahaan', 'active'),

-- Insert SMA IPA Subjects
('Matematika Peminatan', 'MAT-P-IPA', 'SMA', ARRAY[10,11,12], 'IPA', 4, 'Matematika peminatan IPA', 'active'),
('Fisika', 'FIS-SMA', 'SMA', ARRAY[10,11,12], 'IPA', 4, 'Fisika untuk jurusan IPA', 'active'),
('Kimia', 'KIM-SMA', 'SMA', ARRAY[10,11,12], 'IPA', 4, 'Kimia untuk jurusan IPA', 'active'),
('Biologi', 'BIO-SMA', 'SMA', ARRAY[10,11,12], 'IPA', 4, 'Biologi untuk jurusan IPA', 'active'),

-- Insert SMA IPS Subjects
('Geografi', 'GEO-SMA', 'SMA', ARRAY[10,11,12], 'IPS', 4, 'Geografi untuk jurusan IPS', 'active'),
('Sejarah Peminatan', 'SEJ-P-IPS', 'SMA', ARRAY[10,11,12], 'IPS', 4, 'Sejarah peminatan IPS', 'active'),
('Sosiologi', 'SOS-SMA', 'SMA', ARRAY[10,11,12], 'IPS', 4, 'Sosiologi untuk jurusan IPS', 'active'),
('Ekonomi', 'EKO-SMA', 'SMA', ARRAY[10,11,12], 'IPS', 4, 'Ekonomi untuk jurusan IPS', 'active'),

-- Insert SMA Bahasa Subjects
('Bahasa dan Sastra Indonesia', 'BSI-SMA', 'SMA', ARRAY[10,11,12], 'BAHASA', 4, 'Bahasa dan sastra Indonesia', 'active'),
('Bahasa dan Sastra Inggris', 'BSE-SMA', 'SMA', ARRAY[10,11,12], 'BAHASA', 4, 'Bahasa dan sastra Inggris', 'active'),
('Bahasa Asing Lain', 'BAL-SMA', 'SMA', ARRAY[10,11,12], 'BAHASA', 4, 'Bahasa asing pilihan', 'active'),
('Antropologi', 'ANT-SMA', 'SMA', ARRAY[10,11,12], 'BAHASA', 3, 'Antropologi untuk jurusan Bahasa', 'active');

-- Success message
SELECT 'K-12 Subjects inserted successfully!' as message,
       COUNT(*) as total_subjects
FROM subjects;
