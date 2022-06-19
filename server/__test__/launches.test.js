const request = require("supertest");
const app = require("../src/app");
const { mongoConnect, mongoDisconnect } = require("../src/services/mongo");
const { loadPlanetsData } = require("../src/models/planets.model");

describe("Launches API's", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(() => mongoDisconnect());

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app).get("/v1/launches").expect(200);
      // expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = { mission: "USS Enterprise", rocket: "NCC 1701-D", target: "Kepler-62 f" };

    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "empty",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app).post("/v1/launches").send(completeLaunchData).expect("Content-Type", /json/).expect(201);

      // check if date object matches
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test("It should catch missing required properties", async () => {
      const response = await request(app).post("/v1/launches").send(launchDataWithoutDate).expect("Content-Type", /json/).expect(400);

      expect(response.body).toStrictEqual({ error: "Missing launch property" });
    });
    test("It should catch invalid dates", async () => {
      const response = await request(app).post("/v1/launches").send(launchDataWithInvalidDate).expect("Content-Type", /json/).expect(400);
      expect(response.body).toStrictEqual({ error: "Invalid launch date" });
    });
  });
});
