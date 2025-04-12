import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { CartItemDto } from './cart-item.dto';
import { Type } from 'class-transformer';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Array of inventory items',
    type: [CartItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
