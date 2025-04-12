import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import { OrderRecordService } from './order-record.service';
import { CreateOrderRecordDto } from './dto/create-order-record.dto';
import { UpdateOrderRecordDto } from './dto/update-order-record.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderRecord } from './entities/order-record.entity';
import { Request } from 'express';

@ApiTags('order-records')
@Controller('order-records')
@UseInterceptors(ClassSerializerInterceptor)
export class OrderRecordController {
  constructor(private readonly orderRecordService: OrderRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order record' })
  @ApiResponse({
    status: 201,
    description: 'The order record has been successfully created',
    type: OrderRecord,
  })
  create(
    @Body() createOrderRecordDto: CreateOrderRecordDto,
    @Req() req: Request & { user?: { id: number } },
  ) {
    // Add userId from authenticated user if available
    const userId = req.user?.id;
    return this.orderRecordService.create({
      ...createOrderRecordDto,
      userId,
    });
  }

  @Post('from-cart')
  @ApiOperation({ summary: 'Create a new order from cart items' })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created from cart items',
    type: OrderRecord,
  })
  @ApiResponse({
    status: 404,
    description: 'No items in cart to create order',
  })
  createFromCart(
    @Body() createOrderRecordDto: CreateOrderRecordDto,
    @Req() req: Request & { user?: { id: number } },
  ) {
    // Add userId from authenticated user if available
    const userId = req.user?.id;
    return this.orderRecordService.createFromCart({
      ...createOrderRecordDto,
      userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all order records' })
  @ApiResponse({
    status: 200,
    description: 'List of all order records',
    type: [OrderRecord],
  })
  findAll() {
    return this.orderRecordService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order record' })
  @ApiResponse({
    status: 200,
    description: 'The found order record',
    type: OrderRecord,
  })
  @ApiResponse({ status: 404, description: 'Order record not found' })
  findOne(@Param('id') id: string) {
    return this.orderRecordService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order record' })
  @ApiResponse({
    status: 200,
    description: 'The order record has been successfully updated',
    type: OrderRecord,
  })
  @ApiResponse({ status: 404, description: 'Order record not found' })
  update(
    @Param('id') id: string,
    @Body() updateOrderRecordDto: UpdateOrderRecordDto,
  ) {
    return this.orderRecordService.update(+id, updateOrderRecordDto);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update an order status' })
  @ApiResponse({
    status: 200,
    description: 'The order status has been successfully updated',
    type: OrderRecord,
  })
  @ApiResponse({ status: 404, description: 'Order record not found' })
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: 'pending' | 'delivered' | 'cancelled',
  ) {
    return this.orderRecordService.updateStatus(+id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an order record' })
  @ApiResponse({
    status: 204,
    description: 'The order record has been successfully removed',
  })
  @ApiResponse({ status: 404, description: 'Order record not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.orderRecordService.remove(+id);
  }
}
