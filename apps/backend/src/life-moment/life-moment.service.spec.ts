import { Test, TestingModule } from '@nestjs/testing';
import { LifeMomentService } from './life-moment.service';

describe('LifeMomentService', () => {
  let service: LifeMomentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifeMomentService],
    }).compile();

    service = module.get<LifeMomentService>(LifeMomentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
