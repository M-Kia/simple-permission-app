import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { CustomRequest } from '../type';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
      const user = await this.userService.findUserById(sessionId);
      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
