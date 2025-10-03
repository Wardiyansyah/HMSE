// Subject Time Distribution
export async function getSubjectTimeDistribution(): Promise<Array<{ name: string; value: number; color?: string; percent?: number }>> {
  try {
    // Ambil user_progress (time_spent, content_module_id)
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('time_spent, content_module_id');
    if (error) {
      console.error('Get subject time distribution error:', error);
      return [];
    }
    // Ambil semua content_modules (id, learning_path_id)
    const { data: modules, error: modulesError } = await supabase
      .from('content_modules')
      .select('id, learning_path_id');
    if (modulesError) {
      console.error('Get content_modules error:', modulesError);
      return [];
    }
    // Ambil semua learning_paths (id, subject_area)
    const { data: paths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('id, subject_area');
    if (pathsError) {
      console.error('Get learning_paths error:', pathsError);
      return [];
    }
    // Build mapping: content_module_id -> subject_area
    const moduleToPath: Record<string, string> = {};
    for (const m of modules || []) {
      moduleToPath[m.id] = m.learning_path_id;
    }
    const pathToSubject: Record<string, string> = {};
    for (const p of paths || []) {
      pathToSubject[p.id] = p.subject_area;
    }
    // Group by subject name
    const grouped: Record<string, number> = {};
    let total = 0;
    for (const p of progress || []) {
      const moduleId = p.content_module_id;
      const pathId = moduleToPath[moduleId];
      const subject = pathToSubject[pathId];
      if (!subject) continue;
      if (!grouped[subject]) grouped[subject] = 0;
      grouped[subject] += Number(p.time_spent);
      total += Number(p.time_spent);
    }
    // Build result array
    const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#6366F1','#F472B6'];
    let i = 0;
    return Object.keys(grouped).map((name) => ({
      name,
      value: grouped[name],
      // return percent as fraction (0..1) for charting libraries that expect 0-1
      percent: total ? grouped[name] / total : 0,
      color: colors[i++ % colors.length],
    }));
  } catch (error) {
    console.error('Get subject time distribution error:', error);
    return [];
  }
}

// Subject Areas of Attention
export async function getSubjectAttentionAreas(): Promise<Array<{ name: string; percent_difficult: number; recommendation: string }>> {
  try {
    // Supabase JS client does not allow arbitrary raw SQL execution from the browser/runtime.
    // Untuk mencerminkan kueri SQL yang diberikan, ambil row current_grade + subject name lalu hitung
    // persentase siswa dengan nilai <75 per mata pelajaran di sisi client (ekuivalen hasil SQL).
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('current_grade, subjects(nama_mata_pelajaran)');
    if (progressError) {
      console.error('Get subject attention areas error:', progressError);
      return [];
    }

    const grouped: Record<string, { total: number; difficult: number }> = {};
    for (const p of (progress || []) as any[]) {
      // subjects may come back as an array (relationship) or single object depending on select
      const subj: any = (p as any).subjects;
      const subject = Array.isArray(subj) ? subj[0]?.nama_mata_pelajaran : subj?.nama_mata_pelajaran;
      if (!subject) continue;
      if (!grouped[subject]) grouped[subject] = { total: 0, difficult: 0 };
      grouped[subject].total++;
      if (Number(p.current_grade) < 75) grouped[subject].difficult++;
    }

    return Object.keys(grouped).map((name) => {
      const percent = grouped[name].total ? (grouped[name].difficult * 100.0) / grouped[name].total : 0;
      return {
        name,
        percent_difficult: Math.round(percent * 100) / 100,
        recommendation: percent > 20 ? 'Perlu Latihan Lebih' : 'Cukup Baik',
      };
    });
  } catch (error) {
    console.error('Get subject attention areas error:', error);
    return [];
  }
}
// Weekly Activity Analytics
export async function getWeeklyActivityTrend(): Promise<Array<{ day: string; hours: number }>> {
  try {
    // Ambil semua user_progress
    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('last_accessed, time_spent');
    if (error) {
      console.error('Get weekly activity trend error:', error);
      return [];
    }
    // Group by day name, sum time_spent (in minutes), convert to hours
    const grouped: Record<string, number> = {};
    for (const p of progress || []) {
      const date = new Date(p.last_accessed);
      // Get day name in English (e.g. 'Monday')
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!grouped[day]) grouped[day] = 0;
      grouped[day] += Number(p.time_spent);
    }
    // Convert to array, sort by day order (Mon-Sun)
    const dayOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const result = dayOrder.map((d) => ({
      day: d,
      hours: grouped[d] ? grouped[d] / 60.0 : 0,
    }));
    return result;
  } catch (error) {
    console.error('Get weekly activity trend error:', error);
    return [];
  }
}
// Performance Trend Analytics
export async function getPerformanceTrend(): Promise<Array<{ month: string; matematika?: number; fisika?: number; kimia?: number; biologi?: number }>> {
  // Ambil data grades dan subjects, lalu agregasi di client
  try {
    // Ambil semua grades dengan subject dan tanggal
    const { data: grades, error } = await supabase
      .from('grades')
      .select('score, graded_at, subject_id, subjects(nama_mata_pelajaran)');
    if (error) {
      console.error('Get performance trend error:', error);
      return [];
    }
    // Transform: group by month and subject, hitung rata-rata
    const grouped: Record<string, Record<string, number[]>> = {};
    for (const g of (grades || []) as any[]) {
      // Format bulan: YYYY-MM
      const date = new Date(g.graded_at);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  const subjAny: any = (g as any).subjects;
  const subjectName = Array.isArray(subjAny) ? subjAny[0]?.nama_mata_pelajaran : subjAny?.nama_mata_pelajaran || '';
  const subject = String(subjectName).toLowerCase();
  if (!grouped[month]) grouped[month] = {};
  if (!grouped[month][subject]) grouped[month][subject] = [];
  grouped[month][subject].push(Number(g.score));
    }
    // Build result array
    const result: Array<{ month: string; matematika?: number; fisika?: number; kimia?: number; biologi?: number }> = [];
    for (const month of Object.keys(grouped).sort()) {
      const row: any = { month };
      for (const subject of Object.keys(grouped[month])) {
        const avg = grouped[month][subject].reduce((a, b) => a + b, 0) / grouped[month][subject].length;
        if (subject.includes('matematika')) row.matematika = avg;
        else if (subject.includes('fisika')) row.fisika = avg;
        else if (subject.includes('kimia')) row.kimia = avg;
        else if (subject.includes('biologi')) row.biologi = avg;
      }
      result.push(row);
    }
    return result;
  } catch (error) {
    console.error('Get performance trend error:', error);
    return [];
  }
}
// Individual Student Performance by Subject
export async function getIndividualStudentPerformance(): Promise<Array<{ full_name: string; subject: string; average_score: number }>> {
  try {
    // Query grades joined with students, profiles, and subjects to compute average per student per subject
    const { data, error } = await supabase
      .from('grades')
      .select('score, student_id, subjects(nama_mata_pelajaran), students(user_id)');

    if (error) {
      console.error('Get individual student performance error:', error);
      return [];
    }

    // Build mapping student_id -> profile name
    const studentIds = Array.from(new Set((data || []).map((r: any) => r.student_id))).filter(Boolean);
    const { data: studentsProfiles } = await supabase.from('students').select('id, user_id').in('id', studentIds);

    const userIds = Array.from(new Set((studentsProfiles || []).map((s: any) => s.user_id))).filter(Boolean);
    const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);

    const studentIdToName: Record<string, string> = {};
    for (const s of studentsProfiles || []) {
      const profile = (profiles || []).find((p: any) => p.id === s.user_id);
      studentIdToName[s.id] = profile ? profile.full_name : s.id;
    }

    // Group scores by student name and subject
    const grouped: Record<string, Record<string, number[]>> = {};
    for (const row of (data || []) as any[]) {
      const studentId = row.student_id;
      const name = studentIdToName[studentId] || studentId;
      const subjAnyRow: any = row.subjects;
      const subject = Array.isArray(subjAnyRow) ? subjAnyRow[0]?.nama_mata_pelajaran || 'Unknown' : subjAnyRow?.nama_mata_pelajaran || 'Unknown';
      if (!grouped[name]) grouped[name] = {};
      if (!grouped[name][subject]) grouped[name][subject] = [];
      grouped[name][subject].push(Number(row.score));
    }

    const result: Array<{ full_name: string; subject: string; average_score: number }> = [];
    for (const name of Object.keys(grouped).sort()) {
      for (const subject of Object.keys(grouped[name])) {
        const scores = grouped[name][subject];
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        result.push({ full_name: name, subject, average_score: Math.round(avg * 100) / 100 });
      }
    }

    return result;
  } catch (error) {
    console.error('Get individual student performance error:', error);
    return [];
  }
}

