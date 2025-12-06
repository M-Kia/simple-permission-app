import { SetMetadata } from '@nestjs/common';
import { Permissions } from 'src/user/entities/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: Permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
