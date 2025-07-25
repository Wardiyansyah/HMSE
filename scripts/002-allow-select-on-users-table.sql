-- Pastikan RLS diaktifkan untuk tabel users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Buat kebijakan RLS untuk memungkinkan pengguna anonim membaca data dari tabel users
-- Ini diperlukan agar kueri login sisi klien dapat menemukan pengguna berdasarkan username dan password.
-- PERINGATAN: Ini memungkinkan siapa pun untuk membaca username dan password (jika tidak di-hash)
-- dari tabel users. Sangat disarankan untuk menghash password dan memindahkan logika login
-- ke sisi server untuk keamanan produksi.
CREATE POLICY "Allow public read access to users table for login"
ON public.users FOR SELECT
TO anon
USING (true);
