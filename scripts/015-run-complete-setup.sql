-- HMS K-12 Complete Database Setup
-- This script runs all setup scripts in the correct order

-- Step 1: Create database structure
\i scripts/011-setup-k12-database.sql

-- Step 2: Insert classes data
\i scripts/012-insert-k12-classes.sql

-- Step 3: Insert subjects data
\i scripts/013-insert-k12-subjects.sql

-- Step 4: Insert demo users
\i scripts/014-insert-demo-users.sql

-- Final verification
SELECT 
    'HMS K-12 Database Setup Complete!' as status,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM classes) as total_classes,
    (SELECT COUNT(*) FROM subjects) as total_subjects;

-- Show demo accounts
SELECT 
    'Demo Accounts Available:' as info,
    username,
    nama,
    role,
    kelas
FROM users 
WHERE username IN ('admin', 'guru_sd1', 'guru_smp1', 'guru_sma1', 'siswa1', 'siswa_sd1', 'siswa_smp1')
ORDER BY role, username;
