import { PartialType } from '@nestjs/swagger';
import { CreateOrderRecordDto } from './create-order-record.dto';

export class UpdateOrderRecordDto extends PartialType(CreateOrderRecordDto) {}
