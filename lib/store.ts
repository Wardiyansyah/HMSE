import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser, getUserProfile } from '@/lib/auth-helpers';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'professional';
  avatar?: string;
  preferences: {
    language: 'id' | 'en';
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    aiAssistance: boolean;
  };
}

interface LearningProgress {
  subject: string;
  progress: number;
  lastAccessed: Date;
  timeSpent: number;
}

interface AppState {
  user: User | null;
  learningProgress: LearningProgress[];
  currentSession: {
    startTime: Date | null;
    subject: string | null;
    activity: string | null;
  };
  setUser: (user: User) => void;
  refreshUser: () => Promise<void>;
  updateProgress: (subject: string, progress: number) => void;
  startSession: (subject: string, activity: string) => void;
  endSession: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      learningProgress: [
        { subject: 'Matematika', progress: 85, lastAccessed: new Date(), timeSpent: 120 },
        { subject: 'Fisika', progress: 72, lastAccessed: new Date(), timeSpent: 95 },
        { subject: 'Kimia', progress: 91, lastAccessed: new Date(), timeSpent: 110 },
        { subject: 'Biologi', progress: 68, lastAccessed: new Date(), timeSpent: 80 },
      ],
      currentSession: {
        startTime: null,
        subject: null,
        activity: null,
      },
      setUser: (user) => set({ user }),
      refreshUser: async () => {
        const { getCurrentUser } = await import('@/lib/auth-helpers');
        const { user } = await getCurrentUser();
        if (user) {
          let mappedRole: 'student' | 'teacher' | 'professional' =
            user.role === 'admin' ? 'professional' : user.role;
          set({
            user: {
              id: user.id,
              name: user.full_name || user.username,
              email: user.email,
              role: mappedRole,
              avatar: user.avatar_url,
              preferences: {
                language: 'id',
                theme: 'light',
                notifications: true,
                aiAssistance: true,
              },
            },
          });
        } else {
          set({ user: null });
        }
      },
      updateProgress: (subject, progress) =>
        set((state) => ({
          learningProgress: state.learningProgress.map((p) => (p.subject === subject ? { ...p, progress, lastAccessed: new Date() } : p)),
        })),
      startSession: (subject, activity) =>
        set({
          currentSession: {
            startTime: new Date(),
            subject,
            activity,
          },
        }),
      endSession: () =>
        set({
          currentSession: {
            startTime: null,
            subject: null,
            activity: null,
          },
        }),
      updateUserPreferences: (preferences) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: { ...state.user.preferences, ...preferences },
              }
            : null,
        })),
    }),
    {
      name: 'edugenai-store',
      onRehydrateStorage: () => async (state) => {
        // Fetch current user from session/db
        const { getCurrentUser } = await import('@/lib/auth-helpers');
        const { user } = await getCurrentUser();
        if (user) {
          // Map 'admin' role to 'professional' for AppState.User compatibility
          let mappedRole: 'student' | 'teacher' | 'professional' =
            user.role === 'admin' ? 'professional' : user.role;
          state?.setUser({
            id: user.id,
            name: user.full_name || user.username,
            email: user.email,
            role: mappedRole,
            avatar: user.avatar_url,
            preferences: {
              language: 'id',
              theme: 'light',
              notifications: true,
              aiAssistance: true,
            },
          });
        }
      },
    }
  )
);

// Auth store for authentication state
interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  profile: any | null;
  studentData: any | null;
  teacherData: any | null;
  isLoading: boolean;
  setUser: (user: any | null) => void;
  setProfile: (profile: any | null) => void;
  setStudentData: (student: any | null) => void;
  setTeacherData: (teacher: any | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      profile: null,
      studentData: null,
      teacherData: null,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setProfile: (profile) => set({ profile }),
      setStudentData: (studentData) => set({ studentData }),
      setTeacherData: (teacherData) => set({ teacherData }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          user: null,
          profile: null,
          studentData: null,
          teacherData: null,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        studentData: state.studentData,
        teacherData: state.teacherData,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
