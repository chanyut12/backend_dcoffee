import { Injectable } from '@nestjs/common';
import { CreateStockcheckRecordDto } from './dto/create-stockcheck-record.dto';
import { UpdateStockcheckRecordDto } from './dto/update-stockcheck-record.dto';

@Injectable()
export class StockcheckRecordService {
  create(createStockcheckRecordDto: CreateStockcheckRecordDto) {
    return 'This action adds a new stockcheckRecord';
  }

  findAll() {
    return `This action returns all stockcheckRecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockcheckRecord`;
  }

  update(id: number, updateStockcheckRecordDto: UpdateStockcheckRecordDto) {
    return `This action updates a #${id} stockcheckRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockcheckRecord`;
  }
}
