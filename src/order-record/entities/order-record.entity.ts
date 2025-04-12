import { ApiProperty } from '@nestjs/swagger';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class OrderRecord {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Order date',
    example: '2023-06-10',
  })
  @Column()
  orderDate: Date;

  @ApiProperty({
    description: 'Name of staff who placed the order',
    example: 'John Doe',
  })
  @Column()
  staffName: string;

  @ApiProperty({
    description: 'Order status',
    example: 'pending',
    enum: ['pending', 'delivered', 'cancelled'],
  })
  @Column({ default: 'pending' })
  status: string;

  @ApiProperty({
    description: 'Delivery date',
    example: '2023-06-15',
    nullable: true,
  })
  @Column({ nullable: true })
  deliveryDate: Date;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Urgent order for weekend',
    nullable: true,
  })
  @Column({ nullable: true })
  note: string;

  @ApiProperty({
    description: 'Total amount of the order',
    example: 5000,
  })
  @Column({ default: 0 })
  totalAmount: number;

  @ApiProperty({
    description: 'ID of the user who created the order',
    example: 1,
    nullable: true,
  })
  @Column({ nullable: true })
  userId: number;

  @ApiProperty({
    description: 'Related order details',
    type: [OrderDetail],
  })
  @Type(() => OrderDetail)
  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.orderRecord, {
    cascade: true,
    eager: true,
  })
  details: OrderDetail[];

  @Exclude()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  // Calculate total order amount
  calculateTotal(): number {
    if (this.details && this.details.length > 0) {
      this.totalAmount = this.details.reduce(
        (sum, detail) => sum + (detail.total || detail.price * detail.quantity),
        0,
      );
    } else {
      this.totalAmount = 0;
    }
    return this.totalAmount;
  }

  // Track order status
  trackOrderStatus(status: 'pending' | 'delivered' | 'cancelled'): void {
    this.status = status;
    if (status === 'delivered') {
      this.deliveryDate = new Date();
    }
  }
}
