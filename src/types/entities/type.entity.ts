import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Type Name',
    example: 'Hot',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  //   @OneToMany(() => User, (user) => user.roles)
  //   users: User[];
}
