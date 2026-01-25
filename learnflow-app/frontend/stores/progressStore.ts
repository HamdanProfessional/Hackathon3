import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StudentProgress, ModuleProgress, Activity, StruggleAlert } from '@/types';
import { api } from '@/lib/api';

interface ProgressStore {
  // State
  progress: StudentProgress | null;
  modules: ModuleProgress[];
  activities: Activity[];
  struggleAlerts: StruggleAlert[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProgress: (studentId: string) => Promise<void>;
  setProgress: (progress: StudentProgress) => void;
  updateModuleProgress: (moduleId: string, mastery: number) => void;
  incrementStreak: () => void;
  fetchActivities: (studentId?: string, limit?: number) => Promise<void>;
  fetchStruggleAlerts: (classId?: string, resolved?: boolean) => Promise<void>;
  clearError: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      // Initial state
      progress: null,
      modules: [],
      activities: [],
      struggleAlerts: [],
      isLoading: false,
      error: null,

      // Fetch progress from API
      fetchProgress: async (studentId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.getStudentProgress(studentId);
          if (response.success && response.data) {
            set({
              progress: response.data,
              modules: response.data.modules || [],
              isLoading: false,
            });
          } else {
            set({
              error: response.error || 'Failed to fetch progress',
              isLoading: false,
            });
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Network error',
            isLoading: false,
          });
        }
      },

      // Set progress directly
      setProgress: (progress: StudentProgress) => {
        set({ progress, modules: progress.modules || [] });
      },

      // Update module mastery
      updateModuleProgress: (moduleId: string, mastery: number) => {
        set((state) => ({
          modules: state.modules.map((m) =>
            m.moduleId === moduleId ? { ...m, mastery } : m
          ),
          progress: state.progress
            ? {
                ...state.progress,
                modules: state.progress.modules.map((m) =>
                  m.moduleId === moduleId ? { ...m, mastery } : m
                ),
              }
            : null,
        }));
      },

      // Increment streak
      incrementStreak: () => {
        set((state) => ({
          progress: state.progress
            ? { ...state.progress, streak: state.progress.streak + 1 }
            : null,
        }));
      },

      // Fetch activities
      fetchActivities: async (studentId?: string, limit: number = 20) => {
        try {
          const response = await api.getActivityFeed(studentId, limit);
          if (response.success && response.data) {
            set({ activities: (response.data as unknown as { activities: Activity[] }).activities || [] });
          }
        } catch {
          // Silently fail for activities
        }
      },

      // Fetch struggle alerts (for teachers)
      fetchStruggleAlerts: async (classId?: string, resolved: boolean = false) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.getStruggleAlerts(classId, resolved);
          if (response.success && response.data) {
            set({
              struggleAlerts: (response.data as unknown as { alerts: StruggleAlert[] }).alerts || [],
              isLoading: false,
            });
          } else {
            set({
              error: response.error || 'Failed to fetch alerts',
              isLoading: false,
            });
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Network error',
            isLoading: false,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'learnflow-progress-storage',
      partialize: (state) => ({
        progress: state.progress,
        modules: state.modules,
      }),
    }
  )
);

// Selectors
export const selectProgress = (state: ProgressStore) => state.progress;
export const selectMasteryLevel = (state: ProgressStore) => state.progress?.masteryLevel || 0;
export const selectStreak = (state: ProgressStore) => state.progress?.streak || 0;
export const selectModules = (state: ProgressStore) => state.modules;
export const selectActivities = (state: ProgressStore) => state.activities;
export const selectStruggleAlerts = (state: ProgressStore) => state.struggleAlerts;
export const selectIsProgressLoading = (state: ProgressStore) => state.isLoading;
export const selectProgressError = (state: ProgressStore) => state.error;

// Helper: Get mastery level category
export const getMasteryCategory = (mastery: number): 'beginner' | 'learning' | 'proficient' | 'mastered' => {
  if (mastery <= 40) return 'beginner';
  if (mastery <= 70) return 'learning';
  if (mastery <= 90) return 'proficient';
  return 'mastered';
};

// Helper: Get color for mastery level
export const getMasteryColor = (mastery: number): string => {
  const category = getMasteryCategory(mastery);
  const colors = {
    beginner: 'bg-red-500',
    learning: 'bg-yellow-500',
    proficient: 'bg-green-500',
    mastered: 'bg-blue-500',
  };
  return colors[category];
};

// Helper: Get text color for mastery level
export const getMasteryTextColor = (mastery: number): string => {
  const category = getMasteryCategory(mastery);
  const colors = {
    beginner: 'text-red-600',
    learning: 'text-yellow-600',
    proficient: 'text-green-600',
    mastered: 'text-blue-600',
  };
  return colors[category];
};
