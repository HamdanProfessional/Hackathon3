// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  avatar?: string;
  createdAt?: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface Teacher extends User {
  role: 'teacher';
  teacherId: string;
  subjects: string[];
}

// Progress and Learning Types
export interface StudentProgress {
  studentId: string;
  masteryLevel: number; // 0-100
  streak: number;
  lastActivity: string;
  modules: ModuleProgress[];
  exerciseScore: number;
  quizScore: number;
  codeQuality: number;
}

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  mastery: number; // 0-100
  completed: boolean;
  inProgress: boolean;
  exercisesCompleted: number;
  totalExercises: number;
}

export type MasteryLevel = 'beginner' | 'learning' | 'proficient' | 'mastered';

// Exercise Types
export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  moduleId: string;
  instructions: string;
  starterCode?: string;
  hints: string[];
  timeLimit?: number;
  testCases?: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ExerciseSubmission {
  exerciseId: string;
  code: string;
  studentId: string;
  submittedAt: string;
}

export interface ExerciseResult {
  success: boolean;
  score: number;
  feedback: string;
  output?: string;
  error?: string;
  testResults?: TestResult[];
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput?: string;
}

// Code Editor Types
export interface CodeState {
  code: string;
  language: string;
  output: string;
  error: string | null;
  isRunning: boolean;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

// Chat and AI Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentType?: 'triage' | 'concepts' | 'debug' | 'exercise' | 'progress';
}

export interface Conversation {
  id: string;
  studentId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: ChatContext;
}

export interface ChatContext {
  currentExercise?: string;
  currentModule?: string;
  codeSnippet?: string;
  errorContext?: string;
}

export interface StreamingResponse {
  chunk: string;
  done: boolean;
  agentType?: string;
}

// Triage and Debug Types
export interface TriageResult {
  category: 'concept' | 'debug' | 'exercise' | 'general';
  agent: 'concepts' | 'debug' | 'exercise' | 'progress';
  confidence: number;
}

export interface DebugAnalysis {
  error: string;
  explanation: string;
  hints: string[];
  suggestedFix?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ConceptExplanation {
  concept: string;
  explanation: string;
  examples: string[];
  relatedConcepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Alert and Monitoring Types
export interface StruggleAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: 'repeated_error' | 'time_spent' | 'low_quiz_score' | 'help_request' | 'failed_executions';
  severity: 'low' | 'medium' | 'high';
  message: string;
  context: {
    exerciseId?: string;
    error?: string;
    timeSpent?: number;
    attempts?: number;
  };
  createdAt: string;
  resolved: boolean;
}

export interface ClassOverview {
  totalStudents: number;
  activeToday: number;
  strugglingCount: number;
  averageMastery: number;
  topPerformers: Student[];
  strugglingStudents: Student[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Activity Types
export interface Activity {
  id: string;
  studentId: string;
  studentName: string;
  type: 'exercise_completed' | 'quiz_passed' | 'streak_milestone' | 'level_up' | 'module_completed';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}
