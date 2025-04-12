import { ApiProperty } from '@nestjs/swagger';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class CartItem {
  @ApiProperty({
    description: 'Item ID (from InventoryItem)',
    example: 1,
  })
  @Column({ primary: true })
  id: number;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Coffee Beans Arabica',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Product category',
    example: 'Coffee',
  })
  @Column()
  category: string;

  @ApiProperty({
    description: 'Current quantity in stock',
    example: 20,
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
    description: 'Minimum stock level',
    example: 5,
  })
  @Column()
  minStock: number;

  @ApiProperty({
    description: 'Price per unit',
    example: 250,
  })
  @Column()
  price: number;

  @ApiProperty({
    description: 'Supplier name',
    example: 'Coffee Supplier Co.',
  })
  @Column()
  supplier: string;

  @ApiProperty({
    description: 'Last order date',
    example: '2023-05-15',
  })
  @Column()
  lastOrder: string;

  @ApiProperty({
    description: 'Quantity to order',
    example: 10,
  })
  @Column({ default: 0 })
  orderQuantity: number;

  @ApiProperty({
    description: 'Total price (price * orderQuantity)',
    example: 2500,
  })
  @Column({ default: 0 })
  total: number;

  @OneToOne(() => InventoryItem)
  @JoinColumn({ name: 'id' })
  inventoryItem: InventoryItem;

  // Calculate total price based on price and orderQuantity
  calculateTotalPrice(): number {
    this.total = this.price * this.orderQuantity;
    return this.total;
  }

  // Convert CartItem to OrderDetail
  convertToOrderDetail() {
    return {
      inventoryItem: { id: this.id },
      name: this.name,
      quantity: this.orderQuantity,
      unit: this.unit,
      price: this.price,
      supplier: this.supplier,
    };
  }
}
