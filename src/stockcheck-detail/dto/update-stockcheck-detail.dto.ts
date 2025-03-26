import { PartialType } from '@nestjs/swagger';
import { CreateStockCheckDetailDto } from './create-stockcheck-detail.dto';

export class UpdateStockcheckDetailDto extends PartialType(
  CreateStockCheckDetailDto,
) {}
