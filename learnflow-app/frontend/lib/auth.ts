import type { User } from '@/types';

const TOKEN_KEY = 'learnflow_token';
const USER_KEY = 'learnflow_user';

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login request
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // For MVP, use mock authentication
  // In production, this would call the actual auth endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock user validation
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: 'mock-user-id',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: credentials.email.includes('teacher') ? 'teacher' : 'student',
          avatar: undefined,
        };

        const mockToken = btoa(JSON.stringify({
          userId: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }));

        setAuthToken(mockToken);
        setUser(mockUser);

        resolve({
          success: true,
          token: mockToken,
          user: mockUser,
        });
      } else {
        resolve({
          success: false,
          error: 'Invalid credentials',
        });
      }
    }, 500);
  });

  // Production implementation (commented out for MVP):
  // const response = await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(credentials),
  // });
  //
  // const data = await response.json();
  //
  // if (data.success && data.token) {
  //   setAuthToken(data.token);
  //   setUser(data.user);
  // }
  //
  // return data;
}

/**
 * Logout user
 */
export function logout(): void {
  removeAuthToken();
  removeUser();
}

/**
 * Register new user
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  // For MVP, auto-login after registration
  return login({ email: credentials.email, password: credentials.password });
}

/**
 * Set authentication token
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Set user data
 */
export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get user data
 */
export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * Remove user data
 */
export function removeUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if token is valid
 */
export function isTokenValid(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Validate base64 format before decoding
    if (!/^[A-Za-z0-9+/=]+$/.test(token)) {
      return false;
    }

    const payload = JSON.parse(atob(token));

    // Validate payload structure
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    // Check expiration
    if (typeof payload.exp !== 'number' || payload.exp < 0) {
      return false;
    }

    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return isTokenValid() && getUser() !== null;
}

/**
 * Get user role
 */
export function getUserRole(): 'student' | 'teacher' | null {
  const user = getUser();
  return user?.role || null;
}

/**
 * Refresh token (if backend supports it)
 */
export async function refreshToken(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Production implementation:
    // const response = await fetch('/api/auth/refresh', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    // });
    //
    // const data = await response.json();
    // if (data.success && data.token) {
    //   setAuthToken(data.token);
    //   return true;
    // }
    //
    // return false;

    // For MVP: just check if token is still valid
    return isTokenValid();
  } catch {
    return false;
  }
}
