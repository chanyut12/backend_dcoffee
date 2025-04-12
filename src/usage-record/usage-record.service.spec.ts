import { Test, TestingModule } from '@nestjs/testing';
import { UsageRecordService } from './usage-record.service';

describe('UsageRecordService', () => {
  let service: UsageRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsageRecordService],
    }).compile();

    service = module.get<UsageRecordService>(UsageRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
