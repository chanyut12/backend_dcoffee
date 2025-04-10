import { Module } from '@nestjs/common';
import { StockcheckRecordService } from './stockcheck-record.service';
import { StockcheckRecordController } from './stockcheck-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockcheckRecord } from './entities/stockcheck-record.entity';
import { StockcheckDetail } from 'src/stockcheck-detail/entities/stockcheck-detail.entity';
import { User } from 'src/users/entities/user.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockcheckRecord,
      StockcheckDetail,
      User,
      InventoryItem,
    ]),
  ],
  controllers: [StockcheckRecordController],
  providers: [StockcheckRecordService],
})
export class StockcheckRecordModule {}
