// src/stockcheck-detail/dto/create-stockcheck-detail.dto.ts
import { IsInt, IsString, IsNotEmpty, ValidateNested } from 'class-validator';
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
    description: 'The Name of the inventory item',
    example: 'Capuchino',
  })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({
    description: 'Number of previousQuantity',
    example: 20,
  })
  @IsInt()
  @IsNotEmpty()
  previousQuantity: number;

  @ApiProperty({
    description: 'Number of NewQuantity',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  newQuantity: number;

  @ApiProperty({
    description: 'Unit of Item',
    example: 'kg',
  })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({
    description: 'Status of Item',
    example: 'normal',
  })
  @IsString()
  @IsNotEmpty()
  status: 'normal' | 'warning' | 'success';
}
