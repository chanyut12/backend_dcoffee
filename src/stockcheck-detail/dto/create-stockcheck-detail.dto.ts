// src/stockcheck-detail/dto/create-stockcheck-detail.dto.ts
import { IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity'; // ปรับเส้นทางให้ถูกต้อง

export class CreateStockCheckDetailDto {
  @ApiProperty({
    description: 'Inventory item object with id',
    example: { id: 4 },
  })
  @ValidateNested()
  @Type(() => InventoryItem)
  @IsNotEmpty()
  inventoryitem: InventoryItem; // รับ InventoryItem ทั้ง object

  @ApiProperty({
    description: 'Number of NewQuantity',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  newQuantity: number;
}
