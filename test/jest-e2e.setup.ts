import { Connection } from 'typeorm';

import { getApplication } from './helpers/getApplication';

beforeEach(async () => {
  const app = await getApplication();
  const connection = app.get(Connection);

  await connection.undoLastMigration({ transaction: 'all' });

  await connection.runMigrations();
});

afterAll(async () => {
  const app = await getApplication();
  await app.close();
});
