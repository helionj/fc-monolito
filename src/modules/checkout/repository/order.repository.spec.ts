import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client-entity";
import Order from "../domain/order-entity";
import Product from "../domain/product-entity";
import OrderRepository from "./order.repository";
import OrderProductModel from "./sequelize/order-product.model";
import OrderModel from "./sequelize/order.model";

describe("OrderRepository", () => {
  let sequelize: Sequelize;

  const client = new Client({
    id: new Id("c1"),
    name: "Client 1",
    email: "client1@email.com",
    address:"Main Street, 51"
  });

  const product1 = new Product({
    id: new Id("p1"),
    name: "Product 1",
    description: "Description Product 1",
    salesPrice: 10.0
  });

  const product2 = new Product({
    id: new Id("p2"),
    name: "Product 2",
    description: "Description Product 2",
    salesPrice: 20.0
  });

  const order = new Order({
    id: new Id("o1"),
    client: client,
    products:[product1, product2],
    status: "pending"
  });

  beforeEach(async () => {
    sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
    });

    await sequelize.addModels([OrderModel, OrderProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("Should create an order", async () => {


    const orderRepository = new OrderRepository();

    await orderRepository.addOrder(order);

    const result = await OrderModel.findOne(
      { where: { id: order.id.id}, include: ["products"]});

    expect(result.id).toEqual(order.id.id);
    expect(result.products.length).toEqual(2);
    expect(result.products[0].id).toEqual(product1.id.id)
    expect(result.products[0].name).toEqual(product1.name);
    expect(result.products[1].id).toEqual(product2.id.id)
    expect(result.products[1].name).toEqual(product2.name);
    expect(result.client_id).toEqual(client.id.id);
    expect(result.client_name).toEqual(client.name);
    expect(result.status).toEqual("pending");

  });

  it("should find an order", async () => {

    await OrderModel.create({
      id: order.id.id,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        products: order.products.map((product) => ({
          id: product.id.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        })),
  
        client_id: order.client.id.id,
        client_name: order.client.name,
        client_email: order.client.email,
        client_address: order.client.address
      
      },{
        include: [{model: OrderProductModel}]
      });

      const orderRepository = new OrderRepository();

      const result = await orderRepository.findOrder(order.id.id);

      expect(result.id).toEqual(order.id);
      expect(result.products.length).toEqual(2);
      expect(result.products[0].id).toEqual(product1.id)
      expect(result.products[0].name).toEqual(product1.name);
      expect(result.products[1].id).toEqual(product2.id)
      expect(result.products[1].name).toEqual(product2.name);
      expect(result.client.id.id).toEqual(client.id.id);
      expect(result.client.name).toEqual(client.name);
      expect(result.status).toEqual("pending");

  });
  
});