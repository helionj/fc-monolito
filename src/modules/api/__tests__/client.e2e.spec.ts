import { app, sequelize } from "../express";
import request from "supertest"
describe("Client API e2e tests", () => {
  
  beforeEach(async () => {

    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {

    const response = await request(app)
      .post("/clients")
      .send({
        id: "c1",
        name: "Client one",
        document: "doc123",
        email: "client1@email.com",
        street: "Main Street",
        number: "10",
        complement: "C",
        city: "New City",
        zipCode: "55000055",
        state: "ST",
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Client created");
    
    
  });

  
});