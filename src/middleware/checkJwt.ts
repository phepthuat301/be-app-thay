import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JwtPayload } from '../types/JwtPayload';
import { createJwtToken } from '../utils/createJwtToken';
import { CustomError } from '../utils/response/custom-error/CustomError';
import { getRepository } from 'typeorm';
import { User } from 'orm/entities/models/user';
import { USER_STATUS_ENUM } from 'share/enum';

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const customError = new CustomError(400, 'General', 'Authorization header not provided');
    return next(customError);
  }

  const token = authHeader.split(' ')[1];
  let jwtPayload: { [key: string]: any };
  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as { [key: string]: any };
    ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
    req.jwtPayload = jwtPayload as JwtPayload;
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      // Handle token expiration error
      const customError = new CustomError(401, 'Raw', 'JWT error', null, err);
      return next(customError);
    }
  }

  try {
    const user = await getRepository(User).findOne(jwtPayload.id);
    if (!user || user.status !== USER_STATUS_ENUM.ACTIVE) {
      const customError = new CustomError(403, 'General', 'User is not active');
      return next(customError);
    }
    // Refresh and send a new token on every request
    const newToken = createJwtToken(jwtPayload as JwtPayload);
    res.setHeader('token', `Bearer ${newToken}`);
    return next();
  } catch (err) {
    const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
    return next(customError);
  }
};
