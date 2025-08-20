import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
  nama: string;
  kelas: string;
  role: 'student' | 'teacher' | 'admin';
  nisn?: string;
  no_hp: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  nama: string;
  kelas: string;
  role: 'admin' | 'teacher' | 'student';
  nisn?: string;
  no_hp?: string;
  email?: string;
  alamat?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
  agama?: string;
  nama_orang_tua?: string;
  pekerjaan_orang_tua?: string;
  no_hp_orang_tua?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

export interface Class {
  id: string;
  nama_kelas: string;
  tingkat: number;
  jenjang: 'SD' | 'SMP' | 'SMA';
  jurusan?: string;
  wali_kelas_id?: string;
  tahun_ajaran: string;
  kapasitas: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  nama_mata_pelajaran: string;
  kode_mata_pelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA';
  tingkat: number[];
  jurusan?: string;
  sks: number;
  deskripsi?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user?: User | null;
  error?: string | null;
  success?: boolean;
  message?: string;
}

export const SESSION_KEY = 'hms_user_session';

export interface UserSession {
  id: string;
  username: string;
  nama: string;
  role: 'student' | 'teacher' | 'admin';
  kelas: string;
  email?: string;
  avatar_url?: string;
}

// Session management functions
export function saveUserSession(user: User | UserSession): void {
  if (typeof window === 'undefined') return;

  try {
    const sessionData: UserSession = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
      kelas: user.kelas,
      email: user.email,
      avatar_url: user.avatar_url,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

export function isAuthenticated(): boolean {
  return getUserSession() !== null;
}

// Test database connection
async function testDatabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Testing database connection...');

    // Simple connection test
    const { data, error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.error('Database connection test failed:', error);
      return {
        success: false,
        error: `Database connection failed: ${error.message}. Please run the database setup script.`,
      };
    }

    console.log('Database connection successful');
    return { success: true };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      success: false,
      error: 'Cannot connect to database. Please check your environment variables and run the database setup script.',
    };
  }
}

export async function signInWithCredentials(data: LoginData): Promise<AuthResponse> {
  try {
    console.log('Starting login process for username:', data.username);

    // Test database connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      return {
        user: null,
        error: connectionTest.error,
        success: false,
      };
    }

    // Find user by username
    const { data: user, error: userError } = await supabase.from('users').select('*').eq('username', data.username).eq('status', 'active').maybeSingle();

    if (userError) {
      console.error('Error looking up user:', userError);
      return {
        user: null,
        error: `Database error: ${userError.message}. Please ensure the database is properly set up.`,
        success: false,
      };
    }

    if (!user) {
      return {
        user: null,
        error: 'Username tidak ditemukan atau akun tidak aktif',
        success: false,
      };
    }

    console.log('Found user, verifying password...');

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);

    if (!isPasswordValid) {
      return {
        user: null,
        error: 'Password salah',
        success: false,
      };
    }

    console.log('Login successful for user:', user.id);

    // Create session data (without sensitive info)
    const sessionUser: User = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      kelas: user.kelas,
      role: user.role,
      nisn: user.nisn,
      no_hp: user.no_hp,
      email: user.email,
      alamat: user.alamat,
      tanggal_lahir: user.tanggal_lahir,
      jenis_kelamin: user.jenis_kelamin,
      agama: user.agama,
      nama_orang_tua: user.nama_orang_tua,
      pekerjaan_orang_tua: user.pekerjaan_orang_tua,
      no_hp_orang_tua: user.no_hp_orang_tua,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
      avatar_url: user.avatar_url,
    };

    return {
      user: sessionUser,
      error: null,
      success: true,
      message: `Selamat datang, ${user.nama}!`,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      user: null,
      error: 'Terjadi kesalahan saat login. Pastikan database sudah disetup dengan benar.',
      success: false,
    };
  }
}

