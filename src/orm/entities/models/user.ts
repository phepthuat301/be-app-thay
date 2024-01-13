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
  liver_enzyme_test_result_image: string;

  @Column({
    nullable: true,
  })
  diabetic_test_result_image: string;

  @Column({
    nullable: true,
  })
  year_of_birth: string;

  @Column({
    nullable: true,
    default: true,
  })
  is_first_upload: boolean;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
