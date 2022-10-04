import { client } from "./db";

// drop db before all tests
global.beforeAll(async () => {
  try {
    await client.db().dropDatabase();
  } catch (e) {}
});

// Close db connection after all jest tests
global.afterAll(async () => {
  await client.close();
});
