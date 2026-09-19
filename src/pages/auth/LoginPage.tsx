import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from '../../features/auth/AuthLayout';
import { LoginForm, type LoginFormValues } from '../../features/auth/LoginForm';
import { useAuthStore } from '../../features/auth/authStore';
import { login } from '../../features/auth/authService';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório')
    .email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

const heroContent = {
  badge: 'Cozinha Consciente',
  title:
    'A gente sabe que por trás de cada despensa tem uma história e infinitas possibilidades.',
  description:
    'E quando você aproveita cada ingrediente sem desperdício, nosso propósito faz ainda mais sentido. Comida fresca, rápida e feita com o que você já tem em casa.',
  statPrimaryNumber: '+18.000',
  statPrimaryLabel: 'Refeições salvas',
  statSecondaryNumber: '94%',
  statSecondaryLabel: 'Menos desperdício',
  featureTitle: 'Algoritmo Inteligente de Combinações',
  featureDescription: 'Basta digitar 3 itens para receber 12 receitas viáveis.',
};

export function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [serverError, setServerError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (data) => {
    setServerError(undefined);
    try {
      const { token } = await login(data);
      setToken(token);
      navigate('/despensa');
    } catch {
      setServerError('E-mail ou senha inválidos');
    }
  });

  return (
    <AuthLayout hero={heroContent}>
      <LoginForm
        register={register}
        errors={errors}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
        serverError={serverError}
        onNavigateRegister={() => navigate('/cadastro')}
        onForgotPassword={() => {}}
      />
    </AuthLayout>
  );
}
