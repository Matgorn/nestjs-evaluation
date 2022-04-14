import { Connection } from 'typeorm';
import { Seeder } from 'typeorm-seeding';

import { RoleEntity } from '../../role/entities/role.entity';
import { Role } from 'src/role/role.types';

export default class CreateRoles implements Seeder {
  async run(_, connection: Connection): Promise<void> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(RoleEntity)
      .values([{ name: Role.User }, { name: Role.Admin }])
      .execute();
  }
}
