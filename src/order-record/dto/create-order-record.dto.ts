import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderRecordDto {
  @ApiProperty({
    description: 'Name of staff who placed the order',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  staffName: string;

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Urgent order for weekend',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'ID of the user who created the order (default: 1)',
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
