import { Request, Response } from 'express';

export type CustomRequest = Request & {
  cookies: {
    sessionId?: string;
  };
};

export type CustomContext = { req: CustomRequest; res: Response };
