import request from "supertest";

import app from "../../app";

const newAuthUser = {
  username: "test",
  email: "test@test.com",
  password: "testPassword",
};

describe("POST /api/v1/auth/register", () => {
  it("register a new user", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send(newAuthUser)
      .expect("Content-Type", /json/)
      .expect(201, done);
  });
  it("expect error when username already exists in db", (done) => {
    request(app)
      .post("/api/v1/auth/register")
      .set("Accept", "application/json")
      .send(newAuthUser)
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
        ...newAuthUser,
        username: "test2",
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

describe("POST /auth/login", () => {
  it("should only allow valid users to login", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send(newAuthUser)
      .expect(307);
    const cookies = response.headers["set-cookie"][0]
      .split(",")
      .map((item: string) => item.split(";")[0]);
    expect(cookies[0]).toContain("access_token=");
  });
  it("should only allow valid users to login", (done) => {
    request(app)
      .post("/api/v1/auth/login")
      .send({ username: "incorrectuser", password: "incorrectpassword" })
      .expect(422, done);
  });
  it("should require a username", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({})
      .expect(422);
    expect(response.body.message).toBe("Credenciales incorrectas");
  });
  it("should require a password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "testuser" })
      .expect(422);
    expect(response.body.message).toBe("Credenciales incorrectas");
  });
});
