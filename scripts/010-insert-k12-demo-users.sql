-- Insert demo users for K-12 education system
-- This script creates demo accounts for testing the system

-- First ensure bcrypt extension is available (for password hashing)
-- Note: In production, passwords should be hashed by the application
-- For demo purposes, we'll use a simple hash

-- Insert demo admin user
INSERT INTO users (
    username, 
    password_hash, 
    nama, 
    kelas, 
    role, 
    no_hp, 
    email, 
    status
) VALUES (
    'admin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Administrator HMS',
    'Admin',
    'admin',
    '081234567890',
    'admin@hms.edu',
    'active'
) ON CONFLICT (username) DO NOTHING;

-- Insert demo teachers for each level
INSERT INTO users (
    username, 
    password_hash, 
    nama, 
    kelas, 
    role, 
    no_hp, 
    email, 
    status
) VALUES 
-- SD Teachers
(
    'guru_sd1',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Ibu Sari Wulandari',
    '1A',
    'teacher',
    '081234567891',
    'sari.wulandari@hms.edu',
    'active'
),
(
    'guru_sd2',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Pak Budi Santoso',
    '3A',
    'teacher',
    '081234567892',
    'budi.santoso@hms.edu',
    'active'
),
-- SMP Teachers
(
    'guru_smp1',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Ibu Dewi Lestari',
    '7A',
    'teacher',
    '081234567893',
    'dewi.lestari@hms.edu',
    'active'
),
(
    'guru_smp2',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Pak Ahmad Hidayat',
    '8B',
    'teacher',
    '081234567894',
    'ahmad.hidayat@hms.edu',
    'active'
),
-- SMA Teachers
(
    'guru_sma1',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Ibu Rina Maharani',
    'X-IPA-1',
    'teacher',
    '081234567895',
    'rina.maharani@hms.edu',
    'active'
),
(
    'guru_sma2',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Pak Joko Widodo',
    'XI-IPS-1',
    'teacher',
    '081234567896',
    'joko.widodo@hms.edu',
    'active'
)
ON CONFLICT (username) DO NOTHING;

-- Insert demo students for each level
INSERT INTO users (
    username, 
    password_hash, 
    nama, 
    kelas, 
    role, 
    nisn,
    no_hp, 
    email, 
    status
) VALUES 
-- SD Students
(
    'siswa_sd1',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Andi Pratama',
    '1A',
    'student',
    '1234567890',
    '081234567801',
    'andi.pratama@student.hms.edu',
    'active'
),
(
    'siswa_sd2',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Siti Nurhaliza',
    '3A',
    'student',
    '1234567891',
    '081234567802',
    'siti.nurhaliza@student.hms.edu',
    'active'
),
(
    'siswa_sd3',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Rudi Hermawan',
    '6A',
    'student',
    '1234567892',
    '081234567803',
    'rudi.hermawan@student.hms.edu',
    'active'
),
-- SMP Students
(
    'siswa_smp1',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Maya Sari',
    '7A',
    'student',
    '1234567893',
    '081234567804',
    'maya.sari@student.hms.edu',
    'active'
),
(
    'siswa_smp2',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Doni Setiawan',
    '8B',
    'student',
    '1234567894',
    '081234567805',
    'doni.setiawan@student.hms.edu',
    'active'
),
(
    'siswa_smp3',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Lina Marlina',
    '9C',
    'student',
    '1234567895',
    '081234567806',
    'lina.marlina@student.hms.edu',
    'active'
),
-- SMA Students
(
    'siswa1',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Budi Santoso',
    'X-IPA-1',
    'student',
    '1234567896',
    '081234567807',
    'budi.santoso@student.hms.edu',
    'active'
),
(
    'siswa2',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Ani Widiastuti',
    'XI-IPS-1',
    'student',
    '1234567897',
    '081234567808',
    'ani.widiastuti@student.hms.edu',
    'active'
),
(
    'siswa3',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Citra Dewi',
    'XII-IPA-2',
    'student',
    '1234567898',
    '081234567809',
    'citra.dewi@student.hms.edu',
    'active'
),
(
    'siswa4',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VJWZp/K/K', -- password123
    'Dimas Pratama',
    'XII-IPS-1',
    'student',
    '1234567899',
    '081234567810',
    'dimas.pratama@student.hms.edu',
    'active'
);

-- Verify the demo users were created
SELECT 
    role,
    COUNT(*) as total_users,
    STRING_AGG(DISTINCT 
        CASE 
            WHEN role = 'student' THEN 
                CASE 
                    WHEN CAST(SUBSTRING(kelas, 1, 1) AS INTEGER) BETWEEN 1 AND 6 THEN 'SD'
                    WHEN CAST(SUBSTRING(kelas, 1, 1) AS INTEGER) BETWEEN 7 AND 9 THEN 'SMP'
                    ELSE 'SMA'
                END
            ELSE kelas
        END, 
        ', '
    ) as classes_or_levels
FROM users 
WHERE status = 'active'
GROUP BY role
ORDER BY 
    CASE role 
        WHEN 'admin' THEN 1 
        WHEN 'teacher' THEN 2 
        WHEN 'student' THEN 3 
    END;
