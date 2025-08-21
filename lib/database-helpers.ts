import { supabase } from './supabase';
import type { Profile, Student, Teacher, Class, Subject, Assignment, Notification } from './supabase';

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

    if (error) {
      console.error('Get profile error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

// Student functions
export async function getStudentProfile(userId: string): Promise<Student | null> {
  try {
    const { data, error } = await supabase.from('students').select('*').eq('user_id', userId).maybeSingle();

    if (error) {
      console.error('Get student profile error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get student profile error:', error);
    return null;
  }
}

export async function getStudentsByClass(classId: string): Promise<Student[]> {
  try {
    const { data, error } = await supabase.from('students').select('*').eq('class_id', classId).eq('status', 'active');

    if (error) {
      console.error('Get students by class error:', error);
      return [];
    }

    // Get profiles for each student
    const studentsWithProfiles = [];
    for (const student of data || []) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', student.user_id).maybeSingle();

      studentsWithProfiles.push({
        ...student,
        profiles: profile,
      });
    }

    return studentsWithProfiles;
  } catch (error) {
    console.error('Get students by class error:', error);
    return [];
  }
}

export async function getStudentAssignments(studentId: string): Promise<any[]> {
  try {
    // First get the student's class
    const { data: student, error: studentError } = await supabase.from('students').select('class_id').eq('id', studentId).maybeSingle();

    if (studentError || !student?.class_id) {
      console.error('Error getting student class:', studentError);
      return [];
    }

    // Then get assignments for that class
    const { data, error } = await supabase.from('assignments').select('*').eq('class_id', student.class_id).eq('status', 'published').order('created_at', { ascending: false });

    if (error) {
      console.error('Get student assignments error:', error);
      return [];
    }

    // Get subject and class info separately
    const assignmentsWithDetails = [];
    for (const assignment of data || []) {
      const { data: subject } = await supabase.from('subjects').select('nama_mata_pelajaran, kode_mata_pelajaran').eq('id', assignment.subject_id).maybeSingle();

      const { data: classInfo } = await supabase.from('classes').select('nama_kelas').eq('id', assignment.class_id).maybeSingle();

      assignmentsWithDetails.push({
        ...assignment,
        subjects: subject,
        classes: classInfo,
      });
    }

    return assignmentsWithDetails;
  } catch (error) {
    console.error('Get student assignments error:', error);
    return [];
  }
}

export async function getStudentGrades(studentId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.from('grades').select('*').eq('student_id', studentId).order('created_at', { ascending: false });

    if (error) {
      console.error('Get student grades error:', error);
      return [];
    }

    // Get subject and assignment info separately
    const gradesWithDetails = [];
    for (const grade of data || []) {
      const { data: subject } = await supabase.from('subjects').select('nama_mata_pelajaran, kode_mata_pelajaran').eq('id', grade.subject_id).maybeSingle();

      const { data: assignment } = await supabase.from('assignments').select('title').eq('id', grade.assignment_id).maybeSingle();

      gradesWithDetails.push({
        ...grade,
        subjects: subject,
        assignments: assignment,
      });
    }

    return gradesWithDetails;
  } catch (error) {
    console.error('Get student grades error:', error);
    return [];
  }
}

// Teacher functions
export async function getTeacherProfile(userId: string): Promise<Teacher | null> {
  try {
    const { data, error } = await supabase.from('teachers').select('*').eq('user_id', userId).maybeSingle();

    if (error) {
      console.error('Get teacher profile error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get teacher profile error:', error);
    return null;
  }
}

export async function getTeacherClasses(teacherId: string): Promise<Class[]> {
  try {
    const { data, error } = await supabase.from('classes').select('*').eq('wali_kelas_id', teacherId).eq('status', 'active');

    if (error) {
      console.error('Get teacher classes error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get teacher classes error:', error);
    return [];
  }
}

export async function getTeacherAssignments(teacherId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.from('assignments').select('*').eq('teacher_id', teacherId).order('created_at', { ascending: false });

    if (error) {
      console.error('Get teacher assignments error:', error);
      return [];
    }

    // Get subject and class info separately
    const assignmentsWithDetails = [];
    for (const assignment of data || []) {
      const { data: subject } = await supabase.from('subjects').select('nama_mata_pelajaran, kode_mata_pelajaran').eq('id', assignment.subject_id).maybeSingle();

      const { data: classInfo } = await supabase.from('classes').select('nama_kelas').eq('id', assignment.class_id).maybeSingle();

      assignmentsWithDetails.push({
        ...assignment,
        subjects: subject,
        classes: classInfo,
      });
    }

    return assignmentsWithDetails;
  } catch (error) {
    console.error('Get teacher assignments error:', error);
    return [];
  }
}

// Class functions
export async function getAllClasses(): Promise<Class[]> {
  try {
    const { data, error } = await supabase.from('classes').select('*').eq('status', 'active').order('tingkat', { ascending: true });

    if (error) {
      console.error('Get all classes error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get all classes error:', error);
    return [];
  }
}

// Subject functions
export async function getAllSubjects(): Promise<Subject[]> {
  try {
    const { data, error } = await supabase.from('subjects').select('*').order('tingkat', { ascending: true }).order('nama_mata_pelajaran', { ascending: true });

    if (error) {
      console.error('Get all subjects error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get all subjects error:', error);
    return [];
  }
}

export async function getSubjectsByGrade(gradeLevel: number): Promise<Subject[]> {
  try {
    const { data, error } = await supabase.from('subjects').select('*').contains('tingkat', [gradeLevel]).order('nama_mata_pelajaran', { ascending: true });

    if (error) {
      console.error('Get subjects by grade error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get subjects by grade error:', error);
    return [];
  }
}

// Assignment functions
export async function createAssignment(assignmentData: {
  title: string;
  description: string | null;
  subject_id: string;
  class_id: string;
  teacher_id: string;
  due_date: string | null;
  max_score: number;
  status: 'draft' | 'published';
}): Promise<Assignment | null> {
  try {
    const { data, error } = await supabase.from('assignments').insert(assignmentData).select().single();

    if (error) {
      console.error('Create assignment error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Create assignment error:', error);
    return null;
  }
}

export async function updateAssignment(id: string, updates: Partial<Assignment>): Promise<Assignment | null> {
  try {
    const { data, error } = await supabase.from('assignments').update(updates).eq('id', id).select().single();

    if (error) {
      console.error('Update assignment error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Update assignment error:', error);
    return null;
  }
}

export async function deleteAssignment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('assignments').delete().eq('id', id);

    if (error) {
      console.error('Delete assignment error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete assignment error:', error);
    return false;
  }
}

// Notification functions
export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50);

    if (error) {
      console.error('Get user notifications error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get user notifications error:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);

    if (error) {
      console.error('Mark notification as read error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return false;
  }
}

export async function createNotification(userId: string, title: string, message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info'): Promise<boolean> {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
    });

    if (error) {
      console.error('Create notification error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Create notification error:', error);
    return false;
  }
}
