import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Permissions } from 'src/user/entities/permissions.enum';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { CustomContext } from './type';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RequirePermissions } from './decorators/permissions.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  // ***** Mutations *****
  @Mutation(() => User)
  async login(
    @Args('userName') userName: string,
    @Args('password') password: string,
    @Context() context: CustomContext,
  ): Promise<User> {
    const user = await this.authService.findOrCreateUser(userName, password);

    context.res.cookie('sessionId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return user;
  }

  @Mutation(() => Boolean)
  async logout(@Context() context: CustomContext): Promise<boolean> {
    context.res.clearCookie('sessionId');
    return true;
  }

  // ***** Queries *****
  @Query(() => User)
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User): User {
    return user;
  }

  @Query(() => [String])
  @UseGuards(AuthGuard)
  permissions(): Permissions[] {
    return Object.values(Permissions);
  }

  @Query(() => String)
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions(Permissions.READ_USER)
  async readUser(): Promise<string> {
    return 'OK';
  }

  @Query(() => String)
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions(Permissions.CREATE_USER)
  async createUser(): Promise<string> {
    return 'OK';
  }

  @Query(() => String)
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions(Permissions.UPDATE_USER)
  async updateUser(): Promise<string> {
    return 'OK';
  }

  @Query(() => String)
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions(Permissions.DELETE_USER)
  async deleteUser(): Promise<string> {
    return 'OK';
  }
}
