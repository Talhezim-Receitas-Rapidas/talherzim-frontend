import type { BaseSyntheticEvent } from 'react';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Button } from '../../components/ui/Button';
import { FormError } from '../../components/ui/FormError';
import { Input } from '../../components/ui/Input';

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAgree: boolean;
}

interface RegisterFormProps {
  register: UseFormRegister<RegisterFormValues>;
  errors: FieldErrors<RegisterFormValues>;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void> | void;
  isLoading?: boolean;
  serverError?: string;
  onNavigateLogin: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
}

export function RegisterForm({
  register,
  errors,
  onSubmit,
  isLoading = false,
  serverError,
  onNavigateLogin,
  onNavigateTerms,
  onNavigatePrivacy,
}: RegisterFormProps) {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      {/* Cabeçalho */}
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Crie sua conta no Talherzim
          <span className="text-brand">.</span>
        </h1>

        <p className="mt-1.5 text-sm text-stone-muted">
          Organize sua despensa e descubra novas possibilidades para suas
          refeições.
        </p>
      </div>

      {/* Navegação entre autenticação */}
      <div className="mb-5 flex rounded-2xl border-2 border-ink bg-stone-field p-1">
        <button
          type="button"
          onClick={onNavigateLogin}
          className="flex-1 rounded-xl border-2 border-transparent py-2.5 text-sm font-bold text-stone-muted transition-colors hover:text-ink"
        >
          Entrar
        </button>

        <span
          aria-current="page"
          className="flex-1 rounded-xl border-2 border-ink bg-brand py-2.5 text-center text-sm font-bold text-white shadow-[2px_2px_0px_0px_theme(colors.ink)]"
        >
          Cadastrar
        </span>
      </div>

      {/* Formulário */}
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full flex-col gap-3"
      >
        {serverError && <FormError message={serverError} />}

        <Input
          id="register-name"
          label="Nome completo"
          type="text"
          autoComplete="name"
          placeholder="Seu nome e sobrenome"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          id="register-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id="register-password"
          label="Criar senha"
          isPassword
          autoComplete="new-password"
          placeholder="Mínimo de 6 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          id="register-confirm-password"
          label="Confirmar senha"
          isPassword
          autoComplete="new-password"
          placeholder="Repita sua senha"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Termos */}
        <div className="flex flex-col gap-1 pt-0.5">
          <label
            htmlFor="register-terms"
            className="flex items-start gap-2.5 text-sm text-stone-body"
          >
            <input
              id="register-terms"
              type="checkbox"
              aria-invalid={Boolean(errors.termsAgree)}
              aria-describedby={
                errors.termsAgree ? 'register-terms-error' : undefined
              }
              className="mt-0.5 h-5 w-5 shrink-0 rounded-lg border-2 border-ink accent-brand"
              {...register('termsAgree')}
            />

            <span className="leading-snug">
              Li e concordo com os{' '}
              <button
                type="button"
                onClick={onNavigateTerms}
                className="font-bold text-brand hover:underline"
              >
                Termos de Uso
              </button>{' '}
              e{' '}
              <button
                type="button"
                onClick={onNavigatePrivacy}
                className="font-bold text-brand hover:underline"
              >
                Política de Privacidade
              </button>{' '}
              do Talherzim.
            </span>
          </label>

          <FormError
            id="register-terms-error"
            message={errors.termsAgree?.message}
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-0.5">
          Criar Minha Conta
        </Button>

        <p className="text-center text-sm text-stone-muted">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="font-bold text-brand hover:underline"
          >
            Entrar agora
          </button>
        </p>
      </form>
    </div>
  );
}
