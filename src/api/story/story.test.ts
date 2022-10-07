import request from "supertest";
import app from "../../app";

describe("GET /api/v1/story/random-image", () => {
  const url = "/api/v1/story/random-image";
  it("should return an image url", async () => {
    const response = await request(app).get(url).expect(200);
    expect(response.body).toHaveProperty("randomImageUrl");
    expect(typeof response.body.randomImageUrl === "string").toBe(true);
  });
});
