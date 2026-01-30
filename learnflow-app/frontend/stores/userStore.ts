import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Student, Teacher } from '@/types';
import * as auth from '@/lib/auth';

interface UserStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean; // Internal flag to track hydration

  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'student' | 'teacher') => Promise<boolean>;
  checkAuth: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      // Set user
      setUser: (user: User) => {
        auth.setUser(user);
        auth.setAuthToken(user.id); // For MVP, use user ID as token placeholder
        set({ user, isAuthenticated: true });
      },

      // Logout
      logout: () => {
        auth.logout();
        set({ user: null, isAuthenticated: false });
      },

      // Login
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await auth.login({ email, password });
          if (response.success && response.user && response.token) {
            set({ user: response.user, isAuthenticated: true, isLoading: false });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      // Register
      register: async (email: string, password: string, name: string, role: 'student' | 'teacher') => {
        set({ isLoading: true });
        try {
          const response = await auth.register({ email, password, name, role });
          if (response.success && response.user && response.token) {
            set({ user: response.user, isAuthenticated: true, isLoading: false });
            return true;
          }
          set({ isLoading: false });
          return false;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      // Check authentication status
      checkAuth: () => {
        const isValid = auth.isAuthenticated();
        const user = auth.getUser();
        set({ isAuthenticated: isValid, user });
      },
    }),
    {
      name: 'learnflow-user-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state._hasHydrated = true;
      },
    }
  )
);

// Selectors
export const selectUser = (state: UserStore) => state.user;
export const selectIsAuthenticated = (state: UserStore) => state.isAuthenticated;
export const selectUserRole = (state: UserStore) => state.user?.role;
export const selectIsStudent = (state: UserStore) => state.user?.role === 'student';
export const selectIsTeacher = (state: UserStore) => state.user?.role === 'teacher';
export const selectIsLoading = (state: UserStore) => state.isLoading;
export const selectHasHydrated = (state: UserStore) => state._hasHydrated;

