import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
