import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrderDetailDto {
  @ApiProperty({
    description: 'The inventory item ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  inventoryItemId?: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Coffee Beans Arabica',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The quantity to order',
    example: 10,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'The unit of measurement',
    example: 'kg',
  })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'The price per unit',
    example: 250,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'The supplier name',
    example: 'Coffee Supplier Co.',
    required: false,
  })
  @IsOptional()
  @IsString()
  supplier?: string;
}
