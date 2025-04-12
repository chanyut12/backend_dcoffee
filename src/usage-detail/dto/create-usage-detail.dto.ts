import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUsageDetailDto {
  @ApiProperty({
    description:
      'The inventory item ID (ควรระบุเพื่อเชื่อมโยงกับรายการสินค้าคงคลัง)',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  inventoryItemId?: number;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Capuchino',
  })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'The quantity used',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  quantityUsed: number;

  @ApiProperty({
    description: 'The unit of measurement',
    example: 'kg',
  })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'The purpose of usage',
    example: 'Production',
    enum: ['Production', 'Loss', 'Other'],
  })
  @IsNotEmpty()
  @IsString()
  purpose: string;
}
