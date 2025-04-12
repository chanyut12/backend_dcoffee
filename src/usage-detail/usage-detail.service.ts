import { Injectable } from '@nestjs/common';
import { CreateUsageDetailDto } from './dto/create-usage-detail.dto';
import { UpdateUsageDetailDto } from './dto/update-usage-detail.dto';

@Injectable()
export class UsageDetailService {
  create(createUsageDetailDto: CreateUsageDetailDto) {
    return 'This action adds a new usageDetail';
  }

  findAll() {
    return `This action returns all usageDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usageDetail`;
  }

  update(id: number, updateUsageDetailDto: UpdateUsageDetailDto) {
    return `This action updates a #${id} usageDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} usageDetail`;
  }
}
