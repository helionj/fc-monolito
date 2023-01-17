import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { AddOrderFacadeInputDto, AddOrderFacadeOutputDto, CheckOutFacadeInterface, FindOrderFacadeInputDto, FindOrderFacadeOutputDto } from "./checkout.facade.interface";

export interface UseCaseProps {
  addUseCase: UseCaseInterface
  findUseCase: UseCaseInterface
}

export default class CheckOutFacade implements CheckOutFacadeInterface{
  
  private _addOrderUseCase: UseCaseInterface;
  private _findOrderUseCase: UseCaseInterface;

  constructor(props: UseCaseProps){
    this._addOrderUseCase = props.addUseCase,
    this._findOrderUseCase = props.findUseCase
  }

  async addOrder(input: AddOrderFacadeInputDto): Promise<AddOrderFacadeOutputDto> {
    return await this._addOrderUseCase.execute(input);
  }
  
  async findOrder(input: FindOrderFacadeInputDto): Promise<FindOrderFacadeOutputDto> {
    return await this._findOrderUseCase.execute(input);
  }

}