import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => InventoryItem,
    (inventoryItem) => inventoryItem.orderDetails,
    { nullable: true },
  )
  @JoinColumn({ name: 'inventoryItemId' }) // สร้างความสัมพันธ์กับ inventoryItem
  inventoryItem: InventoryItem; // เชื่อมโยงกับ inventoryItem

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column()
  price: number;

  @Column()
  supplier?: string;
}
