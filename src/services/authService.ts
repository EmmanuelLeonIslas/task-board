import type { SignUpData, SignInData, AuthResponse } from "../types/auth";
import { API_URL } from "../config/api";

const TOKEN_KEY = "auth_token";

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Sign up failed");
  }

  const result: AuthResponse = await response.json();
  saveToken(result.token);
  return result;
}

export async function signIn(data: SignInData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Sign in failed");
  }

  const result: AuthResponse = await response.json();
  saveToken(result.token);
  return result;
}

export function signOut(): void {
  removeToken();
  window.location.reload(); // Refresh for cleaning data
}