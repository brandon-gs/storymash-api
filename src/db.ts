import fs from "fs";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import { getHashedPassword } from "./api/auth/auth.helpers";
import type { User, UserWithId } from "./api/user/user.model";
import { StoryWithId } from "./api/story/story.model";

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
      testSeed.users.map(async (user: User | UserWithId) => {
        const password = await getHashedPassword(user.account.password);
        if ("_id" in user) {
          user._id = new ObjectId(user._id);
        }
        user.account.password = password;
        return user;
      }),
    );
    const transformedStories = await Promise.all(
      testSeed.stories.map(async (story: StoryWithId) => {
        const authorId = new ObjectId(story.authorId);
        const createdAt = new Date(story.createdAt);
        const chapters = story.chapters.map((chapter) => {
          return { ...chapter, createdAt: new Date(chapter.createdAt) };
        });
        return { ...story, authorId, chapters, createdAt };
      }),
    );
    await Promise.all([
      db.collection("users").insertMany(transormedUsers),
      db.collection("stories").insertMany(transformedStories),
    ]);
  }
}
