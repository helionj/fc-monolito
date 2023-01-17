import { app, sequelize } from "../express";
import request from "supertest"
import ProductModel from "../../product-adm/repository/product.model";
describe("Product API e2e tests", () => {
  
  beforeEach(async () => {

    await sequelize.sync({force: true});
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {

    const response = await request(app)
      .post("/products")
      .send({
        id: "p1",
        name: "Product 1",
        description: "Description Product 1",
        purchasePrice: 19.99,
        stock: 10
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Product created");

    const result = await ProductModel.findOne({ where: {id: "p1"}});

    expect(result.id).toEqual("p1");
    expect(result.name).toEqual("Product 1");
    expect(result.description).toEqual("Description Product 1");
    expect(result.purchasePrice).toBe(19.99);
    expect(result.stock).toBe(10);
    
    
  });

  it("should return a product stock by product id", async () => {

    const response = await request(app)
      .post("/products")
      .send({
        id: "p1",
        name: "Product 1",
        description: "Description Product 1",
        purchasePrice: 19.99,
        stock: 20
      });
    expect(response.status).toBe(201);

    const res = await request(app).get("/products/stock/p1");
    
    expect(res.status).toEqual(200);
    expect(res.body.productId).toEqual("p1");
    expect(res.body.stock).toBe(20);
      
  });

  
});