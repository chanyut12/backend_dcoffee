import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateCheckTimeDto {
  @ApiProperty({
    description: 'รหัสผู้ใช้',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'เวลาที่ check-in',
    example: '2023-03-27T08:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  checkInTime?: Date;

  @ApiProperty({
    description: 'เวลาที่ check-out',
    example: '2023-03-27T17:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  checkOutTime?: Date;
}
