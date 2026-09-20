import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { AuthLayout } from '../../features/auth/AuthLayout';
import {
  RegisterForm,
  type RegisterFormValues,
} from '../../features/auth/RegisterForm';
import { useAuthStore } from '../../features/auth/authStore';
import { registrar } from '../../features/auth/authService';

const registerSchema = z
  .object({
    name: z.string().min(1, 'O nome é obrigatório'),

    email: z
      .string()
      .min(1, 'O e-mail é obrigatório')
      .email('Formato de e-mail inválido'),

    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),

    confirmPassword: z.string().min(1, 'Confirme sua senha'),

    termsAgree: z
      .boolean()
      .refine(
        (value) => value === true,
        'Você precisa aceitar os termos para continuar',
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export function RegisterPage() {
  const navigate = useNavigate();

  const setToken = useAuthStore((state) => state.setToken);

  const [serverError, setServerError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(undefined);

    try {
      const { token } = await registrar(data);

      setToken(token);
      navigate('/despensa');
    } catch {
      setServerError('Não foi possível criar sua conta. Tente novamente.');
    }
  });

  return (
    <AuthLayout
      onNavigateHome={() => navigate('/')}
      onNavigateHelp={() => {}}
      onNavigateTerms={() => {}}
      onNavigatePrivacy={() => {}}
    >
      <RegisterForm
        register={register}
        errors={errors}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
        serverError={serverError}
        onNavigateLogin={() => navigate('/login')}
        onNavigateTerms={() => {}}
        onNavigatePrivacy={() => {}}
      />
    </AuthLayout>
  );
}
