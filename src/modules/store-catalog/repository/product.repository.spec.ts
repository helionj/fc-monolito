import { Sequelize } from "sequelize-typescript";
import StoreProductModel from "./store-product.model";
import ProductRepository from "./product.repository";

describe("Product Repository unit tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
    });

    await sequelize.addModels([StoreProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should return all products", async () => {
    

    StoreProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description Product 1",
      salesPrice: 100.0,
    });

    StoreProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Description Product 2",
      salesPrice: 200.0,
    });
    
    const productRepository = new ProductRepository();
    const productsDb = await productRepository.findAll()

    expect(productsDb[0].id.id).toEqual("1");
    expect(productsDb[0].name).toEqual("Product 1");
    expect(productsDb[0].description).toEqual("Description Product 1");
    expect(productsDb[0].salesPrice).toEqual(100);
    expect(productsDb[1].id.id).toEqual("2");
    expect(productsDb[1].name).toEqual("Product 2");
    expect(productsDb[1].description).toEqual("Description Product 2");
    expect(productsDb[1].salesPrice).toEqual(200);
   

  });
  
  it("should find a product", async () => {
    const productRepository = new ProductRepository();
   
    StoreProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description Product 1",
      salesPrice: 100.0
    });

   

    const productDb = await productRepository.find("1");

    expect(productDb.id.id).toEqual("1");
    expect(productDb.name).toEqual("Product 1");
    expect(productDb.description).toEqual("Description Product 1");
    expect(productDb.salesPrice).toEqual(100);
    
  });
});