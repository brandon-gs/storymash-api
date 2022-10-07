import request from "supertest";
import app from "../../app";
import { getImageUrlByGender } from "./user.helpers";

const agent = request.agent(app);

const newUser = {
  username: "user_test",
  email: "user@test.com",
  password: "userPassword",
};

const onboardingInfo = {
  firstname: "user firstname",
  lastname: "user lastname",
  birthdate: new Date("2000/12/20").toUTCString(),
};

beforeAll(async () => {
  try {
    await agent.post("/api/v1/auth/register").send(newUser);
    await agent.post("/api/v1/auth/login").send(newUser);
    await new Promise((resolve) => setTimeout(() => resolve(null), 2000));
  } catch (error) {}
}, 10000);

describe("GET /user/", () => {
  const testUrl = "/api/v1/user/";
  it("should response with correct user information", async () => {
    const response = await agent
      .get(testUrl)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("account");
    expect(response.body).toHaveProperty("profile");
  });
  it("should require authentication", (done) => {
    request(app).get(testUrl).expect(401, done);
  });
});

describe("GET /user/account", () => {
  const testUrl = "/api/v1/user/account";
  it("should response with correct user account information", async () => {
    const response = await agent
      .get(testUrl)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toHaveProperty("account", {
      username: newUser.username,
      email: newUser.email,
      onboardingComplete: false,
    });
  });
  it("should require authentication", (done) => {
    request(app).get(testUrl).expect(401, done);
  });
});

describe("POST /user/onboarding/info", () => {
  const testUrl = "/api/v1/user/onboarding/info";

  it("update user personal information", async () => {
    const response = await agent
      .put(testUrl)
      .send(onboardingInfo)
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toHaveProperty("message", "Información actualizada");
  });
  it("should require authentication", (done) => {
    request(app).put(testUrl).expect(401, done);
  });
});

describe("POST /user/onboarding/gender", () => {
  const testUrl = "/api/v1/user/onboarding/gender";

  it("should update user gender and image url", async () => {
    const GENDER_TO_UPDATE = "male";

    const response = await agent
      .put(testUrl)
      .send({ gender: GENDER_TO_UPDATE })
      .expect("Content-Type", /json/)
      .expect(200);
    expect(response.body).toHaveProperty("message", "Información actualizada");

    const resUser = await agent.get("/api/v1/user");
    const imageUrl = getImageUrlByGender(GENDER_TO_UPDATE);
    expect(resUser.body.profile.gender).toBe(GENDER_TO_UPDATE);
    expect(resUser.body.profile.imageUrl).toBe(imageUrl);
  });
  it("should require authentication", (done) => {
    request(app).put(testUrl).expect(401, done);
  });
});
