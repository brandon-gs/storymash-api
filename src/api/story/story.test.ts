import request from "supertest";
import app from "../../app";

const agent = request.agent(app);

const newUser = {
  username: "story_test",
  email: "story@test.com",
  password: "storyPassword",
};

const newStory = {
  title: "testing story",
  categories: ["love", "horror"],
  content: "testing content story",
};

beforeAll(async () => {
  try {
    await agent.post("/api/v1/auth/register").send(newUser);
    await agent.post("/api/v1/auth/login").send(newUser);
    await new Promise((resolve) => setTimeout(() => resolve(null), 2000));
  } catch (error) {}
}, 15000);

describe("GET /api/v1/story/random-image", () => {
  const url = "/api/v1/story/random-image";
  it("should return an image url", async () => {
    const response = await request(app).get(url).expect(200);
    expect(response.body).toHaveProperty("randomImageUrl");
    expect(typeof response.body.randomImageUrl === "string").toBe(true);
  });
});

describe("POST /api/v1/story", () => {
  const url = "/api/v1/story";
  it("should create an story", async () => {
    const response = await agent.post(url).send(newStory).expect(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("storyId");
  });
  it("should return error cause invalid request", async () => {
    const response = await agent
      .post(url)
      .send({ title: "testing" })
      .expect(400);
    expect(response.body).toHaveProperty("validationErrors");
  });
  it("should require authentication", (done) => {
    request(app).post(url).send(newStory).expect(401, done);
  });
});
