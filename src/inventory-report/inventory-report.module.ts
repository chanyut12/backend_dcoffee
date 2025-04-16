import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryReportController } from './inventory-report.controller';
import { InventoryReportService } from './inventory-report.service';
import { InventoryItem } from '../inventory-items/entities/inventory-item.entity';
import { UsageDetail } from '../usage-detail/entities/usage-detail.entity';
import { UsageRecord } from '../usage-record/entities/usage-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItem, UsageDetail, UsageRecord]),
  ],
  controllers: [InventoryReportController],
  providers: [InventoryReportService],
})
export class InventoryReportModule {}
