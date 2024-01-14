import { Entity, Column } from 'typeorm';

import { ModelEntity } from './model';

@Entity('bloodsugar')
export class BloodSugar extends ModelEntity {
  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: true })
  blood_sugar_level: number;

  @Column({ nullable: false })
  test_date: Date;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: false })
  test_time: Date;
}
