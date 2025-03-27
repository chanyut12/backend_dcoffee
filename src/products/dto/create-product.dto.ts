import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'ชื่อของสินค้า',
    example: 'Coffee',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ราคาของสินค้า',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    description: 'Id ของ size',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: string[] | number[] }) =>
    Array.isArray(value) ? value.map(Number) : value,
  )
  sizeId?: number[];

  @ApiProperty({
    description: 'Id ของ sweetlevel',
    example: [1, 2, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: string[] | number[] }) =>
    Array.isArray(value) ? value.map(Number) : value,
  ) // แปลงจาก array ของ string เป็น array ของ number
  sweetlevelId?: number[];

  @ApiProperty({
    description: 'Id ของหมวดหมู่สินค้า',
    example: 1,
  })
  @IsNotEmpty()
  categoryProductId: number;

  @ApiProperty({
    description: 'Id ของประเภทของสินค้า',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsNotEmpty()
  @Transform(({ value }: { value: string[] | number[] }) =>
    Array.isArray(value) ? value.map(Number) : value,
  ) // แปลงจาก array ของ string เป็น array ของ number
  typeId: number[];

  @ApiProperty({
    description: 'รูปภาพของสินค้า',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional() //validate
  file?: string;
}
