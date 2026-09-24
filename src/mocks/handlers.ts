import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:3000';

export const handlers = [
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; senha: string };

    if (body.email === 'erro@teste.com') {
      return HttpResponse.json(
        { erro: 'credenciais_invalidas', campos: [] },
        { status: 401 },
      );
    }

    return HttpResponse.json(
      {
        token: 'mock-token-123',
        usuario: { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', email: body.email },
      },
      { status: 200 },
    );
  }),

  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { email: string; senha: string };

    if (body.email === 'existente@teste.com') {
      return HttpResponse.json(
        { erro: 'email_duplicado', campos: [] },
        { status: 409 },
      );
    }

    if (body.senha.length < 8) {
      return HttpResponse.json(
        {
          erro: 'dados_invalidos',
          campos: [{ campo: 'senha', mensagem: 'A senha deve ter ao menos 8 caracteres.' }],
        },
        { status: 422 },
      );
    }

    return HttpResponse.json(
      { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', email: body.email },
      { status: 201 },
    );
  }),
];