import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
// import { User } from 'src/users/entities/user.entity';
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

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.category)
  inventoryItems: InventoryItem[];

  //   @OneToMany(() => User, (user) => user.roles)
  //   users: User[];
}
