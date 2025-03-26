import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeDto {
  @ApiProperty({
    description: 'The name of the type',
    example: 'Hot',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
