import request from "supertest";
import { app, server } from "./app";

afterAll((done) => {
  server.close(done);
});

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("signature");
    expect(response.body).toHaveProperty("version");
  });
});

describe("Test the public-key path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/public-key");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("publicKey");
  });
});

describe("Test the POST method", () => {
  test("It should response the POST method", async () => {
    const response = await request(app).post("/").send({ data: "Test data" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("signature");
    expect(response.body).toHaveProperty("version");
  });
});

describe("Test the recover path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get("/recover/0");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("signature");
    expect(response.body).toHaveProperty("version");
  });

  test("It should response with 404 for non-existing version", async () => {
    const response = await request(app).get("/recover/100");
    expect(response.statusCode).toBe(404);
  });
});
