import { Module } from '@nestjs/common';
import { OrderRecordService } from './order-record.service';
import { OrderRecordController } from './order-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRecord } from './entities/order-record.entity';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { OrderDetailModule } from 'src/order-detail/order-detail.module';
import { CartItemModule } from 'src/cart-item/cart-item.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRecord, OrderDetail, InventoryItem, User]),
    OrderDetailModule,
    CartItemModule,
    UsersModule,
  ],
  controllers: [OrderRecordController],
  providers: [OrderRecordService],
  exports: [OrderRecordService],
})
export class OrderRecordModule {}
