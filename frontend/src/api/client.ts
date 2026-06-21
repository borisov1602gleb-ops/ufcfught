// Тонкий клиент API. Хранит токен и подставляет заголовок Authorization.
import type { Me } from "./types";
import { MOCK_ENABLED, mockFetchMe, mockLogin, mockRegister } from "./mock";

const TOKEN_KEY = "auth_token";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(path, { ...init, headers });
  if (!res.ok) {
    let detail = `Ошибка запроса (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* тело не JSON — оставляем дефолтное сообщение */
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export async function login(username: string, password: string): Promise<string> {
  if (MOCK_ENABLED) return mockLogin(username, password);
  const data = await request<{ access_token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  return data.access_token;
}

export async function register(
  username: string,
  fullName: string,
  password: string,
): Promise<string> {
  if (MOCK_ENABLED) return mockRegister(username, fullName, password);
  const data = await request<{ access_token: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, full_name: fullName, password }),
  });
  return data.access_token;
}

export async function fetchMe(): Promise<Me> {
  if (MOCK_ENABLED) return mockFetchMe(getToken());
  return request<Me>("/api/auth/me");
}
