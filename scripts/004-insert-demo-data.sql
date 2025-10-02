-- Insert demo subjects
INSERT INTO public.subjects (name, code, description, grade_level) VALUES
('Matematika', 'MTK10', 'Matematika untuk kelas 10', 10),
('Bahasa Indonesia', 'BID10', 'Bahasa Indonesia untuk kelas 10', 10),
('Bahasa Inggris', 'BIG10', 'Bahasa Inggris untuk kelas 10', 10),
('Fisika', 'FIS10', 'Fisika untuk kelas 10', 10),
('Kimia', 'KIM10', 'Kimia untuk kelas 10', 10),
('Biologi', 'BIO10', 'Biologi untuk kelas 10', 10),
('Sejarah', 'SEJ10', 'Sejarah untuk kelas 10', 10),
('Geografi', 'GEO10', 'Geografi untuk kelas 10', 10),
('Ekonomi', 'EKO10', 'Ekonomi untuk kelas 10', 10),
('Sosiologi', 'SOS10', 'Sosiologi untuk kelas 10', 10),

('Matematika', 'MTK11', 'Matematika untuk kelas 11', 11),
('Bahasa Indonesia', 'BID11', 'Bahasa Indonesia untuk kelas 11', 11),
('Bahasa Inggris', 'BIG11', 'Bahasa Inggris untuk kelas 11', 11),
('Fisika', 'FIS11', 'Fisika untuk kelas 11', 11),
('Kimia', 'KIM11', 'Kimia untuk kelas 11', 11),
('Biologi', 'BIO11', 'Biologi untuk kelas 11', 11),
('Sejarah', 'SEJ11', 'Sejarah untuk kelas 11', 11),
('Geografi', 'GEO11', 'Geografi untuk kelas 11', 11),
('Ekonomi', 'EKO11', 'Ekonomi untuk kelas 11', 11),
('Sosiologi', 'SOS11', 'Sosiologi untuk kelas 11', 11),

('Matematika', 'MTK12', 'Matematika untuk kelas 12', 12),
('Bahasa Indonesia', 'BID12', 'Bahasa Indonesia untuk kelas 12', 12),
('Bahasa Inggris', 'BIG12', 'Bahasa Inggris untuk kelas 12', 12),
('Fisika', 'FIS12', 'Fisika untuk kelas 12', 12),
('Kimia', 'KIM12', 'Kimia untuk kelas 12', 12),
('Biologi', 'BIO12', 'Biologi untuk kelas 12', 12),
('Sejarah', 'SEJ12', 'Sejarah untuk kelas 12', 12),
('Geografi', 'GEO12', 'Geografi untuk kelas 12', 12),
('Ekonomi', 'EKO12', 'Ekonomi untuk kelas 12', 12),
('Sosiologi', 'SOS12', 'Sosiologi untuk kelas 12', 12)
ON CONFLICT (code) DO NOTHING;

-- Insert demo classes
INSERT INTO public.classes (name, grade_level, academic_year, status) VALUES
('X IPA 1', 10, '2024/2025', 'active'),
('X IPA 2', 10, '2024/2025', 'active'),
('X IPS 1', 10, '2024/2025', 'active'),
('X IPS 2', 10, '2024/2025', 'active'),
('XI IPA 1', 11, '2024/2025', 'active'),
('XI IPA 2', 11, '2024/2025', 'active'),
('XI IPS 1', 11, '2024/2025', 'active'),
('XI IPS 2', 11, '2024/2025', 'active'),
('XII IPA 1', 12, '2024/2025', 'active'),
('XII IPA 2', 12, '2024/2025', 'active'),
('XII IPS 1', 12, '2024/2025', 'active'),
('XII IPS 2', 12, '2024/2025', 'active')
ON CONFLICT DO NOTHING;

-- Create demo notification for welcome message
CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Selamat Datang!',
    'Selamat datang di Sistem Informasi Sekolah berbasis AI. Mulai jelajahi fitur-fitur yang tersedia.',
    'success'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create welcome notification
DROP TRIGGER IF EXISTS create_welcome_notification_trigger ON public.profiles;
CREATE TRIGGER create_welcome_notification_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_welcome_notification();
