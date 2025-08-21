-- Create or update classes table for K-12 education system
-- This script sets up classes from grade 1 (SD) to grade 12 (SMA)

-- First, ensure the classes table exists with the correct structure
CREATE TABLE IF NOT EXISTS classes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_kelas VARCHAR(20) NOT NULL,
    tingkat INTEGER NOT NULL CHECK (tingkat >= 1 AND tingkat <= 12),
    jenjang VARCHAR(10) NOT NULL CHECK (jenjang IN ('SD', 'SMP', 'SMA')),
    jurusan VARCHAR(20),
    wali_kelas_id UUID REFERENCES users(id),
    tahun_ajaran VARCHAR(20) NOT NULL DEFAULT '2024/2025',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear existing classes to avoid duplicates
DELETE FROM classes;

-- Insert SD classes (Kelas 1-6)
INSERT INTO classes (nama_kelas, tingkat, jenjang, tahun_ajaran, status) VALUES
-- Kelas 1 SD
('1A', 1, 'SD', '2024/2025', 'active'),
('1B', 1, 'SD', '2024/2025', 'active'),
-- Kelas 2 SD
('2A', 2, 'SD', '2024/2025', 'active'),
('2B', 2, 'SD', '2024/2025', 'active'),
-- Kelas 3 SD
('3A', 3, 'SD', '2024/2025', 'active'),
('3B', 3, 'SD', '2024/2025', 'active'),
-- Kelas 4 SD
('4A', 4, 'SD', '2024/2025', 'active'),
('4B', 4, 'SD', '2024/2025', 'active'),
-- Kelas 5 SD
('5A', 5, 'SD', '2024/2025', 'active'),
('5B', 5, 'SD', '2024/2025', 'active'),
-- Kelas 6 SD
('6A', 6, 'SD', '2024/2025', 'active'),
('6B', 6, 'SD', '2024/2025', 'active');

-- Insert SMP classes (Kelas 7-9)
INSERT INTO classes (nama_kelas, tingkat, jenjang, tahun_ajaran, status) VALUES
-- Kelas 7 SMP
('7A', 7, 'SMP', '2024/2025', 'active'),
('7B', 7, 'SMP', '2024/2025', 'active'),
('7C', 7, 'SMP', '2024/2025', 'active'),
-- Kelas 8 SMP
('8A', 8, 'SMP', '2024/2025', 'active'),
('8B', 8, 'SMP', '2024/2025', 'active'),
('8C', 8, 'SMP', '2024/2025', 'active'),
-- Kelas 9 SMP
('9A', 9, 'SMP', '2024/2025', 'active'),
('9B', 9, 'SMP', '2024/2025', 'active'),
('9C', 9, 'SMP', '2024/2025', 'active');

-- Insert SMA classes (Kelas 10-12)
INSERT INTO classes (nama_kelas, tingkat, jenjang, jurusan, tahun_ajaran, status) VALUES
-- Kelas 10 SMA
('X-IPA-1', 10, 'SMA', 'IPA', '2024/2025', 'active'),
('X-IPA-2', 10, 'SMA', 'IPA', '2024/2025', 'active'),
('X-IPS-1', 10, 'SMA', 'IPS', '2024/2025', 'active'),
('X-IPS-2', 10, 'SMA', 'IPS', '2024/2025', 'active'),
-- Kelas 11 SMA
('XI-IPA-1', 11, 'SMA', 'IPA', '2024/2025', 'active'),
('XI-IPA-2', 11, 'SMA', 'IPA', '2024/2025', 'active'),
('XI-IPS-1', 11, 'SMA', 'IPS', '2024/2025', 'active'),
('XI-IPS-2', 11, 'SMA', 'IPS', '2024/2025', 'active'),
-- Kelas 12 SMA
('XII-IPA-1', 12, 'SMA', 'IPA', '2024/2025', 'active'),
('XII-IPA-2', 12, 'SMA', 'IPA', '2024/2025', 'active'),
('XII-IPS-1', 12, 'SMA', 'IPS', '2024/2025', 'active'),
('XII-IPS-2', 12, 'SMA', 'IPS', '2024/2025', 'active');

-- Enable RLS on classes table
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read classes
CREATE POLICY "Allow authenticated users to read classes" ON classes
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow admins to manage classes
CREATE POLICY "Allow admins to manage classes" ON classes
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
            AND users.status = 'active'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_tingkat ON classes(tingkat);
CREATE INDEX IF NOT EXISTS idx_classes_jenjang ON classes(jenjang);
CREATE INDEX IF NOT EXISTS idx_classes_status ON classes(status);
CREATE INDEX IF NOT EXISTS idx_classes_tahun_ajaran ON classes(tahun_ajaran);

-- Update the updated_at timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for classes table
DROP TRIGGER IF EXISTS update_classes_updated_at ON classes;
CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the data was inserted
SELECT 
    jenjang,
    COUNT(*) as total_classes,
    MIN(tingkat) as min_grade,
    MAX(tingkat) as max_grade
FROM classes 
WHERE status = 'active'
GROUP BY jenjang
ORDER BY MIN(tingkat);