// Risk predictions based on current grade and attendance
export async function getRiskPredictions(): Promise<Array<{ full_name: string; current_grade: number | null; attendance_rate: number | null; status_prediksi: 'Berisiko' | 'Aman' }>> {
  try {
    // Fetch student_progress with student relation
    const { data: progress, error } = await supabase
      .from('student_progress')
      .select('current_grade, attendance_rate, student_id, students(user_id)');

    if (error) {
      console.error('Get risk predictions error:', error);
      return [];
    }

    const studentIds = Array.from(new Set((progress || []).map((r: any) => r.student_id))).filter(Boolean);
    const { data: students } = await supabase.from('students').select('id, user_id').in('id', studentIds);

    const userIds = Array.from(new Set((students || []).map((s: any) => s.user_id))).filter(Boolean);
    const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);

    const userIdToName: Record<string, string> = {};
    for (const p of profiles || []) userIdToName[p.id] = p.full_name;
    const studentIdToUserId: Record<string, string> = {};
    for (const s of students || []) studentIdToUserId[s.id] = s.user_id;

    const result: Array<{ full_name: string; current_grade: number | null; attendance_rate: number | null; status_prediksi: 'Berisiko' | 'Aman' }> = [];
    for (const r of (progress || []) as any[]) {
      const studentId = r.student_id;
      const userId = studentIdToUserId[studentId];
      const fullName = userIdToName[userId] || 'Unknown';
      const grade = r.current_grade != null ? Number(r.current_grade) : null;
      const attendance = r.attendance_rate != null ? Number(r.attendance_rate) : null;
      const status = (grade != null && grade < 75) || (attendance != null && attendance < 80) ? 'Berisiko' : 'Aman';
      result.push({ full_name: fullName, current_grade: grade, attendance_rate: attendance, status_prediksi: status });
    }

    return result;
  } catch (error) {
    console.error('Get risk predictions error:', error);
    return [];
  }
}

