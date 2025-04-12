import { PartialType } from '@nestjs/swagger';
import { CreateUsageDetailDto } from './create-usage-detail.dto';

export class UpdateUsageDetailDto extends PartialType(CreateUsageDetailDto) {}