export async function signUp(data: SignupData): Promise<AuthResponse> {
  try {
    console.log('Starting signup process for:', data.username);

    // Test database connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      return {
        user: null,
        error: connectionTest.error,
        success: false,
      };
    }

    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase.from('users').select('username').eq('username', data.username).maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking username:', checkError);
      return {
        user: null,
        error: 'Terjadi kesalahan saat memeriksa username: ' + checkError.message,
        success: false,
      };
    }

    if (existingUser) {
      return {
        user: null,
        error: 'Username sudah digunakan',
        success: false,
      };
    }

    // Check if email already exists (if provided)
    if (data.email) {
      const { data: existingEmail, error: emailError } = await supabase.from('users').select('email').eq('email', data.email).maybeSingle();

      if (emailError && emailError.code !== 'PGRST116') {
        console.error('Error checking email:', emailError);
        return { user: null, error: 'Terjadi kesalahan saat memeriksa email: ' + emailError.message, success: false };
      }

      if (existingEmail) {
        return { user: null, error: 'Email sudah digunakan', success: false };
      }
    }

    // Check if NISN already exists (if provided)
    if (data.nisn) {
      const { data: existingNISN, error: nisnError } = await supabase.from('users').select('nisn').eq('nisn', data.nisn).maybeSingle();

      if (nisnError && nisnError.code !== 'PGRST116') {
        console.error('Error checking NISN:', nisnError);
        return { user: null, error: 'Terjadi kesalahan saat memeriksa NISN: ' + nisnError.message, success: false };
      }

      if (existingNISN) {
        return { user: null, error: 'NISN sudah digunakan', success: false };
      }
    }

    console.log('Hashing password...');

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    console.log('Creating user in database...');

    // Create user in database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username: data.username,
        password_hash: passwordHash,
        nama: data.nama,
        kelas: data.kelas,
        role: data.role,
        nisn: data.nisn || null,
        no_hp: data.no_hp,
        email: data.email,
        status: 'active',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating user:', insertError);
      return {
        user: null,
        error: 'Gagal membuat akun: ' + insertError.message,
        success: false,
      };
    }

    console.log('User created successfully:', newUser.id);

    // Return user data (without sensitive info)
    const userData: User = {
      id: newUser.id,
      username: newUser.username,
      nama: newUser.nama,
      kelas: newUser.kelas,
      role: newUser.role,
      nisn: newUser.nisn,
      no_hp: newUser.no_hp,
      email: newUser.email,
      alamat: newUser.alamat,
      tanggal_lahir: newUser.tanggal_lahir,
      jenis_kelamin: newUser.jenis_kelamin,
      agama: newUser.agama,
      nama_orang_tua: newUser.nama_orang_tua,
      pekerjaan_orang_tua: newUser.pekerjaan_orang_tua,
      no_hp_orang_tua: newUser.no_hp_orang_tua,
      status: newUser.status,
      created_at: newUser.created_at,
      updated_at: newUser.updated_at,
      avatar_url: newUser.avatar_url,
    };

    return {
      user: userData,
      error: null,
      success: true,
      message: 'Akun berhasil dibuat! Silakan login.',
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      user: null,
      error: 'Terjadi kesalahan saat mendaftar. Periksa koneksi database Anda.',
      success: false,
    };
  }
}

export async function getAllClasses(): Promise<{ classes: Class[]; error: string | null }> {
  try {
    console.log('Fetching classes from database...');

    // Test database connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      return {
        classes: [],
        error: connectionTest.error || 'Database connection failed',
      };
    }

    const { data, error } = await supabase.from('classes').select('*').eq('status', 'active').order('tingkat', { ascending: true }).order('nama_kelas', { ascending: true });

    if (error) {
      console.error('Supabase error fetching classes:', error);
      return {
        classes: [],
        error: `Database error: ${error.message}`,
      };
    }

    console.log('Successfully fetched classes:', data?.length || 0);
    return { classes: data || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching classes:', error);
    return {
      classes: [],
      error: 'Terjadi kesalahan saat mengambil data kelas',
    };
  }
}

