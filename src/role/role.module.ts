import { DynamicModule, Module } from '@nestjs/common';
import { RolesService } from './role.service';
import { RolesController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';

export interface IRoleOptions {
  someValue: string;
}

@Module({})
export class RolesModule {
  static register(options: IRoleOptions): DynamicModule {
    return {
      module: RolesModule,
      imports: [TypeOrmModule.forFeature([RoleEntity])],
      providers: [
        RolesService,
        {
          provide: 'ROLE_OPTIONS',
          useValue: options,
        },
      ],
      controllers: [RolesController],
      exports: [RolesService],
    };
  }
}
