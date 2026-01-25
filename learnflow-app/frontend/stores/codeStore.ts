import { create } from 'zustand';
import type { CodeState, ExecutionResult } from '@/types';
import { api } from '@/lib/api';

interface CodeStore extends CodeState {
  // Exercise context
  exerciseId: string | null;
  exerciseTitle: string;

  // Actions
  setCode: (code: string) => void;
  setExerciseId: (id: string | null) => void;
  setExerciseTitle: (title: string) => void;
  runCode: () => Promise<void>;
  resetCode: (starterCode?: string) => void;
  clearOutput: () => void;
  clearError: () => void;
}

export const useCodeStore = create<CodeStore>((set, get) => ({
  // Initial state
  code: '',
  language: 'python',
  output: '',
  error: null,
  isRunning: false,
  exerciseId: null,
  exerciseTitle: '',

  // Set code
  setCode: (code: string) => set({ code }),

  // Set exercise ID
  setExerciseId: (id: string | null) => set({ exerciseId: id }),

  // Set exercise title
  setExerciseTitle: (title: string) => set({ exerciseTitle: title }),

  // Run code
  runCode: async () => {
    const { code, exerciseId } = get();
    if (!code.trim()) {
      set({ error: 'Please enter some code to run' });
      return;
    }

    set({ isRunning: true, error: null, output: '' });

    try {
      const response = await api.executeCode(code, exerciseId || undefined);

      if (response.success && response.data) {
        const result = response.data;
        if (result.success) {
          set({ output: result.output || 'Code executed successfully with no output', error: null });
        } else {
          set({ output: result.output || '', error: result.error || 'An error occurred' });
        }
      } else {
        set({ error: response.error || 'Failed to execute code' });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Network error' });
    } finally {
      set({ isRunning: false });
    }
  },

  // Reset code
  resetCode: (starterCode = '') => set({ code: starterCode, output: '', error: null }),

  // Clear output
  clearOutput: () => set({ output: '' }),

  // Clear error
  clearError: () => set({ error: null }),
}));

// Selectors
export const selectCode = (state: CodeStore) => state.code;
export const selectOutput = (state: CodeStore) => state.output;
export const selectError = (state: CodeStore) => state.error;
export const selectIsRunning = (state: CodeStore) => state.isRunning;
export const selectExerciseId = (state: CodeStore) => state.exerciseId;
export const selectExerciseTitle = (state: CodeStore) => state.exerciseTitle;
