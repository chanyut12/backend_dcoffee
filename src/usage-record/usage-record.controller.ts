import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UsageRecordService } from './usage-record.service';
import { CreateUsageRecordDto } from './dto/create-usage-record.dto';
import { UpdateUsageRecordDto } from './dto/update-usage-record.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsageRecord } from './entities/usage-record.entity';

@ApiTags('usage-record')
@Controller('usage-record')
export class UsageRecordController {
  constructor(private readonly usageRecordService: UsageRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new usage record' })
  @ApiCreatedResponse({
    description: 'The usage record has been successfully created.',
    type: UsageRecord,
  })
  create(@Body() createUsageRecordDto: CreateUsageRecordDto) {
    return this.usageRecordService.create(createUsageRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all usage records' })
  @ApiOkResponse({
    description: 'List of all usage records',
    type: [UsageRecord],
  })
  findAll() {
    return this.usageRecordService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a usage record by ID' })
  @ApiOkResponse({
    description: 'The usage record with the specified ID',
    type: UsageRecord,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usage record not found',
  })
  findOne(@Param('id') id: string) {
    return this.usageRecordService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a usage record' })
  @ApiOkResponse({
    description: 'The usage record has been successfully updated.',
    type: UsageRecord,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usage record not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateUsageRecordDto: UpdateUsageRecordDto,
  ) {
    return this.usageRecordService.update(+id, updateUsageRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a usage record' })
  @ApiOkResponse({
    description: 'The usage record has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usage record not found',
  })
  remove(@Param('id') id: string) {
    return this.usageRecordService.remove(+id);
  }
}
