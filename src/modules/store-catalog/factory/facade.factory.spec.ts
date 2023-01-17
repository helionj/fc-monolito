import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/store-product.model";
import StoreCatalogFacadeFactory from "./facade.factory";

describe("StoreCatalogFacadeFactory  tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should return all products", async () => {

    const storeCatalogFacade = StoreCatalogFacadeFactory.create()

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description Product 1",
      salesPrice: 100.0,
    });

    await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Description Product 2",
      salesPrice: 200.0,
    });

    
    const products = await storeCatalogFacade.findAll();

    expect(products.products.length).toBe(2);
    expect(products.products[0].name).toBe("Product 1");
    expect(products.products[0].id).toBe("1");
    expect(products.products[0].description).toBe("Description Product 1");
    expect(products.products[0].salesPrice).toBe(100.0);
    expect(products.products[1].name).toBe("Product 2");
    expect(products.products[1].id).toBe("2");
    expect(products.products[1].description).toBe("Description Product 2");
    expect(products.products[1].salesPrice).toBe(200.0);
  })

  it("should find a product", async () => {
    
    const storeCatalogFacade = StoreCatalogFacadeFactory.create()

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description Product 1",
      salesPrice: 100.0,
    
    });

    const input = {
      id: "1"
    }

    const product = await storeCatalogFacade.find(input);

    expect(product.id).toBe("1");
    expect(product.name).toBe("Product 1");
    expect(product.description).toBe("Description Product 1");
    expect(product.salesPrice).toBe(100);

  });

});

