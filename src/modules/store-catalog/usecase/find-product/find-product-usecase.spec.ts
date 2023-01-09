import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product-usecase";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Description Product 1",
  salesPrice: 100.0,
  
});

const MockProductRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn()
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
      salesPrice: product.salesPrice,

    };
    const result = await usecase.execute(input);
    expect(productRepository.find).toHaveBeenCalled();
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