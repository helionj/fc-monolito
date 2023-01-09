import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { ProductGateway } from "../../gateway/product.gateway";
import { FindAllProductsDto } from "./find-all-products.dto";

export default class FindAllProductsUseCase implements UseCaseInterface {

  private _productRepository: ProductGateway;

  constructor(productRepository: ProductGateway){
    this._productRepository = productRepository;
  }

  async execute(): Promise<FindAllProductsDto> {
    const results = await this._productRepository.findAll();
    
    return {
      products: results.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
        
      }))
    };
   }
}