export async function getGlobalStats(): Promise<{ total_siswa: number; rata_rata_nilai: number | null; total_jam_belajar: number; materi_selesai_persen: number }> {
  try {
    // Total students
    const { data: studentsCount, error: studentsError } = await supabase.from('students').select('id', { count: 'exact' });
    const total_siswa = Array.isArray(studentsCount) ? studentsCount.length : 0;

    // Average score
    const { data: gradesData, error: gradesError } = await supabase.from('grades').select('score');
    let rata_rata_nilai: number | null = null;
    if (!gradesError && gradesData && gradesData.length > 0) {
      const sum = gradesData.reduce((acc: number, g: any) => acc + Number(g.score || 0), 0);
      rata_rata_nilai = sum / gradesData.length;
    }

    // Total hours: sum time_spent (minutes) and convert to hours
    const { data: progressData, error: progressError } = await supabase.from('user_progress').select('time_spent, progress_percentage');
    let total_jam_belajar = 0;
    let materi_selesai_persen = 0;
    if (!progressError && progressData) {
      const totalMinutes = progressData.reduce((acc: number, p: any) => acc + Number(p.time_spent || 0), 0);
      total_jam_belajar = totalMinutes / 60.0;

      const total = progressData.length;
      const completed = progressData.filter((p: any) => Number(p.progress_percentage) === 100).length;
      materi_selesai_persen = total ? (completed / total) * 100 : 0;
    }

    return { total_siswa, rata_rata_nilai, total_jam_belajar, materi_selesai_persen };
  } catch (error) {
    console.error('Get global stats error:', error);
    return { total_siswa: 0, rata_rata_nilai: null, total_jam_belajar: 0, materi_selesai_persen: 0 };
  }
}

