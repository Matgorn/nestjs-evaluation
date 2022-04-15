import { AppModule } from '@app/app.module';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { RoleEntity } from '@app/role/entities/role.entity';
import { Role } from '@app/role/role.types';
import { User } from '@app/user/entities/user.entity';
import { ExecutionContext, ValidationPipe } from '@nestjs/common';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';

export class MockAuthGuard {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = new User();
    const role = new RoleEntity();
    role.name = Role.Admin;
    user.roles = [role];
    req.user = user;
    return req;
  }
}

export async function createTestingModule() {
  const testingModule = Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useClass(MockAuthGuard);

  const compiledModule = await testingModule.compile();

  const app = compiledModule.createNestApplication<NestExpressApplication>(
    new ExpressAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.init();

  return app;
}
