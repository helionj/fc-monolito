import ProductGateway from "../../gateway/product.gateway";
import { CheckStockInputDto, CheckStockOutputDto } from "./check-stock.dto";

export default class CheckStockUseCase {

  private repository: ProductGateway

  constructor(repository: ProductGateway){
    this.repository = repository;
  }

  async execute(input: CheckStockInputDto): Promise<CheckStockOutputDto> {
   
    const productDb = await this.repository.find(input.id)
    return {
      productId: productDb.id.id,
      stock: productDb.stock,
    };
  }
}