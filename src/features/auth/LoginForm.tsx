import type { BaseSyntheticEvent } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Button } from '../../components/ui/Button';
import { FormError } from '../../components/ui/FormError';
import { Input } from '../../components/ui/Input';
import { Logo } from '../../components/ui/Logo';

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
    <div className="w-full">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-6 flex w-fit items-center justify-center rounded-2xl border-2 border-ink bg-cream-soft px-5 py-3 shadow-[4px_4px_0px_0px_theme(colors.ink)]">
          <Logo className="h-11 w-auto" />
        </div>

        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Conecte sua despensa à sua mesa
        </h1>

        <p className="mt-1 text-sm text-stone-muted">
          Descubra receitas instantâneas com ingredientes que você já tem.
        </p>
      </div>
      <div className="mb-5 flex rounded-2xl border-2 border-ink bg-stone-field p-1 shadow-[3px_3px_0px_0px_theme(colors.ink)]">
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

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3.5">
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

        <Input
          id="login-password"
          label="Senha"
          isPassword
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          labelAside={
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-bold text-brand hover:underline"
            >
              Esqueceu a senha?
            </button>
          }
          {...register('password')}
        />

        <label
          htmlFor="login-remember"
          className="flex items-center gap-2 pt-1 text-sm text-stone-body"
        >
          <input
            id="login-remember"
            type="checkbox"
            className="h-5 w-5 rounded-lg border-2 border-ink accent-brand"
            {...register('rememberMe')}
          />
          Lembrar meus dados de acesso
        </label>

        <Button type="submit" isLoading={isLoading} className="mt-2">
          Entrar na Despensa
        </Button>
      </form>
    </div>
  );
}
