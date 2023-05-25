import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class ModelEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number

  @Column({
    name: 'created_at',
    nullable: false,
  })
  @CreateDateColumn()
  createdAt: Date

  @Column({
    name: 'updated_at',
    nullable: false,
  })
  @UpdateDateColumn()
  updatedAt: Date
}
