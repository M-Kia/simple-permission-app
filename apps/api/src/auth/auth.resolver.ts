import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permissions } from 'src/user/entities/permissions.enum';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CustomContext } from './type';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
  ) {}

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
  whoAmI(@Context() context: CustomContext): Promise<User> {
    return this.authService.getUserFromSession(context.req);
  }

  @Query(() => [String])
  permissions(@Context() context: CustomContext): Permissions[] {
    const user = this.authService.getUserFromSession(context.req)
    if (!user) throw new UnauthorizedException("User not authenticated");
    return Object.values(Permissions);
  }

  @Query(() => String)
  async readUser(@Context() context: CustomContext): Promise<string> {
    return this.authService.hasPermission(context.req, Permissions.READ_USER);
  }

  @Query(() => String)
  async createUser(@Context() context: CustomContext): Promise<string> {
    return this.authService.hasPermission(context.req, Permissions.CREATE_USER);
  }

  @Query(() => String)
  async updateUser(@Context() context: CustomContext): Promise<string> {
    return this.authService.hasPermission(context.req, Permissions.UPDATE_USER);
  }

  @Query(() => String)
  async deleteUser(@Context() context: CustomContext): Promise<string> {
    return this.authService.hasPermission(context.req, Permissions.DELETE_USER);
  }
}
