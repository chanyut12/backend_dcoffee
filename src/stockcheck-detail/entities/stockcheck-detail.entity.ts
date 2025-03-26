import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StockcheckDetail {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(
    () => InventoryItem,
    (inventoryitem) => inventoryitem.stockCheckDetails,
    {
      nullable: true,
    },
  )
  inventoryitem: InventoryItem;

  @Column()
  productName: string;

  @Column()
  previousQuantity: number;

  @Column()
  newQuantity: number;

  @Column()
  unit: string;

  @Column()
  difference: number;

  @Column()
  status: string;
}
