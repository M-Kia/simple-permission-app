import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Permissions } from './entities/permissions.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createUser(userName: string, password: string): Promise<User> {
    const existingUser = await this.findUserByUserName(userName);
    if (existingUser) throw new Error('User already exists');

    const randomNumber = Math.floor(Math.random() * 4);

    const permissions = [
      Permissions.READ_USER,
      Permissions.CREATE_USER,
      Permissions.UPDATE_USER,
      Permissions.DELETE_USER,
    ].slice(0, randomNumber);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      userName,
      password: hashedPassword,
      permissions,
    });

    return this.userRepository.save(user);
  }

  findUserByUserName(userName: string): Promise<User | null> {
    return this.userRepository.findOneBy({ userName });
  }

  findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