// Teacher dashboard statistics with recent comparisons
export async function getDashboardTeacherStats(): Promise<{
  total_siswa_active: number;
  students_by_month_last2: Array<{ month: string; count: number }>;
  rata_rata_nilai: number | null;
  grades_by_month_last2: Array<{ month: string; rata_rata_nilai: number }>;
  total_jam_belajar: number;
  jam_belajar_by_week_last2: Array<{ week: string; jam_belajar: number }>;
  materi_selesai_persen: number;
  materi_selesai_by_month_last2: Array<{ month: string; materi_selesai_persen: number }>;
}> {
  try {
    // Students: count active and group by created_at month
    const { data: studentsData, error: studentsError } = await supabase.from('students').select('id, created_at').eq('status', 'active');
    const students = (studentsData || []) as any[];
    const total_siswa_active = students.length;

    const studentsByMonth: Record<string, number> = {};
    for (const s of students) {
      if (!s.created_at) continue;
      const d = new Date(s.created_at);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      studentsByMonth[month] = (studentsByMonth[month] || 0) + 1;
    }
    const studentsByMonthArr = Object.keys(studentsByMonth)
      .sort()
      .map((m) => ({ month: m, count: studentsByMonth[m] }))
      .sort((a, b) => (a.month < b.month ? -1 : 1));
    const students_by_month_last2 = studentsByMonthArr.slice(-2).reverse();

    // Grades: average overall and average by month
    const { data: gradesData, error: gradesError } = await supabase.from('grades').select('score, graded_at');
    const grades = (gradesData || []) as any[];
    let rata_rata_nilai: number | null = null;
    if (grades.length) {
      const sum = grades.reduce((acc: number, g: any) => acc + Number(g.score || 0), 0);
      rata_rata_nilai = Math.round((sum / grades.length) * 100) / 100;
    }
    const gradesByMonth: Record<string, number[]> = {};
    for (const g of grades) {
      if (!g.graded_at) continue;
      const d = new Date(g.graded_at);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!gradesByMonth[month]) gradesByMonth[month] = [];
      gradesByMonth[month].push(Number(g.score || 0));
    }
    const gradesByMonthArr = Object.keys(gradesByMonth)
      .sort()
      .map((m) => ({ month: m, rata_rata_nilai: Math.round((gradesByMonth[m].reduce((a, b) => a + b, 0) / gradesByMonth[m].length) * 100) / 100 }));
    const grades_by_month_last2 = gradesByMonthArr.slice(-2).reverse();

    // User progress: total hours and week grouping
    const { data: progressData, error: progressError } = await supabase.from('user_progress').select('time_spent, last_accessed, progress_percentage, completed_at');
    const progress = (progressData || []) as any[];
    const totalMinutes = progress.reduce((acc: number, p: any) => acc + Number(p.time_spent || 0), 0);
    const total_jam_belajar = Math.round(totalMinutes / 60.0);

    // Group by ISO week
    function getISOWeekKey(d: Date) {
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      // Thursday in current week decides the year.
      date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
    }

    const jamByWeek: Record<string, number> = {};
    for (const p of progress) {
      if (!p.last_accessed) continue;
      const d = new Date(p.last_accessed);
      const wk = getISOWeekKey(d);
      jamByWeek[wk] = (jamByWeek[wk] || 0) + Number(p.time_spent || 0) / 60.0;
    }
    const jamByWeekArr = Object.keys(jamByWeek)
      .sort()
      .map((w) => ({ week: w, jam_belajar: Math.round(jamByWeek[w]) }));
    const jam_belajar_by_week_last2 = jamByWeekArr.slice(-2).reverse();

    // Materi selesai percent overall and by completed_at month
    const total = progress.length;
    const completed = progress.filter((p) => Number(p.progress_percentage) === 100).length;
    const materi_selesai_persen = total ? Math.round((completed / total) * 100 * 100) / 100 : 0;

    const completedByMonth: Record<string, { total: number; completed: number }> = {};
    for (const p of progress) {
      if (!p.completed_at) continue;
      const d = new Date(p.completed_at);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!completedByMonth[month]) completedByMonth[month] = { total: 0, completed: 0 };
      completedByMonth[month].total++;
      if (Number(p.progress_percentage) === 100) completedByMonth[month].completed++;
    }
    const completedByMonthArr = Object.keys(completedByMonth)
      .sort()
      .map((m) => ({ month: m, materi_selesai_persen: Math.round((completedByMonth[m].completed / completedByMonth[m].total) * 100 * 100) / 100 }));
    const materi_selesai_by_month_last2 = completedByMonthArr.slice(-2).reverse();

    return {
      total_siswa_active,
      students_by_month_last2,
      rata_rata_nilai,
      grades_by_month_last2,
      total_jam_belajar,
      jam_belajar_by_week_last2,
      materi_selesai_persen,
      materi_selesai_by_month_last2,
    };
  } catch (error) {
    console.error('Get dashboard teacher stats error:', error);
    return {
      total_siswa_active: 0,
      students_by_month_last2: [],
      rata_rata_nilai: null,
      grades_by_month_last2: [],
      total_jam_belajar: 0,
      jam_belajar_by_week_last2: [],
      materi_selesai_persen: 0,
      materi_selesai_by_month_last2: [],
    };
  }
}

