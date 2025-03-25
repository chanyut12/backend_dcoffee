import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
  @ApiProperty({
    description: 'The roles of the user',
    example: ['admin', 'user'],
  })
  roles: Role[];
  @ApiProperty({
    description: 'The gender of the user',
    example: 'male',
  })
  gender: 'male' | 'female';
}
