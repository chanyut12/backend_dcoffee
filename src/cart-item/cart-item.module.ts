import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, InventoryItem])],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
