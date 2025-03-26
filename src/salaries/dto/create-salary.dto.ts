import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSalaryDto {
  @ApiProperty({
    description: 'วันที่จ่าย',
    example: '2021-09-01',
  })
  @IsString()
  payDate: string;

  @ApiProperty({
    description: 'จำนวนเงิน',
    example: 10000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'รหัสผู้ใช้',
    example: 1,
  })
  @IsNumber()
  userID: number;

  @ApiProperty({
    description: 'จำนวนชั่วโมงทำงาน',
    example: 8,
  })
  @IsNumber()
  totalHours: number;
}
