import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for database tables
export interface Profile {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
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

export interface Teacher {
  id: string;
  user_id: string;
  nip: string;
  mata_pelajaran_id?: string;
  jabatan?: string;
  pendidikan_terakhir?: string;
  tanggal_mulai_kerja?: string;
  status: 'active' | 'inactive' | 'retired';
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  nisn: string;
  nis: string;
  class_id?: string;
  tanggal_masuk?: string;
  nama_orang_tua?: string;
  pekerjaan_orang_tua?: string;
  no_hp_orang_tua?: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subject_id: string;
  class_id: string;
  teacher_id: string;
  due_date?: string;
  max_score: number;
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: string;
  student_id: string;
  assignment_id: string;
  subject_id: string;
  score?: number;
  max_score: number;
  grade_letter?: string;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
}
