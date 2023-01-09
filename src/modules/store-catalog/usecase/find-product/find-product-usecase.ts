import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { ProductGateway } from "../../gateway/product.gateway";
import { FindProductInputDto, FindProductOutputDto } from "./find-product.dto";

export default class FindProductUseCase implements UseCaseInterface{

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
      salesPrice: productDb.salesPrice,
    }
  }
}