import { supabase } from './supabase';
import bcrypt from 'bcryptjs';
import type { Profile } from './supabase';

export interface LoginData {
  username: string;
  password: string;
}

export interface SignupData {
  username: string;
  password: string;
  full_name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  phone?: string;
  nisn?: string;
  nis?: string;
  nip?: string;
  class_id?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student';
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

export interface Class {
  id: string;
  nama_kelas: string;
  tingkat: number;
  jurusan?: string;
  tahun_ajaran: string;
  wali_kelas_id?: string;
  kapasitas: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  kode_mata_pelajaran: string;
  nama_mata_pelajaran: string;
  tingkat: number[];
  deskripsi?: string;
  sks: number;
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
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
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
      full_name: user.full_name,
      role: user.role,
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

    // Test connection using profiles table
    const { data, error } = await supabase.from('profiles').select('count').limit(1);

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

    // Find user by username in profiles table
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('username', data.username).eq('status', 'active').maybeSingle();

    if (profileError) {
      console.error('Error looking up profile:', profileError);
      return {
        user: null,
        error: `Database error: ${profileError.message}. Please ensure the database is properly set up.`,
        success: false,
      };
    }

    if (!profile) {
      return {
        user: null,
        error: 'Username tidak ditemukan atau akun tidak aktif',
        success: false,
      };
    }

    console.log('Found profile, verifying password...');

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, profile.password_hash);

    if (!isPasswordValid) {
      return {
        user: null,
        error: 'Password salah',
        success: false,
      };
    }

    console.log('Login successful for user:', profile.id);

