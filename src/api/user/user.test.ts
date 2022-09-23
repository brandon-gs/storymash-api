import { Users } from "../user/user.model";

import request from "supertest";
import app from "../../app";

beforeAll(async () => {
  try {
    await Users.drop();
  } catch (error) {}
});

describe("user", () => {
  it("responds with a json message", (done) => {
    request(app)
      .get("/api/v1/user/account")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/, done);
  });
});
