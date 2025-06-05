import request from "supertest";
import app from "../src/app.js";

describe("Block API", () => {
  it("POST /api/blocks ska skapa ett nytt block", async () => {
    const data = { data: { from: "Alice", to: "Bob", amount: 50 } };
    const res = await request(app).post("/api/blocks").send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body.block).toHaveProperty("hash");
    expect(res.body.block.data).toEqual(data.data);
  });

  it("GET /api/blocks ska returnera en lista av block", async () => {
    const res = await request(app).get("/api/blocks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.chain)).toBe(true);
  });

  it("GET /api/blocks/:index ger 404 om block inte finns", async () => {
    const res = await request(app).get("/api/blocks/9999");
    expect(res.statusCode).toBe(404);
  });
});
