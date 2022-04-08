import { Test, TestingModule } from '@nestjs/testing';
import { DbFileController } from './db-file.controller';

describe('DbFileController', () => {
  let controller: DbFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DbFileController],
    }).compile();

    controller = module.get<DbFileController>(DbFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
