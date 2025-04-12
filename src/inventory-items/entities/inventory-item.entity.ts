import { Category } from 'src/categories/entities/category.entity';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { StockcheckDetail } from 'src/stockcheck-detail/entities/stockcheck-detail.entity';
import { UsageDetail } from 'src/usage-detail/entities/usage-detail.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.inventoryItems, {
    nullable: true,
  })
  category: Category;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column()
  minStock: number;

  @Column()
  price: number;

  @Column()
  supplier: string;

  @Column()
  lastOrder: string;

  @OneToMany(
    () => StockcheckDetail,
    (StockcheckDetail) => StockcheckDetail.inventoryitem,
  )
  stockCheckDetails: StockcheckDetail[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.inventoryItem)
  orderDetails: OrderDetail;

  @OneToMany(() => UsageDetail, (usageDetail) => usageDetail.inventoryItem)
  usageDetails: UsageDetail[];
}
