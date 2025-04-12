import { Injectable } from '@nestjs/common';
import { CreateUsageRecordDto } from './dto/create-usage-record.dto';
import { UpdateUsageRecordDto } from './dto/update-usage-record.dto';

@Injectable()
export class UsageRecordService {
  create(createUsageRecordDto: CreateUsageRecordDto) {
    return 'This action adds a new usageRecord';
  }

  findAll() {
    return `This action returns all usageRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usageRecord`;
  }

  update(id: number, updateUsageRecordDto: UpdateUsageRecordDto) {
    return `This action updates a #${id} usageRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} usageRecord`;
  }
}
