import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { StockcheckRecord } from 'src/stockcheck-record/entities/stockcheck-record.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  gender: 'Male' | 'Female';

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  roles: Role[];

  @OneToMany(
    () => StockcheckRecord,
    (stockcheckRecord) => stockcheckRecord.user,
  )
  stockcheckRecords: StockcheckRecord[];
}
