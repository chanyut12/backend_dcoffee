import { Controller, Get, Query } from '@nestjs/common';
import {
  DetailedUsageChartData,
  InventoryReportService,
  MonthlyInventoryReport,
  MonthlyUsageReport,
  UsageChartData,
} from './inventory-report.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('inventory-report')
@Controller('inventory-report')
export class InventoryReportController {
  constructor(
    private readonly inventoryReportService: InventoryReportService,
  ) {}

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly inventory report' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  getMonthlyReport(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<MonthlyInventoryReport> {
    return this.inventoryReportService.getMonthlyReport(year, month);
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get monthly usage report' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  getMonthlyUsageReport(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<MonthlyUsageReport> {
    return this.inventoryReportService.getMonthlyUsageReport(year, month);
  }

  @Get('usage/chart')
  @ApiOperation({ summary: 'Get usage data for charts' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  getChartData(@Query('year') year?: number): Promise<UsageChartData> {
    return this.inventoryReportService.getUsageChartData(year);
  }

  @Get('usage/chart/detailed')
  @ApiOperation({ summary: 'Get detailed usage data for charts and graphs' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['monthly', 'yearly', 'category', 'item'],
    description: 'Type of chart data to return',
  })
  getDetailedChartData(
    @Query('year') year?: number,
    @Query('month') month?: number,
    @Query('type') chartType?: 'monthly' | 'yearly' | 'category' | 'item',
  ): Promise<DetailedUsageChartData> {
    return this.inventoryReportService.getDetailedUsageChartData(
      year,
      month,
      chartType,
    );
  }
}
