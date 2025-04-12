import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderRecordDto {
  @ApiProperty({
    description: 'Name of staff who placed the order',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  staffName?: string;

  @ApiProperty({
    description: 'Order status',
    example: 'pending',
    enum: ['pending', 'delivered', 'cancelled'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'delivered', 'cancelled'])
  status?: 'pending' | 'delivered' | 'cancelled';

  @ApiProperty({
    description: 'Additional notes for the order',
    example: 'Urgent order for weekend',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
