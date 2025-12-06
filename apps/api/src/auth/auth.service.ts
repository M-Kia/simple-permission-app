import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
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
}
