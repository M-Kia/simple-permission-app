import { Permissions, serverAuthApi } from '@/lib/api/auth';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from 'lucide-react';
import LogoutButton from '@/components/common/logout-button';
import PermissionsGrid from '@/components/common/permissions-grid';
import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  
  // Server-side auth check
  const user = await serverAuthApi.whoAmI(cookieStore);
  
  if (!user) {
    redirect('/login');
  }

  const allPermissions = await serverAuthApi.getAllPermissions(cookieStore);

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">
                {user.userName}
              </h1>
              <p className="text-xs text-muted-foreground">
                Member since{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome, {user.userName}!
              </CardTitle>
              <CardDescription>
                Below is an overview of your permissions in the system. Green
                indicates permissions you have, while red indicates
                permissions you don&apos;t have.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Permissions Grid */}
          <PermissionsGrid user={user} allPermissions={allPermissions} />

          {/* Summary Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Permission Summary
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {user.permissions.length} of{' '}
                    {allPermissions.length || Object.values(Permissions).length}{' '}
                    permissions
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {user.permissions.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Granted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {(allPermissions.length || Object.values(Permissions).length) -
                        user.permissions.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Not Granted
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

