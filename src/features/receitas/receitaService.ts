import { useAuthStore } from '../auth/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
  traducaoAutomatica?: boolean;
  avisoTraducao?: string;
  externa?: boolean;
  fonte?: string;
  fonteUrl?: string;
  origem?: string;
  idioma?: string;
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
  traducaoAutomatica?: boolean;
  avisoTraducao?: string;
  externa?: boolean;
  fonte?: string;
  fonteUrl?: string;
  origem?: string;
  idioma?: string;
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
  modo: ReceitaApi['modoPreparo'] | ReceitaApi['modo_preparo'],
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
  const correspondencias = Number(receita.correspondencias);
  const totalIngredientes = Number(
    receita.totalIngredientes ??
      receita.total_ingredientes ??
      ingredientes.length,
  );

  return {
    traducaoAutomatica: receita.traducaoAutomatica,
    avisoTraducao: receita.avisoTraducao,
    externa: receita.externa,
    fonte: receita.fonte,
    fonteUrl: receita.fonteUrl,
    origem: receita.origem,
    idioma: receita.idioma,
    id: String(receita.id),
    nome: receita.nome,
    descricao: receita.descricao,
    imagem: receita.imagem || receita.imagem_url || FALLBACK_IMAGE,
    tempoPreparo: receita.tempoPreparo,
    correspondencias: Number.isFinite(correspondencias) ? correspondencias : 0,
    totalIngredientes: Number.isFinite(totalIngredientes)
      ? totalIngredientes
      : 0,
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
    if (response.status === 401) useAuthStore.getState().logout();
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

export interface Sugestoes {
  receitas: Receita[];
  avisos: string[];
  despensaVazia: boolean;
}

export async function consultarSugestoes(busca = ''): Promise<Sugestoes> {
  const data = await request<
    | ReceitaApi[]
    | { receitas: ReceitaApi[]; avisos: string[]; despensaVazia: boolean }
  >(`/receitas/sugeridas?detalhes=true&busca=${encodeURIComponent(busca)}`);
  if (Array.isArray(data))
    return {
      receitas: data.map(normalizarReceita),
      avisos: [],
      despensaVazia: false,
    };
  return { ...data, receitas: data.receitas.map(normalizarReceita) };
}

export async function listarReceitasSugeridas(): Promise<Receita[]> {
  return (await consultarSugestoes()).receitas;
}

export async function buscarReceita(id: string): Promise<Receita> {
  const data = await request<ReceitaApi>(`/receitas/${encodeURIComponent(id)}`);

  return normalizarReceita(data);
}
