import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ProductAdmFacadeInterface, { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto } from "./product-adm.facade.interface";

export interface UseCaseProps {
  addUseCase: UseCaseInterface
  checkStockUseCase: UseCaseInterface
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  
  private _addUseCase: UseCaseInterface;
  private _checkStockUseCase: UseCaseInterface;

  constructor(useCaseProps:UseCaseProps){
    this._addUseCase = useCaseProps.addUseCase;
    this._checkStockUseCase = useCaseProps.checkStockUseCase
  }

  addProduct(input: AddProductFacadeInputDto): Promise<void> {
   
    return this._addUseCase.execute(input);
  }
  
  checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto> {
    
    return this._checkStockUseCase.execute({id: input.productId});
  }

}