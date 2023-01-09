import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";
import CheckStockUseCase from "./check-stock.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Description Product 1",
  purchasePrice: 100.0,
  stock: 10,
})

const MockProductRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    add: jest.fn()
  }
}

describe("FindPrdouctUseCase unit tests", () =>{
  it("should find a product", async () => {
    
    const productRepository = MockProductRepository()
    const usecase = new CheckStockUseCase(productRepository)
   

    const input: CheckStockInputDto = {
      id: product.id.id,

    };
    
    const output: CheckStockOutputDto = {
      productId: product.id.id,
      stock: product.stock,

    };
    const result = await usecase.execute(input);
    expect(result).toEqual(output);
  });

  it("should throw an exception when product not found", async () => {
    const productRepository = MockProductRepository()
    productRepository.find.mockImplementation(()=> {
      throw new Error("Product not found")
    });
    
    const usecase = new CheckStockUseCase(productRepository)
    
    const input: CheckStockInputDto = {
      id: "1",
    };
    
    await expect(() => {
      return usecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
  
});