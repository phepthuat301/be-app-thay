import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ModelEntity } from './model';

export interface AccountActionLogs {
  user_id: number;
  action_type: string;
  status: string;
  payload_forgot_method: string;
  payload_old_password: string
}

@Entity('account_action_log')
export class AccountActionLog extends ModelEntity implements AccountActionLogs {
  @Column()
  user_id: number;

  @Column()
  action_type: string;

  @Column()
  status: string;

  @Column()
  payload_forgot_method: string;
  
  @Column()
  payload_old_password: string;
}
