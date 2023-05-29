import bcrypt from 'bcryptjs';
import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';
import { ROLE_ENUM, ADMIN_STATUS_ENUM } from '../../../share/enum';
@Entity('admin')
export class Admin extends ModelEntity {
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    unique: true,
  })
  username: string;

  @Column({
    default: 'ADMINISTATOR',
    length: 30,
  })
  role: ROLE_ENUM;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  status: ADMIN_STATUS_ENUM;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
