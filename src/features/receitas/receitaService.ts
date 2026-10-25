import { useAuthStore } from '../auth/authStore';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80';

export interface ReceitaIngrediente {
  nome: string;
  quantidade?: string;
}

export interface ReceitaModoPreparo {
  descricao?: string;
  texto?: string;
}

export interface Receita {
  id: string;
  nome: string;
  descricao?: string;
  imagem?: string;
  tempoPreparo?: number;
  correspondencias: number;
  totalIngredientes: number;
  ingredientes: Array<string | ReceitaIngrediente>;
  modoPreparo: Array<string | ReceitaModoPreparo>;
}

interface ReceitaApi {
  id: string | number;
  nome: string;
  descricao?: string;
  imagem?: string;
  imagem_url?: string;
  tempoPreparo?: number;
  correspondencias?: number;
  totalIngredientes?: number;
  total_ingredientes?: number;
  ingredientes?: Array<
    | string
    | {
        nome: string;
        quantidade?: string;
      }
  >;
  modoPreparo?: Array<
    | string
    | {
        descricao?: string;
        texto?: string;
      }
  >;
  modo_preparo?:
    | string
    | Array<
        | string
        | {
            descricao?: string;
            texto?: string;
          }
      >;
}

interface ErroCampo {
  campo: string;
  mensagem: string;
}

interface ErroApi {
  erro?: string;
  campos?: ErroCampo[];
}

export class ReceitaApiError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ReceitaApiError';
    this.status = status;
  }
}

function normalizarModoPreparo(
  modo:
    | ReceitaApi['modoPreparo']
    | ReceitaApi['modo_preparo'],
): Array<string | ReceitaModoPreparo> {
  if (!modo) {
    return [];
  }

  if (Array.isArray(modo)) {
    return modo;
  }

  return modo
    .split('\n')
    .map((etapa) => etapa.trim().replace(/^\d+[.)]\s*/, ''))
    .filter(Boolean);
}

function normalizarReceita(receita: ReceitaApi): Receita {
  const ingredientes = receita.ingredientes ?? [];

  return {
    id: String(receita.id),
    nome: receita.nome,
    descricao: receita.descricao,
    imagem: receita.imagem || receita.imagem_url || FALLBACK_IMAGE,
    tempoPreparo: receita.tempoPreparo,
    correspondencias: receita.correspondencias ?? 0,
    totalIngredientes:
      receita.totalIngredientes ??
      receita.total_ingredientes ??
      ingredientes.length,
    ingredientes,
    modoPreparo: normalizarModoPreparo(
      receita.modoPreparo ?? receita.modo_preparo,
    ),
  };
}

function obterToken(): string | null {
  return useAuthStore.getState().token;
}

async function request<T>(endpoint: string): Promise<T> {
  const token = obterToken();

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const baseUrl = API_URL.replace(/\/$/, '');
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    let erro: ErroApi | null = null;

    try {
      erro = (await response.json()) as ErroApi;
    } catch {
      // A resposta pode não conter JSON.
    }

    const mensagem =
      erro?.erro ??
      (response.status === 404
        ? 'Não encontramos essa receita.'
        : `Erro ao consultar receitas (${response.status}).`);

    throw new ReceitaApiError(response.status, mensagem);
  }

  return (await response.json()) as T;
}

/**
 * Dados temporários para desenvolvimento.
 * Mantidos enquanto a API não estiver configurada.
 */
const receitasMock: Receita[] = [
  {
    id: '1',
    nome: 'Macarrão cremoso com tomate',
    descricao:
      'Uma opção simples e cremosa para aproveitar ingredientes básicos da despensa.',
    imagem:
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
    tempoPreparo: 25,
    correspondencias: 4,
    totalIngredientes: 5,
    ingredientes: [
      { nome: 'Macarrão', quantidade: '250 g' },
      { nome: 'Tomate', quantidade: '2 unidades' },
      { nome: 'Creme de leite', quantidade: '1 caixa' },
      { nome: 'Alho', quantidade: '2 dentes' },
      { nome: 'Sal', quantidade: 'A gosto' },
    ],
    modoPreparo: [
      { descricao: 'Cozinhe o macarrão em água com sal até ficar al dente.' },
      { descricao: 'Refogue o alho e os tomates picados em uma panela.' },
      {
        descricao:
          'Adicione o creme de leite e misture até formar um molho cremoso.',
      },
      { descricao: 'Misture o macarrão ao molho e sirva em seguida.' },
    ],
  },
  {
    id: '2',
    nome: 'Omelete de legumes',
    descricao:
      'Uma refeição rápida para aproveitar ovos e os legumes disponíveis na geladeira.',
    imagem:
      'https://images.unsplash.com/photo-1510693206972-df098f6c7c8d?auto=format&fit=crop&w=1200&q=80',
    tempoPreparo: 15,
    correspondencias: 3,
    totalIngredientes: 4,
    ingredientes: [
      { nome: 'Ovos', quantidade: '3 unidades' },
      { nome: 'Tomate', quantidade: '1 unidade' },
      { nome: 'Cebola', quantidade: '1/2 unidade' },
      { nome: 'Sal', quantidade: 'A gosto' },
    ],
    modoPreparo: [
      { descricao: 'Bata os ovos em um recipiente e tempere com sal.' },
      {
        descricao: 'Pique os legumes e refogue rapidamente em uma frigideira.',
      },
      { descricao: 'Adicione os ovos batidos e cozinhe em fogo baixo.' },
      { descricao: 'Dobre a omelete e sirva ainda quente.' },
    ],
  },
  {
    id: '3',
    nome: 'Arroz de forno',
    descricao:
      'Uma receita prática para transformar o arroz que já está pronto em uma nova refeição.',
    imagem:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80',
    tempoPreparo: 35,
    correspondencias: 5,
    totalIngredientes: 6,
    ingredientes: [
      { nome: 'Arroz cozido', quantidade: '3 xícaras' },
      { nome: 'Milho', quantidade: '1/2 lata' },
      { nome: 'Tomate', quantidade: '1 unidade' },
      { nome: 'Queijo', quantidade: '150 g' },
      { nome: 'Cebola', quantidade: '1/2 unidade' },
      { nome: 'Sal', quantidade: 'A gosto' },
    ],
    modoPreparo: [
      { descricao: 'Misture o arroz cozido com os legumes picados.' },
      { descricao: 'Transfira a mistura para uma travessa.' },
      { descricao: 'Cubra com queijo e leve ao forno preaquecido.' },
      { descricao: 'Asse até o queijo derreter e dourar.' },
    ],
  },
];

export async function listarReceitasSugeridas(): Promise<Receita[]> {
  if (!API_URL) {
    return receitasMock;
  }

  const data = await request<ReceitaApi[]>('/receitas/sugeridas');
  return data.map(normalizarReceita);
}

export async function buscarReceita(id: string): Promise<Receita> {
  if (!API_URL) {
    const receita = receitasMock.find((item) => item.id === id);

    if (!receita) {
      throw new ReceitaApiError(404, 'Não encontramos essa receita.');
    }

    return receita;
  }

  const data = await request<ReceitaApi>(`/receitas/${encodeURIComponent(id)}`);

  return normalizarReceita(data);
}
