import { Test, TestingModule } from '@nestjs/testing';
import { CheckTimesService } from './checktime.service';

describe('CheckTimeService', () => {
  let service: CheckTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckTimesService],
    }).compile();

    service = module.get<CheckTimesService>(CheckTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
