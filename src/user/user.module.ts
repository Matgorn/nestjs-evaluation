import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/role/role.module';
import { RoleEntity } from 'src/role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RoleEntity]), RolesModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
