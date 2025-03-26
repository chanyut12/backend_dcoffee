import { Module } from '@nestjs/common';
import { StockcheckRecordService } from './stockcheck-record.service';
import { StockcheckRecordController } from './stockcheck-record.controller';

@Module({
  controllers: [StockcheckRecordController],
  providers: [StockcheckRecordService],
})
export class StockcheckRecordModule {}
