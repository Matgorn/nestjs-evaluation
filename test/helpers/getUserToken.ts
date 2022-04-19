import { createAdmin, createUser } from '../factories/user.factory';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export async function getUserToken(
  app: INestApplication,
  options?: { isAdmin: boolean },
) {
  const user = options?.isAdmin ? await createAdmin() : await createUser();

  const { body } = await request(app.getHttpServer()).post('/auth/login').send({
    email: user.email,
    password: 'password',
  });

  return { token: body?.access_token, userId: user.id };
}
