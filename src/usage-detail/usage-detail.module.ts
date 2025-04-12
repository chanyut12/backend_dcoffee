import { Module } from '@nestjs/common';
import { UsageDetailService } from './usage-detail.service';
import { UsageDetailController } from './usage-detail.controller';

@Module({
  controllers: [UsageDetailController],
  providers: [UsageDetailService],
})
export class UsageDetailModule {}
