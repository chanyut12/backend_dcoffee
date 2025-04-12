import { Test, TestingModule } from '@nestjs/testing';
import { UsageRecordController } from './usage-record.controller';
import { UsageRecordService } from './usage-record.service';

describe('UsageRecordController', () => {
  let controller: UsageRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsageRecordController],
      providers: [UsageRecordService],
    }).compile();

    controller = module.get<UsageRecordController>(UsageRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
