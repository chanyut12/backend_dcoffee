import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderRecordService } from './order-record.service';
import { CreateOrderRecordDto } from './dto/create-order-record.dto';
import { UpdateOrderRecordDto } from './dto/update-order-record.dto';

@Controller('order-record')
export class OrderRecordController {
  constructor(private readonly orderRecordService: OrderRecordService) {}

  @Post()
  create(@Body() createOrderRecordDto: CreateOrderRecordDto) {
    return this.orderRecordService.create(createOrderRecordDto);
  }

  @Get()
  findAll() {
    return this.orderRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderRecordService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderRecordDto: UpdateOrderRecordDto,
  ) {
    return this.orderRecordService.update(+id, updateOrderRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderRecordService.remove(+id);
  }
}
