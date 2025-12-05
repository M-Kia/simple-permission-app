import { Permissions, User } from '@/lib/api/auth';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  ShieldCheck,
  ShieldX,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

const permissionConfig: Record<
  Permissions,
  { label: string; description: string; icon: React.ElementType }
> = {
  [Permissions.CREATE_USER]: {
    label: 'Create User',
    description: 'Ability to create new users in the system',
    icon: UserPlus,
  },
  [Permissions.READ_USER]: {
    label: 'Read User',
    description: 'Ability to view user information',
    icon: Eye,
  },
  [Permissions.UPDATE_USER]: {
    label: 'Update User',
    description: 'Ability to modify existing user data',
    icon: Pencil,
  },
  [Permissions.DELETE_USER]: {
    label: 'Delete User',
    description: 'Ability to remove users from the system',
    icon: Trash2,
  },
};

interface PermissionsGridProps {
  user: User;
  allPermissions: string[];
}

export default function PermissionsGrid({ user, allPermissions }: PermissionsGridProps) {
  const userPermissions = new Set(user.permissions);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        Your Permissions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allPermissions.map((permission) => {
          const hasPermission = userPermissions.has(permission as Permissions);
          const config = permissionConfig[permission as Permissions];
          const Icon = config?.icon || ShieldCheck;

          return (
            <Card
              key={permission}
              className={`transition-all duration-200 ${
                hasPermission
                  ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20'
                  : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 opacity-75'
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
                      hasPermission
                        ? 'bg-green-100 dark:bg-green-900/50'
                        : 'bg-red-100 dark:bg-red-900/50'
                    }`}
                  >
                    {hasPermission ? (
                      <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <ShieldX className="h-6 w-6 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon
                        className={`h-4 w-4 ${
                          hasPermission
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      />
                      <h3
                        className={`font-medium ${
                          hasPermission
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}
                      >
                        {config?.label || permission}
                      </h3>
                    </div>
                    <p
                      className={`text-sm ${
                        hasPermission
                          ? 'text-green-600/80 dark:text-green-400/80'
                          : 'text-red-600/80 dark:text-red-400/80'
                      }`}
                    >
                      {config?.description || `Permission: ${permission}`}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          hasPermission
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {hasPermission ? 'Granted' : 'Not Granted'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
