
import {
    useMutation,
    useQuery,
    useQueryClient,
  } from '@tanstack/react-query';
  
  import type { IngredientePayload } from './despensaService';
  import { despensaService } from './despensaService';
  
  const DESPENSA_QUERY_KEY = ['despensa'];
  
  export function useIngredientes() {
    return useQuery({
      queryKey: DESPENSA_QUERY_KEY,
      queryFn: () => despensaService.listar(),
    });
  }
  
  export function useCadastrarIngrediente() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (payload: IngredientePayload) =>
        despensaService.cadastrar(payload),
  
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: DESPENSA_QUERY_KEY,
        });
      },
    });
  }
  
  interface AtualizarIngredienteParams {
    id: string;
    payload: IngredientePayload;
  }
  
  export function useAtualizarIngrediente() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ id, payload }: AtualizarIngredienteParams) =>
        despensaService.atualizar(id, payload),
  
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: DESPENSA_QUERY_KEY,
        });
      },
    });
  }
  
  export function useRemoverIngrediente() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id: string) => despensaService.remover(id),
  
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: DESPENSA_QUERY_KEY,
        });
      },
    });
  }
  