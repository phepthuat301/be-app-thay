import { ROLE_ENUM } from 'share/enum';

export type JwtPayload = {
  id: number;
  email: string;
  role: ROLE_ENUM;
  created_at: Date;
};
