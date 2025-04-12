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
import { UsageDetailService } from './usage-detail.service';
import { CreateUsageDetailDto } from './dto/create-usage-detail.dto';
import { UpdateUsageDetailDto } from './dto/update-usage-detail.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsageDetail } from './entities/usage-detail.entity';

@ApiTags('usage-detail')
@Controller('usage-detail')
export class UsageDetailController {
  constructor(private readonly usageDetailService: UsageDetailService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new usage detail' })
  @ApiCreatedResponse({
    description: 'The usage detail has been successfully created.',
    type: UsageDetail,
  })
  create(@Body() createUsageDetailDto: CreateUsageDetailDto) {
    return this.usageDetailService.create(createUsageDetailDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all usage details' })
  @ApiOkResponse({
    description: 'List of all usage details',
    type: [UsageDetail],
  })
  findAll() {
    return this.usageDetailService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a usage detail by ID' })
  @ApiOkResponse({
    description: 'The usage detail with the specified ID',
    type: UsageDetail,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usage detail not found',
  })
  findOne(@Param('id') id: string) {
    return this.usageDetailService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a usage detail' })
  @ApiOkResponse({
    description: 'The usage detail has been successfully updated.',
    type: UsageDetail,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usage detail not found',
  })
  update(
    @Param('id') id: string,
    @Body() updateUsageDetailDto: UpdateUsageDetailDto,
  ) {
    return this.usageDetailService.update(+id, updateUsageDetailDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a usage detail' })
  @ApiOkResponse({
    description: 'The usage detail has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usage detail not found',
  })
  remove(@Param('id') id: string) {
    return this.usageDetailService.remove(+id);
  }
}
