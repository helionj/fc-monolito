import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";
import FindProductUseCase from "./find-product.usecase";

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
    const usecase = new FindProductUseCase(productRepository)
   

    const input: FindProductInputDto = {
      id: product.id.id,

    };
    
    const output: FindProductOutputDto = {
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt

    };
    const result = await usecase.execute(input);
    expect(result).toEqual(output);
  });

  it("should throw an exception when product not found", async () => {
    const productRepository = MockProductRepository()
    productRepository.find.mockImplementation(()=> {
      throw new Error("Product not found")
    });
    
    const usecase = new FindProductUseCase(productRepository)
    
    const input: FindProductInputDto = {
      id: "1",
    };
    
    await expect(() => {
      return usecase.execute(input);
    }).rejects.toThrow("Product not found");
  });
  
});