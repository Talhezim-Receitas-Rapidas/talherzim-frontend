import type { BaseSyntheticEvent } from 'react';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Button } from '../../components/ui/Button';
import { FormError } from '../../components/ui/FormError';
import { Input } from '../../components/ui/Input';

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginFormProps {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void> | void;
  isLoading?: boolean;
  serverError?: string;
  onNavigateRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({
  register,
  errors,
  onSubmit,
  isLoading = false,
  serverError,
  onNavigateRegister,
  onForgotPassword,
}: LoginFormProps) {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      {/* cabeçalho */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Bem-vindo de volta ao Talherzim<span className="text-brand">.</span>
        </h1>

        <p className="mt-2 text-sm text-stone-muted">
          Descubra receitas instantâneas com ingredientes que você já tem.
        </p>
      </div>

      {/* navegação entre autenticação */}
      <div className="mb-6 flex rounded-2xl border-2 border-ink bg-stone-field p-1">
        <span
          aria-current="page"
          className="flex-1 rounded-xl border-2 border-ink bg-brand py-2.5 text-center text-sm font-bold text-white shadow-[2px_2px_0px_0px_theme(colors.ink)]"
        >
          Entrar
        </span>

        <button
          type="button"
          onClick={onNavigateRegister}
          className="flex-1 rounded-xl border-2 border-transparent py-2.5 text-sm font-bold text-stone-muted transition-colors hover:text-ink"
        >
          Cadastrar
        </button>
      </div>

      {/* formulário */}
      <form
        onSubmit={onSubmit}
        noValidate
        className="mx-auto flex w-full flex-col gap-4"
      >
        {serverError && <FormError message={serverError} />}

        <Input
          id="login-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="flex flex-col gap-1.5">
          <Input
            id="login-password"
            label="Senha"
            isPassword
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <button
            type="button"
            onClick={onForgotPassword}
            className="self-end text-xs font-bold text-brand transition-colors hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>

        <label
          htmlFor="login-remember"
          className="flex items-center gap-2 pt-0.5 text-sm text-stone-body"
        >
          <input
            id="login-remember"
            type="checkbox"
            className="h-5 w-5 rounded-lg border-2 border-ink accent-brand"
            {...register('rememberMe')}
          />
          Lembrar meus dados de acesso
        </label>

        <Button type="submit" isLoading={isLoading} className="mt-1">
          Entrar na Despensa
        </Button>
      </form>
    </div>
  );
}
