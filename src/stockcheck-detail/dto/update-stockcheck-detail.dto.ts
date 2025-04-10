import { PartialType } from '@nestjs/swagger';
// import { CreateStockCheckDetailDto } from './create-stockcheck-detail.dto';
import { StockcheckItemDto } from './stockcheck-item.dto';
export class UpdateStockcheckDetailDto extends PartialType(StockcheckItemDto) {}
