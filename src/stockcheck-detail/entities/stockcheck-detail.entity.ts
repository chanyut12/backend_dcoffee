import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { StockcheckRecord } from 'src/stockcheck-record/entities/stockcheck-record.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StockcheckDetail {
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
    (inventoryitem) => inventoryitem.stockCheckDetails,
    {
      nullable: true,
    },
  )
  inventoryitem: InventoryItem;

  @ApiProperty({
    description: 'Product name',
    example: 'Coffee Beans Arabica',
  })
  @Column()
  productName: string;

  @ApiProperty({
    description: 'Previous quantity before stock check',
    example: 20,
  })
  @Column()
  previousQuantity: number;

  @ApiProperty({
    description: 'New quantity after stock check',
    example: 18,
  })
  @Column()
  newQuantity: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'kg',
  })
  @Column()
  unit: string;

  @ApiProperty({
    description: 'Difference between previous and new quantity',
    example: 2,
  })
  @Column()
  difference: number;

  @ApiProperty({
    description: 'Status based on stock level',
    example: 'normal',
    enum: ['normal', 'warning'],
  })
  @Column()
  status: string;

  @ApiProperty({
    description: 'Related stock check record',
    type: () => StockcheckRecord,
  })
  @ManyToOne(
    () => StockcheckRecord,
    (stockcheckRecord) => stockcheckRecord.stockcheckDetails,
  )
  stockcheckRecord: StockcheckRecord;
}
