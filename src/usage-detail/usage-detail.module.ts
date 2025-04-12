import { Module } from '@nestjs/common';
import { UsageDetailService } from './usage-detail.service';
import { UsageDetailController } from './usage-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageDetail } from './entities/usage-detail.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsageDetail, InventoryItem])],
  controllers: [UsageDetailController],
  providers: [UsageDetailService],
  exports: [UsageDetailService],
})
export class UsageDetailModule {}
