
import { z } from 'zod';

export const despensaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'Informe um nome com pelo menos 2 caracteres.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.'),

  quantidade: z
    .number({ error: 'Informe uma quantidade válida.' })
    .positive('A quantidade deve ser maior que zero.')
    .finite('Informe uma quantidade válida.'),

  unidade: z.enum(['un', 'g', 'kg', 'ml', 'l'], {
    error: 'Selecione uma unidade de medida.',
  }),
});

export type DespensaFormData = z.infer<typeof despensaSchema>;
