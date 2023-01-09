import ProductGateway from "../../gateway/product.gateway";
import ProductModel from "../../repository/product.model";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";

export default class FindProductUseCase {

  private repository: ProductGateway

  constructor(repository: ProductGateway){
    this.repository = repository;
  }

  async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {

    const productDb = await this.repository.find(input.id)
    return {
      id: productDb.id.id,
      name: productDb.name,
      description: productDb.description,
      purchasePrice: productDb.purchasePrice,
      stock: productDb.stock,
      createdAt: productDb.createdAt,
      updatedAt: productDb.updatedAt
    }
  }
}