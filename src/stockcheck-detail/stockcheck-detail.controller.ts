import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StockcheckDetailService } from './stockcheck-detail.service';
import { CreateStockCheckDetailDto } from './dto/create-stockcheck-detail.dto';
import { UpdateStockcheckDetailDto } from './dto/update-stockcheck-detail.dto';

@Controller('stockcheck-detail')
export class StockcheckDetailController {
  constructor(
    private readonly stockcheckDetailService: StockcheckDetailService,
  ) {}

  @Post()
  create(@Body() createStockcheckDetailDto: CreateStockCheckDetailDto) {
    return this.stockcheckDetailService.create(createStockcheckDetailDto);
  }

  @Get()
  findAll() {
    return this.stockcheckDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockcheckDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockcheckDetailDto: UpdateStockcheckDetailDto,
  ) {
    return this.stockcheckDetailService.update(+id, updateStockcheckDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockcheckDetailService.remove(+id);
  }
}
