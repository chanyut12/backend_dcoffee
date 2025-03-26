import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Category Name',
    example: 'Coffee',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  //   @OneToMany(() => User, (user) => user.roles)
  //   users: User[];
}
