'use client';

import { authApi } from '@/lib/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Bounce, toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully!', {
        position: 'top-center',
        autoClose: 2000,
        theme: 'light',
        transition: Bounce,
      });
      router.push('/login');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || 'Logout failed', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'light',
        transition: Bounce,
      });
    },
  });

  return (
    <Button
      variant="outline"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? (
        <>
          <Loader2 className="animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut />
          Logout
        </>
      )}
    </Button>
  );
}
