import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { getHashedPassword } from "./api/auth/auth.helpers";
import type { User } from "./api/user/user.model";

const { MONGO_URI = "mongodb://127.0.0.1:27017/stm-test-api" } = process.env;

export const client = new MongoClient(MONGO_URI);
export const db = client.db();

export async function seedDb() {
  if (process.env.NODE_ENV === "test") {
    const testSeed = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "data", "database-seed.json"),
        "utf-8",
      ),
    );
    await db.dropDatabase();
    const transormedUsers = await Promise.all(
      testSeed.users.map(async (user: User) => {
        const password = await getHashedPassword(user.account.password);
        user.account.password = password;
        return user;
      }),
    );
    await db.collection("users").insertMany(transormedUsers);
  }
}
