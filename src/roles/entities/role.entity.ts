import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    description: 'The name of the role',
    example: 'admin',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
