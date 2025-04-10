// src/stockcheck-detail/dto/create-stockcheck-detail.dto.ts
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
// import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity'; // ปรับเส้นทางให้ถูกต้อง
import { StockcheckItemDto } from './stockcheck-item.dto';
export class CreateStockCheckDetailDto {
  @ApiProperty({
    description: 'Array of inventory items to check',
    type: [StockcheckItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockcheckItemDto)
  items: StockcheckItemDto[];
}
