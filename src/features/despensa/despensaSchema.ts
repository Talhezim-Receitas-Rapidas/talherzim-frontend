
import { z } from 'zod';

export const despensaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, 'Informe o nome do ingrediente.')
    .max(150, 'O nome deve ter no máximo 150 caracteres.'),

  quantidade: z
    .number({ error: 'Informe uma quantidade válida.' })
    .min(0.01, 'A quantidade deve ser de pelo menos 0,01.')
    .max(99999999.99, 'A quantidade deve ser de no máximo 99999999,99.')
    .finite('Informe uma quantidade válida.'),

  unidade: z.enum(['un', 'g', 'kg', 'ml', 'l'], {
    error: 'Selecione uma unidade de medida.',
  }),
});

export type DespensaFormData = z.infer<typeof despensaSchema>;
