import type {
  ApiResponse,
  ChatContext,
  TriageResult,
  ConceptExplanation,
  DebugAnalysis,
  Exercise,
  ExerciseSubmission,
  ExerciseResult,
  StudentProgress,
  ExecutionResult,
  StruggleAlert,
  ClassOverview,
} from '@/types';

// Service URLs - use Next.js API route proxy for production (HTTPS)
// to avoid mixed content issues. The API routes run server-side and can
// fetch from HTTP backends without browser restrictions.
const USE_PROXY = typeof window !== 'undefined' && window.location.protocol === 'https:';

const getBaseUrl = (serviceName: string, directUrl: string) => {
  if (USE_PROXY) {
    // Use Next.js API route proxy (server-side, can fetch HTTP)
    return `/api/proxy/${serviceName}`;
  }
  return directUrl;
};

const SERVICES = {
  triage: getBaseUrl('triage', (process.env.NEXT_PUBLIC_TRIAGE_URL || 'http://localhost:8001').trim()),
  concepts: getBaseUrl('concepts', (process.env.NEXT_PUBLIC_CONCEPTS_URL || 'http://localhost:8002').trim()),
  debug: getBaseUrl('debug', (process.env.NEXT_PUBLIC_DEBUG_URL || 'http://localhost:8003').trim()),
  exercise: getBaseUrl('exercise', (process.env.NEXT_PUBLIC_EXERCISE_URL || 'http://localhost:8004').trim()),
  progress: getBaseUrl('progress', (process.env.NEXT_PUBLIC_PROGRESS_URL || 'http://localhost:8005').trim()),
  codeReview: getBaseUrl('codeReview', (process.env.NEXT_PUBLIC_CODE_REVIEW_URL || 'http://localhost:8006').trim()),
  chat: getBaseUrl('chat', (process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:8007').trim()),
};

/**
 * Get the authentication token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('learnflow_token');
}

/**
 * Base API request function with authentication and timeout
 */
async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000 // 30 second default timeout
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    // Clear timeout on successful response
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: `Request timeout after ${timeoutMs}ms`,
        };
      }
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: 'Network error',
    };
  }
}

// ============================================================================
// TRIAGE SERVICE
// ============================================================================

/**
 * Route a student query to the appropriate agent
 */
