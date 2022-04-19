import { RoleEntity } from '@app/role/entities/role.entity';
import { Factory } from 'rosie';

import { create } from '../helpers/create';

Factory.define<RoleEntity>(RoleEntity.name).attrs({});

export async function createRole(attributes?: Partial<RoleEntity>) {
  return await create(RoleEntity, attributes);
}
