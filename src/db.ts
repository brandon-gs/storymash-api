import { MongoClient } from "mongodb";

const { MONGO_URI = "mongodb://127.0.0.1:27017/stm-test-api" } = process.env;

export const client = new MongoClient(MONGO_URI);
export const db = client.db();
