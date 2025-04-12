import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsageRecordService } from './usage-record.service';
import { CreateUsageRecordDto } from './dto/create-usage-record.dto';
import { UpdateUsageRecordDto } from './dto/update-usage-record.dto';

@Controller('usage-record')
export class UsageRecordController {
  constructor(private readonly usageRecordService: UsageRecordService) {}

  @Post()
  create(@Body() createUsageRecordDto: CreateUsageRecordDto) {
    return this.usageRecordService.create(createUsageRecordDto);
  }

  @Get()
  findAll() {
    return this.usageRecordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usageRecordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsageRecordDto: UpdateUsageRecordDto) {
    return this.usageRecordService.update(+id, updateUsageRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usageRecordService.remove(+id);
  }
}
