import { Module } from '@nestjs/common';
import { OrderRecordService } from './order-record.service';
import { OrderRecordController } from './order-record.controller';

@Module({
  controllers: [OrderRecordController],
  providers: [OrderRecordService],
})
export class OrderRecordModule {}
