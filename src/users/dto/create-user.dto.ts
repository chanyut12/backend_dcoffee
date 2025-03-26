import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'chan',
  })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'chan@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  @ApiProperty({
    description: 'The roles of the user',
    example: [{ id: 1 }, { id: 2 }],
  })
  roles: Role[];

  @ApiProperty({
    description: 'The gender of the user',
    example: 'Male',
  })
  gender: 'Male' | 'Female';
}
