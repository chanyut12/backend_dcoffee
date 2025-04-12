import { ApiProperty } from '@nestjs/swagger';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { UsageRecord } from 'src/usage-record/entities/usage-record.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';

@Entity()
export class UsageDetail {
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
    (inventoryItem) => inventoryItem.usageDetails,
    { nullable: true },
  )
  @JoinColumn({ name: 'inventoryItemId' })
  @Exclude({ toPlainOnly: true })
  inventoryItem: InventoryItem;

  @ApiProperty({
    description: 'Inventory item ID',
    example: 2,
    required: true,
  })
  @Expose()
  @Transform(({ obj }: { obj: UsageDetail }) => obj.inventoryItem?.id || null, {
    toPlainOnly: true,
  })
  get inventoryItemId(): number | null {
    return this.inventoryItem?.id || null;
  }

  @ApiProperty({
    description: 'Product name',
    example: 'Coffee Beans Arabica',
  })
  @Column()
  productName: string;

  @ApiProperty({
    description: 'Quantity used',
    example: 2,
  })
  @Column()
  quantityUsed: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'kg',
  })
  @Column()
  unit: string;

  @ApiProperty({
    description: 'Purpose of usage',
    example: 'Production',
  })
  @Column()
  purpose: string;

  @ApiProperty({
    description: 'Related usage record',
    type: () => UsageRecord,
  })
  @ManyToOne(() => UsageRecord, (usageRecord) => usageRecord.details)
  @Exclude({ toPlainOnly: true })
  usageRecord: UsageRecord;

  // Method to validate usage data
  validateUsageData(): boolean {
    return this.quantityUsed > 0;
  }
}
