import { Injectable } from '@nestjs/common';
import { CreateOrderRecordDto } from './dto/create-order-record.dto';
import { UpdateOrderRecordDto } from './dto/update-order-record.dto';

@Injectable()
export class OrderRecordService {
  create(createOrderRecordDto: CreateOrderRecordDto) {
    return 'This action adds a new orderRecord';
  }

  findAll() {
    return `This action returns all orderRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderRecord`;
  }

  update(id: number, updateOrderRecordDto: UpdateOrderRecordDto) {
    return `This action updates a #${id} orderRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderRecord`;
  }
}
