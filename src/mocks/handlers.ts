import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'erro@teste.com') {
      return HttpResponse.json(
        { message: 'E-mail ou senha inválidos' },
        { status: 401 },
      );
    }

    return HttpResponse.json({ token: 'mock-token-123' }, { status: 200 });
  }),

  http.post('/api/auth/registrar', async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      email: string;
      password: string;
    };

    if (body.email === 'existente@teste.com') {
      return HttpResponse.json(
        { message: 'Este e-mail já está cadastrado' },
        { status: 409 },
      );
    }

    return HttpResponse.json({ token: 'mock-token-456' }, { status: 201 });
  }),
];
