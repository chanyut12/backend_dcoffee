import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUsageDetailDto } from 'src/usage-detail/dto/create-usage-detail.dto';

export class CreateUsageRecordDto {
  @ApiProperty({
    description: 'Name of staff who recorded the usage',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  staffName: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Used for weekend production',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'ID of the user who created the record',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({
    description: 'Details of items used',
    type: [CreateUsageDetailDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUsageDetailDto)
  details: CreateUsageDetailDto[];
}
