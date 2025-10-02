-- Insert K-12 Classes Data
-- This script inserts all classes for SD, SMP, and SMA levels

-- Insert SD Classes (Grades 1-6)
INSERT INTO classes (nama_kelas, tingkat, jenjang, tahun_ajaran, kapasitas, status) VALUES
-- Grade 1 SD
('1A', 1, 'SD', '2024/2025', 25, 'active'),
('1B', 1, 'SD', '2024/2025', 25, 'active'),
('1C', 1, 'SD', '2024/2025', 25, 'active'),

-- Grade 2 SD
('2A', 2, 'SD', '2024/2025', 25, 'active'),
('2B', 2, 'SD', '2024/2025', 25, 'active'),
('2C', 2, 'SD', '2024/2025', 25, 'active'),

-- Grade 3 SD
('3A', 3, 'SD', '2024/2025', 25, 'active'),
('3B', 3, 'SD', '2024/2025', 25, 'active'),
('3C', 3, 'SD', '2024/2025', 25, 'active'),

-- Grade 4 SD
('4A', 4, 'SD', '2024/2025', 25, 'active'),
('4B', 4, 'SD', '2024/2025', 25, 'active'),
('4C', 4, 'SD', '2024/2025', 25, 'active'),

-- Grade 5 SD
('5A', 5, 'SD', '2024/2025', 25, 'active'),
('5B', 5, 'SD', '2024/2025', 25, 'active'),
('5C', 5, 'SD', '2024/2025', 25, 'active'),

-- Grade 6 SD
('6A', 6, 'SD', '2024/2025', 25, 'active'),
('6B', 6, 'SD', '2024/2025', 25, 'active'),
('6C', 6, 'SD', '2024/2025', 25, 'active'),

-- Insert SMP Classes (Grades 7-9)
-- Grade 7 SMP
('7A', 7, 'SMP', '2024/2025', 30, 'active'),
('7B', 7, 'SMP', '2024/2025', 30, 'active'),
('7C', 7, 'SMP', '2024/2025', 30, 'active'),
('7D', 7, 'SMP', '2024/2025', 30, 'active'),

-- Grade 8 SMP
('8A', 8, 'SMP', '2024/2025', 30, 'active'),
('8B', 8, 'SMP', '2024/2025', 30, 'active'),
('8C', 8, 'SMP', '2024/2025', 30, 'active'),
('8D', 8, 'SMP', '2024/2025', 30, 'active'),

-- Grade 9 SMP
('9A', 9, 'SMP', '2024/2025', 30, 'active'),
('9B', 9, 'SMP', '2024/2025', 30, 'active'),
('9C', 9, 'SMP', '2024/2025', 30, 'active'),
('9D', 9, 'SMP', '2024/2025', 30, 'active'),

-- Insert SMA Classes (Grades 10-12)
-- Grade 10 SMA (X)
('X-IPA-1', 10, 'SMA', '2024/2025', 32, 'active'),
('X-IPA-2', 10, 'SMA', '2024/2025', 32, 'active'),
('X-IPA-3', 10, 'SMA', '2024/2025', 32, 'active'),
('X-IPS-1', 10, 'SMA', '2024/2025', 32, 'active'),
('X-IPS-2', 10, 'SMA', '2024/2025', 32, 'active'),
('X-BAHASA-1', 10, 'SMA', '2024/2025', 28, 'active'),

-- Grade 11 SMA (XI)
('XI-IPA-1', 11, 'SMA', '2024/2025', 32, 'active'),
('XI-IPA-2', 11, 'SMA', '2024/2025', 32, 'active'),
('XI-IPA-3', 11, 'SMA', '2024/2025', 32, 'active'),
('XI-IPS-1', 11, 'SMA', '2024/2025', 32, 'active'),
('XI-IPS-2', 11, 'SMA', '2024/2025', 32, 'active'),
('XI-BAHASA-1', 11, 'SMA', '2024/2025', 28, 'active'),

-- Grade 12 SMA (XII)
('XII-IPA-1', 12, 'SMA', '2024/2025', 32, 'active'),
('XII-IPA-2', 12, 'SMA', '2024/2025', 32, 'active'),
('XII-IPA-3', 12, 'SMA', '2024/2025', 32, 'active'),
('XII-IPS-1', 12, 'SMA', '2024/2025', 32, 'active'),
('XII-IPS-2', 12, 'SMA', '2024/2025', 32, 'active'),
('XII-BAHASA-1', 12, 'SMA', '2024/2025', 28, 'active');

-- Success message
SELECT 'K-12 Classes inserted successfully!' as message,
       COUNT(*) as total_classes
FROM classes;
