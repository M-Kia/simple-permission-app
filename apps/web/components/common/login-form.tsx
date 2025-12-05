'use client';

import { authApi } from '@/lib/api/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Bounce, toast } from 'react-toastify';
import * as zod from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, LogIn } from 'lucide-react';

const formSchema = zod.object({
  userName: zod
    .string()
    .min(1, 'User Name is required')
    .max(16, 'User Name must be at most 16 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'User Name can only contain letters, numbers, and underscores',
    )
    .regex(/^[a-zA-Z]/, 'User Name must start with a letter')
    .regex(/[a-zA-Z]$/, 'User Name must end with a letter'),
  password: zod
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password must be at most 20 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^a-zA-Z0-9]/,
      'Password must contain at least one special character',
    ),
});

type FormData = zod.infer<typeof formSchema>;

export default function LoginForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (variables: { userName: string; password: string }) =>
      authApi.login(variables.userName, variables.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whoAmI'] });
      toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 2000,
        theme: 'light',
        transition: Bounce,
      });
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  const isLoading = loginMutation.isPending || isSubmitting;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              type="text"
              placeholder="Enter your username"
              {...register('userName')}
              aria-invalid={!!errors.userName}
              disabled={isLoading}
            />
            {errors.userName && (
              <p className="text-sm text-destructive">
                {errors.userName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              aria-invalid={!!errors.password}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn />
                Sign In
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            New users will be automatically registered
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

