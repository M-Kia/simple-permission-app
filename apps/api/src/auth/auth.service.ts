import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CustomRequest } from './type';
import { Permissions } from 'src/user/entities/permissions.enum';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async findOrCreateUser(userName: string, password: string): Promise<User> {
    const user = await this.userService.findUserByUserName(userName);
    if (!user) return this.userService.createUser(userName, password);

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async getUserFromSession(req: CustomRequest): Promise<User> {
    const sessionId = req.cookies?.sessionId;
    if (!sessionId)
      throw new UnauthorizedException('Not authenticated. Please login first.');

    const user = await this.userService.findUserById(sessionId);
    if (!user) throw new UnauthorizedException('User not found');

    return user;
  }

  async hasPermission(
    req: CustomRequest,
    permission: Permissions,
  ): Promise<string> {
    const user = await this.getUserFromSession(req);
    return user.permissions.includes(permission) ? 'OK' : 'NOT ALLOWED';
  }
}
