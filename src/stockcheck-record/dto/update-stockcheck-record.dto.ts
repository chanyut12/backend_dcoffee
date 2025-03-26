import { PartialType } from '@nestjs/swagger';
import { CreateStockcheckRecordDto } from './create-stockcheck-record.dto';

export class UpdateStockcheckRecordDto extends PartialType(
  CreateStockcheckRecordDto,
) {}
