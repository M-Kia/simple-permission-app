import LoginForm from '@/components/common/login-form';
import { serverAuthApi } from '@/lib/api/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const cookieStore = await cookies();
  // Server-side auth check
  const user = await serverAuthApi.whoAmI(cookieStore);

  if (user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Qualif-ID</h1>
          <p className="text-muted-foreground">Permission Management System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
