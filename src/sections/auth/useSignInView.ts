import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'src/routes/hooks';
import { useLogin } from 'src/hooks/useAuth';
import { SignInFormData, signInSchema } from 'src/utils/types/form';

export const useSignInView = () => {
  const router = useRouter();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
    },
  });

  const { login, status, errorMessage } = useLogin();

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        await login(data.email);
        // Store email in localStorage for verification
        localStorage.setItem('emailForSignIn', data.email);
      } catch (error) {
        console.error('Login error:', error);
      }
    },
    [ login]
  );

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    status,
    errorMessage,
    handleSubmit,
  };
};
