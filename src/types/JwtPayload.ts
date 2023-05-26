import { ROLE_ENUM } from 'share/enum';

export type JwtPayload = {
  id: number;
  name: string;
  email: string;
  role: ROLE_ENUM;
  created_at: Date;
};
