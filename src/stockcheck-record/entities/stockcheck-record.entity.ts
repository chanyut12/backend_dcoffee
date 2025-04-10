import { StockcheckDetail } from 'src/stockcheck-detail/entities/stockcheck-detail.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StockcheckRecord {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Related stock check details',
    type: [StockcheckDetail],
  })
  @OneToMany(
    () => StockcheckDetail,
    (stockcheckDetail) => stockcheckDetail.stockcheckRecord,
    {
      cascade: true,
    },
  )
  stockcheckDetails: StockcheckDetail[];

  @ApiProperty({
    description: 'User who performed the check',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.stockcheckRecords)
  @JoinColumn()
  user: User;

  @ApiProperty({
    description: 'Date of the stock check',
    example: '2023-05-15',
  })
  @Column()
  checkDate: Date;

  @ApiProperty({
    description: 'Name of the staff who performed the check',
    example: 'John Doe',
  })
  @Column()
  staffName: string;

  @ApiProperty({
    description: 'Additional notes for the stock check',
    example: 'Weekly inventory count',
  })
  @Column()
  note: string;
}
