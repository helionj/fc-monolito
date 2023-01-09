import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogOutputDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findProductUseCase: UseCaseInterface
  findAllProductsUseCase: UseCaseInterface
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  
  private _findProductUseCase: UseCaseInterface;
  private _findAllProductsUseCase: UseCaseInterface;

  constructor(useCasePros: UseCaseProps){
    this._findProductUseCase = useCasePros.findProductUseCase;
    this._findAllProductsUseCase = useCasePros.findAllProductsUseCase;
  }

  async find(id: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findProductUseCase.execute(id);
  }

  async findAll(): Promise<FindAllStoreCatalogOutputDto> {
    return await this._findAllProductsUseCase.execute({});
  }

}