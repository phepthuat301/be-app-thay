import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Admin } from 'orm/entities/models/admin';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = getRepository(Admin);
  try {
    const users = await userRepository.find({
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt'],
      relations: ['role'],
    });

    res.customSuccess(200, 'List of admins.', users);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of admins.`, null, err);
    return next(customError);
  }
};
