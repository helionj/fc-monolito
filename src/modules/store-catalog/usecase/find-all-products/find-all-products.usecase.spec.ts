import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import FindAllProductsUseCase from "./find-all-products.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Description Product 1",
  salesPrice: 200.0
});

const product2 = new Product({
  id: new Id("2"),
  name: "Product 2",
  description: "Description Product 2",
  salesPrice: 90.0
});

const MockRepository = () => {
  return {
    findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
    find: jest.fn(),
  }
}
describe("FindAllProductsUseCase unit tests", () => {
 
  it("should return a list of products", async () => {

    const productRepository = MockRepository();
    const findAllProductsUseCase = new FindAllProductsUseCase(productRepository);

    const products = await findAllProductsUseCase.execute();
    
    expect(productRepository.findAll).toHaveBeenCalled();
    expect(products.products.length).toBe(2);
    expect(products.products[0].id).toBe("1");
    expect(products.products[0].name).toBe("Product 1");
    expect(products.products[0].salesPrice).toBe(200.0);
    expect(products.products[1].id).toBe("2");
    expect(products.products[1].name).toBe("Product 2");
    expect(products.products[1].salesPrice).toBe(90.0)
  });

});