import { Module } from '@nestjs/common';
import { StockcheckDetailService } from './stockcheck-detail.service';
import { StockcheckDetailController } from './stockcheck-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { StockcheckDetail } from './entities/stockcheck-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, StockcheckDetail])],
  controllers: [StockcheckDetailController],
  providers: [StockcheckDetailService],
  exports: [StockcheckDetailService],
})
export class StockcheckDetailModule {}
