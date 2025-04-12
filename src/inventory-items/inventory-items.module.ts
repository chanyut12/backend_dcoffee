import { Module } from '@nestjs/common';
import { InventoryItemsService } from './inventory-items.service';
import { InventoryItemsController } from './inventory-items.controller';
import { InventoryItem } from './entities/inventory-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { StockcheckDetail } from 'src/stockcheck-detail/entities/stockcheck-detail.entity';
import { UsageDetail } from 'src/usage-detail/entities/usage-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InventoryItem,
      Category,
      OrderDetail,
      StockcheckDetail,
      UsageDetail,
    ]),
  ],
  controllers: [InventoryItemsController],
  providers: [InventoryItemsService],
  exports: [InventoryItemsService],
})
export class InventoryItemsModule {}
