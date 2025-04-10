import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsInt } from 'class-validator';
export class StockcheckItemDto {
  @ApiProperty({
    description: 'Inventory item ID',
    example: 4,
  })
  @IsInt()
  @IsNotEmpty()
  inventoryItemId: number;

  @ApiProperty({
    description: 'Number of new quantity',
    example: 10,
  })
  @IsInt()
  @IsNotEmpty()
  newQuantity: number;
}
