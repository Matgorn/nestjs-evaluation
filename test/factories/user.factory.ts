import { Role } from '@app/role/role.types';
import { User } from '@app/user/entities/user.entity';
import faker from '@faker-js/faker';
import { Factory } from 'rosie';

import { create } from '../helpers/create';
import { createRole } from './role.factory';

import * as bcrypt from 'bcrypt';

Factory.define<User>(User.name).attrs({
  email: () => faker.internet.email(),
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  isEmailConfirmed: true,
  salt: bcrypt.genSaltSync(10),
  hash: bcrypt.hashSync('password', bcrypt.genSaltSync(10)),
});

export async function createAdmin(attributes?: Partial<User>) {
  const adminRole = await createRole({ name: Role.Admin });

  return await create(User, {
    ...attributes,
    roles: [adminRole],
  });
}

export async function createUser(attributes?: Partial<User>) {
  const userRole = await createRole({ name: Role.User });

  return await create(User, {
    ...attributes,
    roles: [userRole],
  });
}
