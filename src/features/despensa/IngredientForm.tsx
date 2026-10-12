
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FormError } from '../../components/ui/FormError';

import {
  despensaSchema,
  type DespensaFormData,
} from './despensaSchema';
import type { Ingrediente } from './despensaService';

interface IngredientFormProps {
  ingrediente?: Ingrediente | null;
  isSubmitting: boolean;
  onSubmit: (values: DespensaFormData) => void;
  onCancel: () => void;
}

export function IngredientForm({
  ingrediente,
  isSubmitting,
  onSubmit,
  onCancel,
}: IngredientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DespensaFormData>({
    resolver: zodResolver(despensaSchema),
    defaultValues: {
      nome: '',
      quantidade: 1,
      unidade: 'un',
    },
  });

  useEffect(() => {
    reset(
      ingrediente
        ? {
            nome: ingrediente.nome,
            quantidade: ingrediente.quantidade,
            unidade: ingrediente.unidade,
          }
        : {
            nome: '',
            quantidade: 1,
            unidade: 'un',
          },
    );
  }, [ingrediente, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      <Input
        id="nome"
        label="Nome do ingrediente"
        placeholder="Ex.: Arroz"
        autoComplete="off"
        error={errors.nome?.message}
        {...register('nome')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Input
            id="quantidade"
            label="Quantidade"
            type="number"
            min="0.01"
            step="any"
            error={errors.quantidade?.message}
            {...register('quantidade', { valueAsNumber: true })}
          />
        </div>

        <div>
<label
  htmlFor="unidade"
  className="mb-2 block text-sm font-bold text-ink"
>
  Unidade de medida
</label>

<select
  id="unidade"
  className="w-full appearance-none rounded-2xl border-2 border-ink bg-cream px-4 py-3 text-sm font-semibold text-ink shadow-[3px_3px_0px_0px_theme(colors.ink)] outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
  {...register('unidade')}
>
    <option value="un">Unidade (un)</option>
    <option value="g">Gramas (g)</option>
    <option value="kg">Quilogramas (kg)</option>
    <option value="ml">Mililitros (ml)</option>
    <option value="l">Litros (L)</option>
</select>

<FormError message={errors.unidade?.message} />

        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          fullWidth={false}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          fullWidth={false}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {ingrediente ? 'Salvar alterações' : 'Adicionar ingrediente'}
        </Button>
      </div>
    </form>
  );
}
