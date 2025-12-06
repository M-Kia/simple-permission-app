import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entity';

export type CustomRequest = Request & {
  cookies: {
    sessionId?: string;
  };
  user?: User;
};

export type CustomContext = { req: CustomRequest; res: Response };
