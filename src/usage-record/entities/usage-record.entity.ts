import { ApiProperty } from '@nestjs/swagger';
import { UsageDetail } from 'src/usage-detail/entities/usage-detail.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type, Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class UsageRecord {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Date of usage',
    example: '2023-06-15',
  })
  @Column()
  date: Date;

  @ApiProperty({
    description: 'Name of staff who recorded the usage',
    example: 'John Doe',
  })
  @Column()
  staffName: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Used for weekend production',
    nullable: true,
  })
  @Column({ nullable: true })
  note: string;

  @ApiProperty({
    description: 'Total usage quantity',
    example: 10,
  })
  @Column({ default: 0 })
  totalUsage: number;

  @ApiProperty({
    description: 'ID of the user who created the record',
    example: 1,
    nullable: true,
  })
  @Column({ nullable: true })
  userId: number;

  @ApiProperty({
    description: 'Related usage details',
    type: [UsageDetail],
  })
  @Type(() => UsageDetail)
  @OneToMany(() => UsageDetail, (usageDetail) => usageDetail.usageRecord, {
    cascade: true,
    eager: true,
  })
  details: UsageDetail[];

  @Exclude()
  @ManyToOne(() => User, (user) => user.usageRecords)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Calculate total usage
  calculateTotalUsage(): number {
    if (!this.details || this.details.length === 0) {
      this.totalUsage = 0;
    } else {
      this.totalUsage = this.details.reduce(
        (sum, detail) => sum + detail.quantityUsed,
        0,
      );
    }
    return this.totalUsage;
  }
}
