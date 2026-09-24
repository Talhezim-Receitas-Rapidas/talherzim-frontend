import { httpClient } from '../../services/httpClient';

export interface Usuario {
  id: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>('/auth/login', {
    email: payload.email,
    senha: payload.password, 
  });
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
  
  // não existe campo para "name" ainda, então ele fica retido no formulário mas não é enviado.
  await httpClient.post<Usuario>('/auth/register', {
    email: payload.email,
    senha: payload.password,
  });

  return login({ email: payload.email, password: payload.password });
}