import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StockcheckItemDto } from 'src/stockcheck-detail/dto/stockcheck-item.dto';

export class CreateStockcheckRecordDto {
  @ApiProperty({
    description: 'Date of the stock check',
    example: '2023-05-15',
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  checkDate: Date;

  @ApiProperty({
    description: 'Name of the staff who performed the check',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  staffName: string;

  @ApiProperty({
    description: 'Additional notes for the stock check',
    example: 'Weekly inventory count',
  })
  @IsString()
  note: string;

  @ApiProperty({
    description: 'Array of inventory items to check',
    type: [StockcheckItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockcheckItemDto)
  items: StockcheckItemDto[];

  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
