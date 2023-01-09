import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductModel from "./product.model";
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

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  it("should create a product", async () => {
    
    const props = {
      id: new Id("1"),
      name: "Product 1",
      description: "Description Product 1",
      purchasePrice: 100.0,
      stock: 10,

    }
    const product = new Product(props);

    const productRepository = new ProductRepository();
    productRepository.add(product);

    const productDb = await ProductModel.findOne(
      { where : { id: props.id.id }, }
    );
   

    expect(props.id.id).toEqual(productDb.id);
    expect(props.name).toEqual(productDb.name);
    expect(props.description).toEqual(productDb.description);
    expect(props.purchasePrice).toEqual(productDb.purchasePrice);
    expect(props.stock).toEqual(productDb.stock);
    expect(productDb.createdAt).toBeDefined();

  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
   
    ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description Product 1",
      purchasePrice: 100.0,
      stock: 10,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })

   

    const productDb = await productRepository.find("1");

    expect(productDb.id.id).toEqual("1");
    expect(productDb.name).toEqual("Product 1");
    expect(productDb.description).toEqual("Description Product 1");
    expect(productDb.purchasePrice).toEqual(100);
    expect(productDb.stock).toEqual(10);
    expect(productDb.createdAt).toBeDefined();
  })
})