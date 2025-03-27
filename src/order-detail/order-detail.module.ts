import { Module } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { OrderDetailController } from './order-detail.controller';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, OrderDetail])],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService],
})
export class OrderDetailModule { }
