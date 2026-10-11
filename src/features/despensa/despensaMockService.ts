
import type {
    Ingrediente,
    IngredientePayload,
  } from './despensaService';
  
  const STORAGE_KEY = 'talherzim:despensa:mock:v1';
  
  const ingredientesIniciais: Ingrediente[] = [
    { id: 'mock-1', nome: 'Arroz', quantidade: 2, unidade: 'kg' },
    { id: 'mock-2', nome: 'Feijão', quantidade: 1, unidade: 'kg' },
    { id: 'mock-3', nome: 'Ovo', quantidade: 12, unidade: 'un' },
    { id: 'mock-4', nome: 'Leite', quantidade: 1, unidade: 'l' },
    { id: 'mock-5', nome: 'Queijo', quantidade: 300, unidade: 'g' },
  ];
  
  function lerIngredientes(): Ingrediente[] {
    const armazenados = localStorage.getItem(STORAGE_KEY);
  
    if (armazenados === null) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(ingredientesIniciais),
      );
  
      return [...ingredientesIniciais];
    }
  
    try {
      const dados: unknown = JSON.parse(armazenados);
  
      if (
        Array.isArray(dados) &&
        dados.every(
          (item) =>
            typeof item.id === 'string' &&
            typeof item.nome === 'string' &&
            typeof item.quantidade === 'number' &&
            ['un', 'g', 'kg', 'ml', 'l'].includes(item.unidade),
        )
      ) {
        return dados as Ingrediente[];
      }
    } catch {
      // O conteúdo armazenado não é um JSON válido.
    }
  
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ingredientesIniciais),
    );
  
    return [...ingredientesIniciais];
  }
  
  function salvarIngredientes(ingredientes: Ingrediente[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredientes));
  }
  
  export const despensaMockService = {
    async listar(): Promise<Ingrediente[]> {
      return lerIngredientes();
    },
  
    async cadastrar(
      payload: IngredientePayload,
    ): Promise<Ingrediente> {
      const ingredientes = lerIngredientes();
  
      const novoIngrediente: Ingrediente = {
        id: crypto.randomUUID(),
        ...payload,
      };
  
      salvarIngredientes([...ingredientes, novoIngrediente]);
  
      return novoIngrediente;
    },
  
    async atualizar(
      id: string,
      payload: IngredientePayload,
    ): Promise<Ingrediente> {
      const ingredientes = lerIngredientes();
      const indice = ingredientes.findIndex(
        (item) => item.id === id,
      );
  
      if (indice === -1) {
        throw new Error('Ingrediente não encontrado.');
      }
  
      const ingredienteAtualizado: Ingrediente = {
        id,
        ...payload,
      };
  
      ingredientes[indice] = ingredienteAtualizado;
      salvarIngredientes(ingredientes);
  
      return ingredienteAtualizado;
    },
  
    async remover(id: string): Promise<void> {
      const ingredientes = lerIngredientes();
      const existe = ingredientes.some((item) => item.id === id);
  
      if (!existe) {
        throw new Error('Ingrediente não encontrado.');
      }
  
      salvarIngredientes(
        ingredientes.filter((item) => item.id !== id),
      );
    },
  };
  