export async function getClassesByLevel(jenjang: 'SD' | 'SMP' | 'SMA'): Promise<{ classes: Class[]; error: string | null }> {
  try {
    console.log('Fetching classes for level:', jenjang);

    const { data: classes, error } = await supabase.from('classes').select('*').eq('jenjang', jenjang).eq('status', 'active').order('tingkat', { ascending: true }).order('nama_kelas', { ascending: true });

    if (error) {
      console.error('Error fetching classes by level:', error);
      return { classes: [], error: 'Gagal memuat data kelas: ' + error.message };
    }

    console.log(`Classes for ${jenjang} fetched successfully:`, classes?.length || 0);
    return { classes: classes || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching classes by level:', error);
    return { classes: [], error: 'Terjadi kesalahan saat memuat data kelas' };
  }
}

export async function getAllSubjects(): Promise<{ subjects: Subject[]; error: string | null }> {
  try {
    console.log('Fetching all subjects...');

    const { data: subjects, error } = await supabase.from('subjects').select('*').eq('status', 'active').order('jenjang', { ascending: true }).order('nama_mata_pelajaran', { ascending: true });

    if (error) {
      console.error('Error fetching subjects:', error);
      return { subjects: [], error: 'Gagal memuat data mata pelajaran: ' + error.message };
    }

    console.log('Subjects fetched successfully:', subjects?.length || 0);
    return { subjects: subjects || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching subjects:', error);
    return { subjects: [], error: 'Terjadi kesalahan saat memuat data mata pelajaran' };
  }
}

export async function getSubjectsByLevel(jenjang: 'SD' | 'SMP' | 'SMA', jurusan?: string): Promise<{ subjects: Subject[]; error: string | null }> {
  try {
    console.log('Fetching subjects for level:', jenjang, jurusan ? `jurusan: ${jurusan}` : '');

    let query = supabase.from('subjects').select('*').eq('jenjang', jenjang).eq('status', 'active');

    if (jurusan) {
      query = query.or(`jurusan.eq.${jurusan},jurusan.is.null`);
    }

    const { data: subjects, error } = await query.order('nama_mata_pelajaran', { ascending: true });

    if (error) {
      console.error('Error fetching subjects by level:', error);
      return { subjects: [], error: 'Gagal memuat data mata pelajaran: ' + error.message };
    }

    console.log(`Subjects for ${jenjang} ${jurusan || ''} fetched successfully:`, subjects?.length || 0);
    return { subjects: subjects || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching subjects by level:', error);
    return { subjects: [], error: 'Terjadi kesalahan saat memuat data mata pelajaran' };
  }
}

export async function getUserById(userId: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).eq('status', 'active').single();

    if (error) {
      console.error('Error fetching user by ID:', error);
      return { user: null, error: 'User tidak ditemukan: ' + error.message };
    }

    // Remove password_hash from returned user data
    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as User, error: null };
  } catch (error) {
    console.error('Unexpected error fetching user by ID:', error);
    return { user: null, error: 'Terjadi kesalahan saat memuat data user' };
  }
}

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).eq('status', 'active').single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    // Remove password_hash from returned user data
    const { password_hash, ...userWithoutPassword } = user;

    return userWithoutPassword as User;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const session = getUserSession();
    if (!session) {
      return { user: null, error: 'No active session' };
    }

    // Get fresh user data from database
    const { data: user, error } = await supabase.from('users').select('*').eq('id', session.id).eq('status', 'active').single();

    if (error) {
      console.error('Error fetching current user:', error);
      return { user: null, error: 'User not found or inactive' };
    }

    // Remove password_hash from returned user data
    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword as User, error: null };
  } catch (error) {
    console.error('Unexpected error fetching current user:', error);
    return { user: null, error: 'Failed to fetch user data' };
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<{ user: User | null; error: string | null }> {
  try {
    // Remove fields that shouldn't be updated directly
    const { id, password_hash, created_at, updated_at, ...allowedUpdates } = updates as any;

    const { data: updatedUser, error } = await supabase.from('users').update(allowedUpdates).eq('id', userId).select().single();

    if (error) {
      console.error('Error updating user profile:', error);
      return { user: null, error: 'Gagal memperbarui profil: ' + error.message };
    }

    // Remove password_hash from returned user data
    const { password_hash: _, ...userWithoutPassword } = updatedUser;

    return { user: userWithoutPassword as User, error: null };
  } catch (error) {
    console.error('Unexpected error updating user profile:', error);
    return { user: null, error: 'Terjadi kesalahan saat memperbarui profil' };
  }
}

// Helper functions for getting data
export async function getStudentAssignments(studentKelas: string) {
  try {
    const { data, error } = await supabase.from('assignments').select('*').eq('kelas', studentKelas).eq('status', 'active').order('tanggal_deadline', { ascending: true });

    if (error) {
      console.error('Error fetching assignments:', error);
      return { assignments: [], error: error.message };
    }

    return { assignments: data || [], error: null };
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return { assignments: [], error: 'Failed to fetch assignments' };
  }
}

export async function getStudentGrades(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('grades')
      .select(
        `
        *,
        assignments (
          judul,
          mata_pelajaran,
          tanggal_deadline
        )
      `
      )
      .eq('siswa_id', studentId)
      .order('tanggal_nilai', { ascending: false });

    if (error) {
      console.error('Error fetching grades:', error);
      return { grades: [], error: error.message };
    }

    return { grades: data || [], error: null };
  } catch (error) {
    console.error('Error fetching grades:', error);
    return { grades: [], error: 'Failed to fetch grades' };
  }
}

export function getGradeLevel(kelas: string): 'SD' | 'SMP' | 'SMA' {
  const firstChar = kelas.charAt(0);
  const gradeNumber = Number.parseInt(firstChar);

  if (gradeNumber >= 1 && gradeNumber <= 6) return 'SD';
  if (gradeNumber >= 7 && gradeNumber <= 9) return 'SMP';
  return 'SMA';
}

export function getGradeNumber(kelas: string): number {
  const firstChar = kelas.charAt(0);
  const gradeNumber = Number.parseInt(firstChar);

  if (!isNaN(gradeNumber)) return gradeNumber;

  // Handle SMA format (X, XI, XII)
  if (kelas.startsWith('X-')) return 10;
  if (kelas.startsWith('XI-')) return 11;
  if (kelas.startsWith('XII-')) return 12;

  return 1; // Default fallback
}

export function formatClassName(kelas: string): string {
  const level = getGradeLevel(kelas);
  const grade = getGradeNumber(kelas);

  return `${level} - Kelas ${kelas}`;
}

export function requireAuth(allowedRoles?: string[]): User | null {
  const user = getUserSession();

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return user as User;
}

// Legacy function names for backward compatibility
export const signInUser = signInWithCredentials;
export const getCurrentSession = getUserSession;
export const signOut = clearUserSession;
export const saveSession = saveUserSession;
export const clearSession = clearUserSession;
