import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export class CreateInventoryItemDto {
  @ApiProperty({
    description: 'The name of the inventory item',
    example: 'Hot',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The category of the inventory item',
    example: { id: 1 },
  })
  category: Category;

  @ApiProperty({
    description: 'The quantity of the inventory item',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The unit of the inventory item',
    example: 'kg',
  })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'The minimum stock of the inventory item',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  minStock: number;

  @ApiProperty({
    description: 'The price of the inventory item',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The supplier of the inventory item',
    example: 'Supplier Name',
  })
  @IsNotEmpty()
  @IsString()
  supplier: string;

  @ApiProperty({
    description: 'The last order date of the inventory item',
    example: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  lastOrder: string;
}
