import { app, sequelize } from "../express";
import request from "supertest"
describe("Invoice API e2e tests", () => {
  
  beforeEach(async () => {

    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    await sequelize.close();
  });
  
  const input = {
    id:"i1",
    name: "Client 1",
    document: "doc123",
    street: "Main Street",
    number: "10",
    complement: "c",
    city: "New City",
    state: "ST",
    zipCode: "55000555",
    items: [
      {
        id: "p1",
        name: "Product 1",
        price: 10.0
      },
      {
        id: "p2",
        name: "Product 2",
        price: 20.0
      }
    ]
  };

  it("should create a invoice", async () => {

    const response = await request(app)
      .post("/invoices")
      .send(input);
    expect(response.status).toBe(201);
    expect(response.body.id).toEqual(input.id);
    expect(response.body.name).toEqual(input.name);
    expect(response.body.document).toEqual(input.document);
    expect(response.body.street).toEqual(input.street);
    expect(response.body.number).toEqual(input.number);
    expect(response.body.complement).toEqual(input.complement);
    expect(response.body.city).toEqual(input.city);
    expect(response.body.zipCode).toEqual(input.zipCode);
    expect(response.body.state).toEqual(input.state);
    expect(response.body.items[0].id).toEqual(input.items[0].id);
    expect(response.body.items[0].name).toEqual(input.items[0].name);
    expect(response.body.items[0].price).toBe(input.items[0].price);
    expect(response.body.items[1].id).toEqual(input.items[1].id);
    expect(response.body.items[1].name).toEqual(input.items[1].name);
    expect(response.body.items[1].price).toBe(input.items[1].price);
    expect(response.body.total).toBe(30.0);
    
  });

  it("should find an invoice by invoiceId", async () => {

    const response = await request(app)
      .post("/invoices")
      .send(input);
    
    expect(response.status).toBe(201);

    const responseFind = await request(app).get("/invoices/i1");
    expect(responseFind.status).toBe(200);
    expect(responseFind.body.id).toEqual(input.id);
    expect(responseFind.body.name).toEqual(input.name);
    expect(responseFind.body.document).toEqual(input.document);
    expect(responseFind.body.address.street).toEqual(input.street);
    expect(responseFind.body.address.number).toEqual(input.number);
    expect(responseFind.body.address.complement).toEqual(input.complement);
    expect(responseFind.body.address.city).toEqual(input.city);
    expect(responseFind.body.address.zipCode).toEqual(input.zipCode);
    expect(responseFind.body.address.state).toEqual(input.state);
    expect(responseFind.body.items[0].id).toEqual(input.items[0].id);
    expect(responseFind.body.items[0].name).toEqual(input.items[0].name);
    expect(responseFind.body.items[0].price).toBe(input.items[0].price);
    expect(responseFind.body.items[1].id).toEqual(input.items[1].id);
    expect(responseFind.body.items[1].name).toEqual(input.items[1].name);
    expect(responseFind.body.items[1].price).toBe(input.items[1].price);
    expect(responseFind.body.total).toBe(30.0);


  });

  

  
});