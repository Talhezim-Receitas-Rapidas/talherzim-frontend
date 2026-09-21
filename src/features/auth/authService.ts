import { httpClient } from '../../services/httpClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', payload);
  return data;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
}

export async function registrar(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const { data } = await httpClient.post<RegisterResponse>(
    '/auth/registrar',
    payload,
  );
  return data;
}
