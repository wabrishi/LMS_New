const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export async function checkServerStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      return data.status === 'UP';
    }
    return false;
  } catch {
    return false;
  }
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('lms_access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Request failed');
  }

  return data as T;
}

export const apiClient = {
  checkHealth: checkServerStatus,

  // Auth
  login: (credentials: { email: string; password: string }) =>
    apiFetch<{ success: boolean; accessToken: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () =>
    apiFetch<{ success: boolean; user: any }>('/auth/me', {
      method: 'GET',
    }),

  // Students
  getStudents: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch<{ success: boolean; data: any[]; pagination: any }>(`/students?${query}`);
  },

  // Courses
  getCourses: () => apiFetch<{ success: boolean; data: any[] }>('/courses'),

  // Batches
  getBatches: () => apiFetch<{ success: boolean; data: any[] }>('/batches'),

  // Live Classes
  getLiveClasses: () => apiFetch<{ success: boolean; data: any[] }>('/live-classes'),

  // Assignments
  getAssignments: () => apiFetch<{ success: boolean; data: any[] }>('/assignments'),

  // Quizzes
  getQuizzes: () => apiFetch<{ success: boolean; data: any[] }>('/quizzes'),

  // Certificates
  verifyCertificate: (certNumber: string) =>
    apiFetch<{ success: boolean; valid: boolean; certificate: any }>(`/certificates/verify/${certNumber}`),
};
