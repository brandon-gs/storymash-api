import request from "supertest";

import app from "../../app";
import { Users } from "../user/user.model";

beforeAll(async () => {
  try {
    await Users.drop();
  } catch (error) {}
});

describe("POST /api/v1/auth/register", () => {
  it("register a new user", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send({
        username: "test",
        email: "test@test.com",
        password: "testPassword",
      })
      .expect("Content-Type", /json/)
      .expect(201, done);
  });
  it("expect error when username already exists in db", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send({
        username: "test",
        email: "test@test.com",
        password: "testPassword",
      })
      .expect("Content-Type", /json/)
      .expect(
        400,
        {
          message: "El nombre de usuario ya existe",
          field: "username",
        },
        done,
      );
  });
  it("expect error when email already exists in db", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send({
        username: "test2",
        email: "test@test.com",
        password: "testPassword",
      })
      .expect("Content-Type", /json/)
      .expect(
        400,
        {
          message: "El correo electrónico ya fue registrado",
          field: "email",
        },
        done,
      );
  });

  it("expect error sending wrong information", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send({
        user: "test2",
        test: "testPassword",
      })
      .expect("Content-Type", /json/)
      .expect(400, done);
  });
});
