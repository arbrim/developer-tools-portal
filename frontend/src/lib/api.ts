import { AuthUser, LinkPayload, ToolLink } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(Array.isArray(error.message) ? error.message.join(', ') : error.message);
  }

  return response.json() as Promise<T>;
}

export function getLinks(includeInactive = false) {
  return request<ToolLink[]>(`/links${includeInactive ? '?includeInactive=true' : ''}`);
}

export function login(email: string, password: string) {
  return request<{ accessToken: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function createLink(payload: LinkPayload, token: string) {
  return request<ToolLink>('/links', { method: 'POST', body: JSON.stringify(payload) }, token);
}

export function updateLink(id: string, payload: Partial<LinkPayload>, token: string) {
  return request<ToolLink>(`/links/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token);
}

export function deleteLink(id: string, token: string) {
  return request<{ deleted: boolean }>(`/links/${id}`, { method: 'DELETE' }, token);
}
