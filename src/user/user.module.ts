import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/role/role.module';
import { RoleEntity } from 'src/role/entities/role.entity';
import { MailModule } from 'src/mail/mail.module';
import { NotificationModule } from 'src/notification/notification.module';
import { Role } from 'src/role/role.types';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RoleEntity]),
    RolesModule,
    forwardRef(() => MailModule),
    NotificationModule,
  ],
  providers: [
    {
      provide: UserService,
      useFactory: async (connection: Connection) => {
        let userRole = await connection.manager.findOne(RoleEntity, {
          where: { name: Role.User },
        });
        let adminRole = await connection.manager.findOne(RoleEntity, {
          where: { name: Role.Admin },
        });

        if (!userRole) {
          userRole = await connection.manager.create(RoleEntity, {
            name: Role.User,
          });

          await connection.manager.save(RoleEntity, userRole);
        }

        if (!adminRole) {
          adminRole = await connection.manager.create(RoleEntity, {
            name: Role.Admin,
          });

          await connection.manager.save(RoleEntity, adminRole);
        }
      },
      inject: [Connection],
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