// Average progress per subject area (learning_paths.subject_area)
export async function getAverageProgressBySubject(): Promise<Array<{ mata_pelajaran: string; rata_rata_progress: number }>> {
  try {
    // Fetch user_progress progress_percentage and content_module_id
    const { data: progress, error: progressError } = await supabase.from('user_progress').select('progress_percentage, content_module_id');
    if (progressError) {
      console.error('Get average progress by subject error:', progressError);
      return [];
    }

    // Fetch modules mapping
    const { data: modules, error: modulesError } = await supabase.from('content_modules').select('id, learning_path_id');
    if (modulesError) {
      console.error('Get content_modules error:', modulesError);
      return [];
    }

    // Fetch learning paths mapping
    const { data: paths, error: pathsError } = await supabase.from('learning_paths').select('id, subject_area');
    if (pathsError) {
      console.error('Get learning_paths error:', pathsError);
      return [];
    }

    const moduleToPath: Record<string, string> = {};
    for (const m of modules || []) moduleToPath[m.id] = m.learning_path_id;

    const pathToSubject: Record<string, string> = {};
    for (const p of paths || []) pathToSubject[p.id] = p.subject_area;

    const grouped: Record<string, { total: number; count: number }> = {};
    for (const p of (progress || []) as any[]) {
      const moduleId = p.content_module_id;
      const pathId = moduleToPath[moduleId];
      const subject = pathToSubject[pathId];
      if (!subject) continue;
      if (!grouped[subject]) grouped[subject] = { total: 0, count: 0 };
      grouped[subject].total += Number(p.progress_percentage || 0);
      grouped[subject].count += 1;
    }

    const result = Object.keys(grouped).map((name) => ({
      mata_pelajaran: name,
      rata_rata_progress: grouped[name].count ? Math.round((grouped[name].total / grouped[name].count) * 100) / 100 : 0,
    }));

    // Sort descending by average progress
    result.sort((a, b) => b.rata_rata_progress - a.rata_rata_progress);
    return result;
  } catch (error) {
    console.error('Get average progress by subject error:', error);
    return [];
  }
}
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

// Analytics Data functions
export interface AnalyticsData {
  id: string;
  type: string; // 'performance', 'subject_distribution', 'weekly_activity', 'student_progress', etc
  data: any;
  created_at: string;
}

export async function getAnalyticsData(type?: string): Promise<AnalyticsData[]> {
  try {
    let query = supabase.from('analytics_data').select('*');
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Get analytics_data error:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Get analytics_data error:', error);
    return [];
  }
}
