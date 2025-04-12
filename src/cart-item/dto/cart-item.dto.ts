import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

import { IsNotEmpty } from 'class-validator';

export class CartItemDto {
  @ApiProperty({
    description: 'ID of the inventory item',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  inventoryItemId: number;

  @ApiProperty({
    description: 'Quantity to order',
    example: 10,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  orderQuantity: number;
}
