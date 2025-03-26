import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Salary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payDate: string;

  @Column()
  amount: number;

  @Column()
  userID: number;

  @Column()
  totalHours: number;

  @Column({ nullable: true })
  paymentMethod?: 'cash' | 'transfer';
}