    // Create session data (without sensitive info)
    const sessionUser: User = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      phone: profile.phone,
      address: profile.address,
      date_of_birth: profile.date_of_birth,
      gender: profile.gender,
      status: profile.status,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      avatar_url: profile.avatar_url,
    };

    return {
      user: sessionUser,
      error: null,
      success: true,
      message: `Selamat datang, ${profile.full_name}!`,
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
    const { data: existingUser, error: checkError } = await supabase.from('profiles').select('username').eq('username', data.username).maybeSingle();

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

    // Check if email already exists
    const { data: existingEmail, error: emailError } = await supabase.from('profiles').select('email').eq('email', data.email).maybeSingle();

    if (emailError && emailError.code !== 'PGRST116') {
      console.error('Error checking email:', emailError);
      return { user: null, error: 'Terjadi kesalahan saat memeriksa email: ' + emailError.message, success: false };
    }

    if (existingEmail) {
      return { user: null, error: 'Email sudah digunakan', success: false };
    }

    console.log('Hashing password...');

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    console.log('Creating profile in database...');

    // Create profile in database - let UUID be auto-generated
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        username: data.username,
        password_hash: passwordHash,
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        phone: data.phone || null,
        status: 'active',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return {
        user: null,
        error: 'Gagal membuat akun: ' + insertError.message,
        success: false,
      };
    }

    console.log('Profile created successfully:', newProfile.id);

    // Create role-specific records
    if (data.role === 'student' && (data.nisn || data.nis)) {
      const { error: studentError } = await supabase.from('students').insert({
        user_id: newProfile.id,
        nisn: data.nisn || `NISN${Date.now()}`,
        nis: data.nis || `NIS${Date.now()}`,
        class_id: data.class_id || null,
        tanggal_masuk: new Date().toISOString().split('T')[0],
      });

      if (studentError) {
        console.error('Error creating student record:', studentError);
        // Don't fail the signup, just log the error
      }
    } else if (data.role === 'teacher' && data.nip) {
      const { error: teacherError } = await supabase.from('teachers').insert({
        user_id: newProfile.id,
        nip: data.nip,
        tanggal_mulai_kerja: new Date().toISOString().split('T')[0],
      });

      if (teacherError) {
        console.error('Error creating teacher record:', teacherError);
        // Don't fail the signup, just log the error
      }
    }

    // Return user data (without sensitive info)
    const userData: User = {
      id: newProfile.id,
      username: newProfile.username,
      email: newProfile.email,
      full_name: newProfile.full_name,
      role: newProfile.role,
      phone: newProfile.phone,
      address: newProfile.address,
      date_of_birth: newProfile.date_of_birth,
      gender: newProfile.gender,
      status: newProfile.status,
      created_at: newProfile.created_at,
      updated_at: newProfile.updated_at,
      avatar_url: newProfile.avatar_url,
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

export async function getClassesByLevel(tingkat: number): Promise<{ classes: Class[]; error: string | null }> {
  try {
    console.log('Fetching classes for level:', tingkat);

    const { data: classes, error } = await supabase.from('classes').select('*').eq('tingkat', tingkat).eq('status', 'active').order('nama_kelas', { ascending: true });

    if (error) {
      console.error('Error fetching classes by level:', error);
      return { classes: [], error: 'Gagal memuat data kelas: ' + error.message };
    }

    console.log(`Classes for level ${tingkat} fetched successfully:`, classes?.length || 0);
    return { classes: classes || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching classes by level:', error);
    return { classes: [], error: 'Terjadi kesalahan saat memuat data kelas' };
  }
}

export async function getAllSubjects(): Promise<{ subjects: Subject[]; error: string | null }> {
  try {
    console.log('Fetching all subjects...');

    const { data: subjects, error } = await supabase.from('subjects').select('*').eq('status', 'active').order('nama_mata_pelajaran', { ascending: true });

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

export async function getSubjectsByLevel(tingkat: number): Promise<{ subjects: Subject[]; error: string | null }> {
  try {
    console.log('Fetching subjects for level:', tingkat);

    const { data: subjects, error } = await supabase.from('subjects').select('*').contains('tingkat', [tingkat]).eq('status', 'active').order('nama_mata_pelajaran', { ascending: true });

    if (error) {
      console.error('Error fetching subjects by level:', error);
      return { subjects: [], error: 'Gagal memuat data mata pelajaran: ' + error.message };
    }

    console.log(`Subjects for level ${tingkat} fetched successfully:`, subjects?.length || 0);
    return { subjects: subjects || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching subjects by level:', error);
    return { subjects: [], error: 'Terjadi kesalahan saat memuat data mata pelajaran' };
  }
}

export async function getUserById(userId: string): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', userId).eq('status', 'active').single();

    if (error) {
      console.error('Error fetching user by ID:', error);
      return { user: null, error: 'User tidak ditemukan: ' + error.message };
    }

    // Remove password_hash from returned user data
    const { password_hash, ...userWithoutPassword } = profile;

    return { user: userWithoutPassword as User, error: null };
  } catch (error) {
    console.error('Unexpected error fetching user by ID:', error);
    return { user: null, error: 'Terjadi kesalahan saat memuat data user' };
  }
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

    if (error) {
      console.error('Get user profile error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get user profile error:', error);
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
    const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', session.id).eq('status', 'active').maybeSingle();

    if (error) {
      console.error('Error fetching current user:', error);
      return { user: null, error: 'Database error: ' + error.message };
    }

    if (!profile) {
      console.error('Profile not found for user ID:', session.id);
      return { user: null, error: 'User profile not found' };
    }

    // Remove password_hash from returned user data
    const { password_hash, ...userWithoutPassword } = profile;

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

    const { data: updatedProfile, error } = await supabase.from('profiles').update(allowedUpdates).eq('id', userId).select().single();

    if (error) {
      console.error('Error updating user profile:', error);
      return { user: null, error: 'Gagal memperbarui profil: ' + error.message };
    }

    // Remove password_hash from returned user data
    const { password_hash: _, ...userWithoutPassword } = updatedProfile;

    return { user: userWithoutPassword as User, error: null };
  } catch (error) {
    console.error('Unexpected error updating user profile:', error);
    return { user: null, error: 'Terjadi kesalahan saat memperbarui profil' };
  }
}

// Helper functions for getting data
export async function getStudentAssignments(studentId: string) {
  try {
    // First get student's class
    const { data: student, error: studentError } = await supabase.from('students').select('class_id').eq('user_id', studentId).single();

    if (studentError || !student?.class_id) {
      return { assignments: [], error: 'Student class not found' };
    }

    const { data, error } = await supabase
      .from('assignments')
      .select(
        `
        *,
        subjects (
          nama_mata_pelajaran,
          kode_mata_pelajaran
        ),
        classes (
          nama_kelas
        )
      `
      )
      .eq('class_id', student.class_id)
      .eq('status', 'published')
      .order('due_date', { ascending: true });

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
    // First get student record
    const { data: student, error: studentError } = await supabase.from('students').select('id').eq('user_id', studentId).single();

    if (studentError || !student) {
      return { grades: [], error: 'Student record not found' };
    }

    const { data, error } = await supabase
      .from('grades')
      .select(
        `
        *,
        assignments (
          title,
          due_date
        ),
        subjects (
          nama_mata_pelajaran,
          kode_mata_pelajaran
        )
      `
      )
      .eq('student_id', student.id)
      .order('graded_at', { ascending: false });

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

export async function getTeacherAssignments(teacherId: string) {
  try {
    // First get teacher record
    const { data: teacher, error: teacherError } = await supabase.from('teachers').select('id').eq('user_id', teacherId).single();

    if (teacherError || !teacher) {
      return { assignments: [], error: 'Teacher record not found' };
    }

    const { data, error } = await supabase
      .from('assignments')
      .select(
        `
        *,
        subjects (
          nama_mata_pelajaran,
          kode_mata_pelajaran
        ),
        classes (
          nama_kelas
        )
      `
      )
      .eq('teacher_id', teacher.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teacher assignments:', error);
      return { assignments: [], error: error.message };
    }

    return { assignments: data || [], error: null };
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    return { assignments: [], error: 'Failed to fetch assignments' };
  }
}

export function getGradeLevel(tingkat: number): 'SD' | 'SMP' | 'SMA' {
  if (tingkat >= 1 && tingkat <= 6) return 'SD';
  if (tingkat >= 7 && tingkat <= 9) return 'SMP';
  return 'SMA';
}

export function formatClassName(nama_kelas: string, tingkat: number): string {
  const level = getGradeLevel(tingkat);
  return `${level} - ${nama_kelas}`;
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
