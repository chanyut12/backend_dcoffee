import { PartialType } from '@nestjs/swagger';
import { CreateCheckTimeDto } from './create-checktime.dto';

export class UpdateCheckTimeDto extends PartialType(CreateCheckTimeDto) {}
