import { ApiProperty } from '@nestjs/swagger';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { OrderRecord } from 'src/order-record/entities/order-record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class OrderDetail {
  @ApiProperty({
    description: 'Unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Related inventory item',
    type: () => InventoryItem,
  })
  @ManyToOne(
    () => InventoryItem,
    (inventoryItem) => inventoryItem.orderDetails,
    { nullable: true },
  )
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem: InventoryItem;

  @ApiProperty({
    description: 'Product name',
    example: 'Coffee Beans Arabica',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 10,
  })
  @Column()
  quantity: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'kg',
  })
  @Column()
  unit: string;

  @ApiProperty({
    description: 'Price per unit',
    example: 250,
  })
  @Column()
  price: number;

  @ApiProperty({
    description: 'Total price for this item',
    example: 2500,
  })
  @Column({ default: 0 })
  total: number;

  @ApiProperty({
    description: 'Supplier name',
    example: 'Coffee Supplier Co.',
  })
  @Column({ nullable: true })
  supplier: string;

  @ApiProperty({
    description: 'ID of the related order record',
    example: 1,
  })
  @Column({ nullable: true })
  orderRecordId: number;

  @Exclude()
  @ManyToOne(() => OrderRecord, (orderRecord) => orderRecord.details)
  @JoinColumn({ name: 'orderRecordId' })
  orderRecord: OrderRecord;

  // Calculate total price for this item
  calculateTotalPrice(): number {
    this.total = this.price * this.quantity;
    return this.total;
  }
}
