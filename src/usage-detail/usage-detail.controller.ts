import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsageDetailService } from './usage-detail.service';
import { CreateUsageDetailDto } from './dto/create-usage-detail.dto';
import { UpdateUsageDetailDto } from './dto/update-usage-detail.dto';

@Controller('usage-detail')
export class UsageDetailController {
  constructor(private readonly usageDetailService: UsageDetailService) {}

  @Post()
  create(@Body() createUsageDetailDto: CreateUsageDetailDto) {
    return this.usageDetailService.create(createUsageDetailDto);
  }

  @Get()
  findAll() {
    return this.usageDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usageDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsageDetailDto: UpdateUsageDetailDto) {
    return this.usageDetailService.update(+id, updateUsageDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usageDetailService.remove(+id);
  }
}
