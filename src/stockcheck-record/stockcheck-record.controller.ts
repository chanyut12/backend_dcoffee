import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { StockcheckRecordService } from './stockcheck-record.service';
import { CreateStockcheckRecordDto } from './dto/create-stockcheck-record.dto';
import { UpdateStockcheckRecordDto } from './dto/update-stockcheck-record.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockcheckRecord } from './entities/stockcheck-record.entity';

@ApiTags('stockcheck-record')
@Controller('stockcheck-record')
export class StockcheckRecordController {
  constructor(
    private readonly stockcheckRecordService: StockcheckRecordService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new stock check record with details' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The stock check record has been successfully created.',
    type: StockcheckRecord,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'One or more inventory items were not found.',
  })
  create(@Body() createStockcheckRecordDto: CreateStockcheckRecordDto) {
    return this.stockcheckRecordService.create(createStockcheckRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stock check records' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all stock check records with their details.',
    type: [StockcheckRecord],
  })
  findAll() {
    return this.stockcheckRecordService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific stock check record by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the stock check record with details.',
    type: StockcheckRecord,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock check record not found.',
  })
  findOne(@Param('id') id: string) {
    return this.stockcheckRecordService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a stock check record' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The stock check record has been successfully updated.',
    type: StockcheckRecord,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock check record not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updateStockcheckRecordDto: UpdateStockcheckRecordDto,
  ) {
    return this.stockcheckRecordService.update(+id, updateStockcheckRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a stock check record' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The stock check record has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Stock check record not found.',
  })
  remove(@Param('id') id: string) {
    return this.stockcheckRecordService.remove(+id);
  }
}
