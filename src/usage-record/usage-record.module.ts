import { Module } from '@nestjs/common';
import { UsageRecordService } from './usage-record.service';
import { UsageRecordController } from './usage-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageRecord } from './entities/usage-record.entity';
import { UsageDetail } from 'src/usage-detail/entities/usage-detail.entity';
import { UsageDetailModule } from 'src/usage-detail/usage-detail.module';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsageRecord, UsageDetail, InventoryItem, User]),
    UsageDetailModule,
  ],
  controllers: [UsageRecordController],
  providers: [UsageRecordService],
  exports: [UsageRecordService],
})
export class UsageRecordModule {}
