
import { httpClient } from '../../services/httpClient';

export type UnidadeMedida = 'un' | 'g' | 'kg' | 'ml' | 'l';

export interface Ingrediente {
  id: string;
  nome: string;
  quantidade: number;
  unidade: UnidadeMedida;
}

export interface IngredientePayload {
  nome: string;
  quantidade: number;
  unidade: UnidadeMedida;
}

interface ListaIngredientesResponse {
  itens?: Ingrediente[];
  ingredientes?: Ingrediente[];
  data?: Ingrediente[];
}

const DESPENSA_ENDPOINT = '/despensa';

export const despensaService = {
  async listar(): Promise<Ingrediente[]> {
    const { data } = await httpClient.get<
      Ingrediente[] | ListaIngredientesResponse
    >(DESPENSA_ENDPOINT);

    if (Array.isArray(data)) {
      return data;
    }

    return data.itens ?? data.ingredientes ?? data.data ?? [];
  },

  async cadastrar(
    ingrediente: IngredientePayload,
  ): Promise<Ingrediente> {
    const { data } = await httpClient.post<Ingrediente>(
      DESPENSA_ENDPOINT,
      ingrediente,
    );

    return data;
  },

  async atualizar(
    id: string,
    ingrediente: IngredientePayload,
  ): Promise<Ingrediente> {
    const { data } = await httpClient.put<Ingrediente>(
      `${DESPENSA_ENDPOINT}/${encodeURIComponent(id)}`,
      ingrediente,
    );

    return data;
  },

  async remover(id: string): Promise<void> {
    await httpClient.delete(
      `${DESPENSA_ENDPOINT}/${encodeURIComponent(id)}`,
    );
  },
};
