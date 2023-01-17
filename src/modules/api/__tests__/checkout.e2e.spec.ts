import { app, sequelize } from "../express";
import request from "supertest"
import ProductModel from "../../product-adm/repository/product.model";
import ClientModel from "../../client-adm/repository/client.model";
import StoreProductModel from "../../store-catalog/repository/store-product.model";
import OrderModel from "../../checkout/repository/sequelize/order.model";
describe("Checkout  API e2e tests", () => {
  
  beforeEach(async () => {

    await sequelize.sync({force: true});
  });
  
  afterAll(async () => {
    await sequelize.close();
  });
  
  it("should create an order with status approved ", async () => {

    ProductModel.create({
      id: "p1",
      name: "Product 1",
      description: "Description Product 1",
      purchasePrice: 10.00,
      stock: 10,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    ProductModel.create({
      id: "p2",
      name: "Product 2",
      description: "Description Product 2",
      purchasePrice: 20.00,
      stock: 20,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    ProductModel.create({
      id: "p3",
      name: "Product 3",
      description: "Description Product 3",
      purchasePrice: 30.00,
      stock: 50,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    StoreProductModel.create({
      id: "p1",
      name: "Product 1",
      description: "Description Product 1",
      salesPrice: 20.00,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    StoreProductModel.create({
      id: "p2",
      name: "Product 2",
      description: "Description Product 2",
      salesPrice: 40.00,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    StoreProductModel.create({
      id: "p3",
      name: "Product 3",
      description: "Description Product 3",
      salesPrice: 60.00,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });


    ClientModel.create({
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
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });

    const input = {
      clientId: "c1",
      products: [
        {
          productId: "p1"
        },
        {
          productId: "p2"
        },
        {
          productId: "p3"
        },
      ]

    }
    const response = await request(app)
      .post("/checkout")
      .send(input);
    
    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined()
    expect(response.body.products[0].productId).toEqual("p1");
    expect(response.body.products[1].productId).toEqual("p2");
    expect(response.body.products[2].productId).toEqual("p3");
    expect(response.body.total).toBe(120.0);
    expect(response.body.status).toEqual("approved");

    const orderDb = await OrderModel.findOne({where: {id: response.body.id}, include: ['products']});
    
    expect(orderDb.id).toEqual(response.body.id);
    expect(orderDb.client_id).toEqual("c1")
    expect(orderDb.client_name).toEqual("Client one");
    expect(orderDb.client_email).toEqual("client1@email.com");
    expect(orderDb.client_address).toEqual("Main Street");
    expect(orderDb.status).toEqual("approved");
    expect(orderDb.products[0].id).toEqual("p1");
    expect(orderDb.products[0].name).toEqual("Product 1");
    expect(orderDb.products[0].description).toEqual("Description Product 1");
    expect(orderDb.products[0].salesPrice).toBe(20.0)
    expect(orderDb.products[1].id).toEqual("p2");
    expect(orderDb.products[1].name).toEqual("Product 2");
    expect(orderDb.products[1].description).toEqual("Description Product 2");
    expect(orderDb.products[1].salesPrice).toBe(40.0)
    expect(orderDb.products[2].id).toEqual("p3");
    expect(orderDb.products[2].name).toEqual("Product 3");
    expect(orderDb.products[2].description).toEqual("Description Product 3");
    expect(orderDb.products[2].salesPrice).toBe(60.0)
     
   
  });

  it("should find am onder by id", async () => {
    ProductModel.create({
      id: "p1",
      name: "Product 1",
      description: "Description Product 1",
      purchasePrice: 10.00,
      stock: 10,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    ProductModel.create({
      id: "p2",
      name: "Product 2",
      description: "Description Product 2",
      purchasePrice: 20.00,
      stock: 20,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    ProductModel.create({
      id: "p3",
      name: "Product 3",
      description: "Description Product 3",
      purchasePrice: 30.00,
      stock: 50,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    StoreProductModel.create({
      id: "p1",
      name: "Product 1",
      description: "Description Product 1",
      salesPrice: 20.00,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    StoreProductModel.create({
      id: "p2",
      name: "Product 2",
      description: "Description Product 2",
      salesPrice: 40.00,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    StoreProductModel.create({
      id: "p3",
      name: "Product 3",
      description: "Description Product 3",
      salesPrice: 60.00,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });


    ClientModel.create({
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
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });

    const input = {
      clientId: "c1",
      products: [
        {
          productId: "p1"
        },
        {
          productId: "p2"
        },
        {
          productId: "p3"
        },
      ]

    }
    const response = await request(app)
      .post("/checkout")
      .send(input);
    
    expect(response.status).toBe(201);

    const orderId = response.body.id;

    const responseFind = await request(app).get(`/checkout/${orderId}`);

   
    expect(responseFind.status).toBe(200);
    expect(responseFind.body.id).toEqual(response.body.id);
    expect(responseFind.body.clientId).toEqual("c1")
    expect(responseFind.body.clientName).toEqual("Client one");
    expect(responseFind.body.clientEmail).toEqual("client1@email.com");
    expect(responseFind.body.address).toEqual("Main Street");
    expect(responseFind.body.status).toEqual("approved");
    expect(responseFind.body.products[0].productId).toEqual("p1");
    expect(responseFind.body.products[1].productId).toEqual("p2");
    expect(responseFind.body.products[2].productId).toEqual("p3");
    expect(responseFind.body.total).toBe(120.0);
    

  });


  
});