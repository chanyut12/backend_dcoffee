import { Controller, Get, Query } from '@nestjs/common';
import { OrderReportService } from './order-report.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('order-report')
@Controller('order-report')
export class OrderReportController {
  constructor(private readonly orderReportService: OrderReportService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Get daily order report' })
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    description: 'Date in YYYY-MM-DD format',
  })
  getDailyReport(@Query('date') dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.orderReportService.getDailyReport(date);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly order report' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  getMonthlyReport(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.orderReportService.getMonthlyReport(year, month);
  }

  @Get('yearly')
  @ApiOperation({ summary: 'Get yearly order report' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  getYearlyReport(@Query('year') year?: number) {
    return this.orderReportService.getYearlyReport(year);
  }

  @Get('chart')
  @ApiOperation({ summary: 'Get order data for charts' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['monthly', 'product', 'status'],
    description: 'Type of chart data to return',
  })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['summary', 'graph'],
    description: 'Format of chart data (summary or graph visualization data)',
  })
  getChartData(
    @Query('year') year?: number,
    @Query('type') chartType: 'monthly' | 'product' | 'status' = 'monthly',
    @Query('format') format: 'summary' | 'graph' = 'summary',
  ) {
    return this.orderReportService.getChartData(year, chartType, format);
  }

  @Get('chart/daily')
  @ApiOperation({ summary: 'Get daily order data for detailed charts' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['summary', 'graph'],
    description: 'Format of chart data (summary or graph visualization data)',
  })
  getDailyChartData(
    @Query('year') year?: number,
    @Query('month') month?: number,
    @Query('format') format: 'summary' | 'graph' = 'summary',
  ) {
    return this.orderReportService.getDailyChartData(year, month, format);
  }
}