export async function triageQuery(query: string): Promise<ApiResponse<TriageResult>> {
  return apiRequest<TriageResult>(`${SERVICES.triage}/api/v1/triage`, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

// ============================================================================
// CONCEPTS SERVICE
// ============================================================================

/**
 * Get an explanation for a Python concept
 */
export async function explainConcept(
  concept: string,
  level?: 'beginner' | 'intermediate' | 'advanced'
): Promise<ApiResponse<ConceptExplanation>> {
  return apiRequest<ConceptExplanation>(`${SERVICES.concepts}/api/v1/concepts/explain`, {
    method: 'POST',
    body: JSON.stringify({ concept, level }),
  });
}

/**
 * Chat with the concepts agent
 */
export async function chatWithConcepts(
  message: string,
  context?: ChatContext
): Promise<ApiResponse<{ response: string }>> {
  return apiRequest(`${SERVICES.concepts}/api/v1/concepts/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
}

// ============================================================================
// DEBUG SERVICE
// ============================================================================

/**
 * Analyze code for errors and get debugging help
 */
export async function analyzeCodeError(
  code: string,
  error?: string
): Promise<ApiResponse<DebugAnalysis>> {
  return apiRequest<DebugAnalysis>(`${SERVICES.debug}/api/v1/debug/analyze`, {
    method: 'POST',
    body: JSON.stringify({ code, error }),
  });
}

/**
 * Get progressive hints for debugging
 */
export async function getDebugHints(
  code: string,
  error: string,
  hintLevel: number = 1
): Promise<ApiResponse<{ hints: string[] }>> {
  return apiRequest(`${SERVICES.debug}/api/v1/debug/hints`, {
    method: 'POST',
    body: JSON.stringify({ code, error, hintLevel }),
  });
}

// ============================================================================
// EXERCISE SERVICE
// ============================================================================

/**
 * Generate a new exercise
 */
export async function generateExercise(
  moduleId: string,
  difficulty?: 'easy' | 'medium' | 'hard',
  topic?: string
): Promise<ApiResponse<Exercise>> {
  return apiRequest<Exercise>(`${SERVICES.exercise}/generate`, {
    method: 'POST',
    body: JSON.stringify({ moduleId, difficulty, topic }),
  });
}

/**
 * Get an exercise by ID
 */
export async function getExercise(exerciseId: string): Promise<ApiResponse<Exercise>> {
  return apiRequest<Exercise>(`${SERVICES.exercise}/exercise/${exerciseId}`);
}

/**
 * Submit an exercise solution
 */
export async function submitExercise(
  submission: ExerciseSubmission
): Promise<ApiResponse<ExerciseResult>> {
  return apiRequest<ExerciseResult>(`${SERVICES.exercise}/submit`, {
    method: 'POST',
    body: JSON.stringify(submission),
  });
}

/**
 * Get all modules
 */
export async function getModules(): Promise<ApiResponse<Record<string, {
  id: string;
  name: string;
  order: number;
  topics: string[];
  exercises: string[];
}>>> {
  return apiRequest(`${SERVICES.exercise}/modules`);
}

/**
 * Execute Python code
 */
export async function executeCode(
  code: string,
  exerciseId?: string
): Promise<ApiResponse<ExecutionResult>> {
  return apiRequest<ExecutionResult>(`${SERVICES.exercise}/api/v1/execute`, {
    method: 'POST',
    body: JSON.stringify({ code, exerciseId }),
  });
}

// ============================================================================
// PROGRESS SERVICE
// ============================================================================

/**
 * Get student progress
 */
export async function getStudentProgress(
  studentId: string
): Promise<ApiResponse<StudentProgress>> {
  return apiRequest<StudentProgress>(`${SERVICES.progress}/progress/${studentId}`);
}

/**
 * Update student progress
 */
export async function updateProgress(
  studentId: string,
  data: Partial<StudentProgress>
): Promise<ApiResponse<StudentProgress>> {
  return apiRequest<StudentProgress>(`${SERVICES.progress}/update`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get class progress (for teachers)
 */
export async function getClassProgress(
  classId: string
): Promise<ApiResponse<StudentProgress[]>> {
  return apiRequest<StudentProgress[]>(`${SERVICES.progress}/progress/class/${classId}`);
}

/**
 * Get activity feed
 */
export async function getActivityFeed(
  studentId?: string,
  limit: number = 20
): Promise<ApiResponse<{ activities: unknown[] }>> {
  const url = studentId
    ? `${SERVICES.progress}/api/v1/activity/${studentId}?limit=${limit}`
    : `${SERVICES.progress}/api/v1/activity?limit=${limit}`;
  return apiRequest(url);
}

// ============================================================================
// CODE REVIEW SERVICE
// ============================================================================

/**
 * Review code for quality and best practices
 */
export async function reviewCode(code: string): Promise<ApiResponse<{
  score: number;
  feedback: string;
  suggestions: string[];
  issues: Array<{ severity: string; message: string; line?: number }>;
}>> {
  return apiRequest(`${SERVICES.codeReview}/api/v1/review`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

// ============================================================================
// TEACHER DASHBOARD
// ============================================================================

/**
 * Get class overview for teachers
 */
export async function getClassOverview(
  classId: string
): Promise<ApiResponse<ClassOverview>> {
  return apiRequest<ClassOverview>(`${SERVICES.progress}/api/v1/class/${classId}/overview`);
}

/**
 * Get struggle alerts for teachers
 */
export async function getStruggleAlerts(
  classId?: string,
  resolved: boolean = false
): Promise<ApiResponse<{ alerts: StruggleAlert[] }>> {
  const params = new URLSearchParams({
    ...(classId && { classId }),
    resolved: resolved.toString(),
  });
  return apiRequest(`${SERVICES.progress}/api/v1/alerts?${params}`);
}

/**
 * Mark a struggle alert as resolved
 */
export async function resolveAlert(alertId: string): Promise<ApiResponse<void>> {
  return apiRequest<void>(`${SERVICES.progress}/api/v1/alerts/${alertId}/resolve`, {
    method: 'PATCH',
  });
}

// ============================================================================
// CHAT SERVICE (Persistent Conversations)
// ============================================================================

/**
 * Create a new conversation
 */
export async function createConversation(
  studentId: string,
  title?: string
): Promise<ApiResponse<{
  conversation_id: string;
  student_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}>> {
  return apiRequest(`${SERVICES.chat}/api/v1/conversations`, {
    method: 'POST',
    body: JSON.stringify({ student_id: studentId, title }),
  });
}

/**
 * List all conversations for a student
 */
export async function listConversations(
  studentId: string,
  limit: number = 50,
  offset: number = 0
): Promise<ApiResponse<{
  conversations: Array<{
    conversation_id: string;
    student_id: string;
    title: string;
    created_at: string;
    updated_at: string;
  }>;
  total_count: number;
}>> {
  return apiRequest(`${SERVICES.chat}/api/v1/conversations/${studentId}?limit=${limit}&offset=${offset}`);
}

/**
 * Get a conversation with all its messages
 */
export async function getConversation(
  conversationId: string
): Promise<ApiResponse<{
  conversation_id: string;
  student_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Array<{
    message_id: string;
    conversation_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
}>> {
  return apiRequest(`${SERVICES.chat}/api/v1/conversations/${conversationId}/details`);
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Promise<ApiResponse<{
  message_id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}>> {
  return apiRequest(`${SERVICES.chat}/api/v1/messages`, {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: conversationId,
      role,
      content,
    }),
  });
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  conversationId: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest(`${SERVICES.chat}/api/v1/conversations/${conversationId}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// SSE (Server-Sent Events) SUPPORT
// ============================================================================

/**
 * Subscribe to struggle alerts via SSE
 * Returns an EventSource that can be closed when done
 */
export function subscribeToStruggleAlerts(
  classId: string,
  onAlert: (alert: StruggleAlert) => void,
  onError?: (error: Event) => void
): EventSource {
  const token = getAuthToken();
  const url = new URL(`${SERVICES.progress}/api/v1/alerts/stream`);
  url.searchParams.set('classId', classId);
  if (token) {
    url.searchParams.set('token', token);
  }

  const eventSource = new EventSource(url.toString());

  eventSource.onmessage = (event) => {
    try {
      const alert = JSON.parse(event.data);
      onAlert(alert);
    } catch (error) {
      console.error('Failed to parse SSE data:', error);
    }
  };

  eventSource.onerror = (error) => {
    if (onError) {
      onError(error);
    }
    // EventSource will automatically reconnect
  };

  return eventSource;
}

/**
 * Subscribe to class stats updates via SSE
 */
export function subscribeToClassStats(
  classId: string,
  onStats: (stats: ClassOverview) => void,
  onError?: (error: Event) => void
): EventSource {
  const token = getAuthToken();
  const url = new URL(`${SERVICES.progress}/api/v1/class/${classId}/stats/stream`);
  if (token) {
    url.searchParams.set('token', token);
  }

  const eventSource = new EventSource(url.toString());

  eventSource.onmessage = (event) => {
    try {
      const stats = JSON.parse(event.data);
      onStats(stats);
    } catch (error) {
      console.error('Failed to parse SSE data:', error);
    }
  };

  eventSource.onerror = (error) => {
    if (onError) {
      onError(error);
    }
  };

  return eventSource;
}

// ============================================================================
// TEACHER EXERCISE GENERATION
// ============================================================================

/**
 * Generate a custom exercise for a student
 */
export async function generateExerciseForStudent(
  studentId: string,
  moduleId: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  topic?: string
): Promise<ApiResponse<{ exercise: Exercise }>> {
  return apiRequest(`${SERVICES.exercise}/api/v1/teacher/exercise/generate`, {
    method: 'POST',
    body: JSON.stringify({
      studentId,
      moduleId,
      difficulty,
      topic,
    }),
  });
}

/**
 * Assign an exercise to a student
 */
export async function assignExerciseToStudent(
  studentId: string,
  exerciseId: string,
  note?: string
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest(`${SERVICES.progress}/api/v1/teacher/assign`, {
    method: 'POST',
    body: JSON.stringify({
      studentId,
      exerciseId,
      note,
    }),
  });
}

/**
 * Get student work history
 */
export async function getStudentWorkHistory(
  studentId: string,
  limit: number = 20
): Promise<ApiResponse<{
  submissions: Array<{
    exerciseId: string;
    code: string;
    result: ExerciseResult;
    submittedAt: string;
  }>;
}>> {
  return apiRequest(`${SERVICES.progress}/api/v1/teacher/student/${studentId}/work?limit=${limit}`);
}

// ============================================================================
// TEACHER ASSIGNMENT GENERATION (AI-Powered)
// ============================================================================

/**
 * Generate a custom assignment based on teacher's prompt and difficulty
 */
export async function generateTeacherAssignment(
  prompt: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  topic?: string,
  moduleId?: string
): Promise<ApiResponse<{
  exercise: Exercise;
  preview: string;
}>> {
  return apiRequest(`${SERVICES.exercise}/api/v1/teacher/generate-assignment`, {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      difficulty,
      topic,
      module_id: moduleId,
    }),
  });
}

/**
 * Save and assign a generated exercise to students
 */
export async function saveTeacherAssignment(
  exerciseId: string,
  studentIds: string[],
  note?: string
): Promise<ApiResponse<{
  message: string;
  exercise_id: string;
  assigned_students: string[];
  note?: string;
}>> {
  return apiRequest(`${SERVICES.exercise}/api/v1/teacher/save-assignment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      exercise_id: exerciseId,
      student_ids: studentIds,
      note,
    }),
  });
}

// ============================================================================
// EXPORT ALL SERVICES
// ============================================================================

export const api = {
  // Triage
  triageQuery,

  // Concepts
  explainConcept,
  chatWithConcepts,

  // Debug
  analyzeCodeError,
  getDebugHints,

  // Exercise
  generateExercise,
  getExercise,
  submitExercise,
  executeCode,

  // Progress
  getStudentProgress,
  updateProgress,
  getClassProgress,
  getActivityFeed,

  // Code Review
  reviewCode,

  // Teacher
  getClassOverview,
  getStruggleAlerts,
  resolveAlert,
  generateExerciseForStudent,
  assignExerciseToStudent,
  getStudentWorkHistory,
  generateTeacherAssignment,
  saveTeacherAssignment,

  // SSE
  subscribeToStruggleAlerts,
  subscribeToClassStats,

  // Chat
  createConversation,
  listConversations,
  getConversation,
  sendMessage: sendMessage as (conversationId: string, role: 'user' | 'assistant' | 'system', content: string) => Promise<ApiResponse<{
    message_id: string;
    conversation_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>>,
  deleteConversation,
};
