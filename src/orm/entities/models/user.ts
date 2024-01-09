import bcrypt from 'bcryptjs';
import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';
import { ROLE_ENUM, USER_STATUS_ENUM } from '../../../share/enum';
@Entity('users')
export class User extends ModelEntity {
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
    default: 'USER',
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
  name: string;

  @Column({
    nullable: true,
  })
  gender: string;

  @Column({
    nullable: true,
  })
  status: USER_STATUS_ENUM;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column({
    nullable: true,
  })
  liverEnzymeTestResultImage: string;

  @Column({
    nullable: true,
  })
  diabeticTestResultImage: string;

  @Column({
    nullable: true,
  })
  yearOfBirth: string;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
