import bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { ModelEntity } from './model.entity';
import { GENDER } from 'share/enum';

@Entity('Customer')
export class Customer extends ModelEntity {

  @Column({
    nullable: true,
    length: 255,
  })
  name: string;

  @Column({})
  dateOfBirth: Date;

  @Column({
    nullable: true,
    length: 255,
  })
  address: string;

  @Column({
    nullable: true,
    length: 255,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  gender: GENDER;

  @Column({})
  note: string;

  @Column({
    nullable: true,
  })
  refferal_code: string;

  @Column({})
  pathological: string;

  @Column({
    nullable: true,
    default: 0,
  })
  reward_point: number;
}
