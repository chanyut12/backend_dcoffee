import { Test, TestingModule } from '@nestjs/testing';
import { UsageDetailService } from './usage-detail.service';

describe('UsageDetailService', () => {
  let service: UsageDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsageDetailService],
    }).compile();

    service = module.get<UsageDetailService>(UsageDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
