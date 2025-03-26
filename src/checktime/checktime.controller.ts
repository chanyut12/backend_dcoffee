import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CheckTimesService } from './checktime.service';
import { CreateCheckTimeDto } from './dto/create-checktime.dto';
import { UpdateCheckTimeDto } from './dto/update-checktime.dto';

@Controller('checktimes')
export class CheckTimesController {
  constructor(private readonly checktimesService: CheckTimesService) {}

  @Post()
  create(@Body() createCheckTimeDto: CreateCheckTimeDto) {
    return this.checktimesService.create(createCheckTimeDto);
  }

  @Get()
  findAll() {
    return this.checktimesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checktimesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheckTimeDto: UpdateCheckTimeDto,
  ) {
    return this.checktimesService.update(+id, updateCheckTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checktimesService.remove(+id);
  }
}
