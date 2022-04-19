import { AppModule } from '@app/app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

export async function createTestingModule() {
  const testingModule = Test.createTestingModule({
    imports: [AppModule, ConfigModule.forRoot({ envFilePath: ['.env.test'] })],
  });

  const compiledModule = await testingModule.compile();

  const app = compiledModule.createNestApplication<NestExpressApplication>(
    new ExpressAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.init();

  return app;
}
