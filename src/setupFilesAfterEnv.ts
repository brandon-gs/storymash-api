import { client } from "./db";

// Close db connection after all jest tests
global.afterAll(async () => {
  await client.close();
});
