import { OrderDetail } from 'src/order-detail/entities/order-detail.entity';
import { OrderRecord } from 'src/order-record/entities/order-record.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderReportController } from './order-report.controller';
import { OrderReportService } from './order-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRecord, OrderDetail])],
  controllers: [OrderReportController],
  providers: [OrderReportService],
})
export class OrderReportModule {}
