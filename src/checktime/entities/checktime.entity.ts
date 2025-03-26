import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CheckTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'datetime' })
  checkInTime: Date;

  @Column({ type: 'datetime', nullable: true })
  checkOutTime: Date;

  @Column()
  totalHours: number;
}
