import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";
import ProductAdmFacade from "./product-adm.facade";

describe("ProductAdmFacade tests", () => {
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

  it("should create a product", async () => {

    const productRepository = new ProductRepository();
    const addProductUseCase = new AddProductUseCase(productRepository);
    const productFacade = new ProductAdmFacade({
      addUseCase: addProductUseCase,
      checkStockUseCase: undefined
    });

    const input = {
      id: "1",
      name: "Product 1",
      description: "Description Product 1",
      purchasePrice: 100.00,
      stock: 10,
    }
    await productFacade.addProduct(input);

    const product = await ProductModel.findOne({ where: { id: "1" }});

    expect(product).toBeDefined();
    expect(product.id).toBe(input.id);
    expect(product.name).toBe(input.name);
    expect(product.description).toBe(input.description);
    expect(product.purchasePrice).toBe(input.purchasePrice);
    expect(product.stock).toBe(input.stock);
  })

  it("should return the stock of a product", async () => {
    const productRepository = new ProductRepository();
    const checkStockUseCase = new CheckStockUseCase(productRepository);
    const productFacade = new ProductAdmFacade({
      addUseCase: undefined,
      checkStockUseCase: checkStockUseCase
    });

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description Product 1",
      purchasePrice: 100.0,
      stock: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const input = {
      productId: "1"
    }

    const result = await productFacade.checkStock(input);

    expect(result.productId).toBe("1");
    expect(result.stock).toBe(10);

  });
})