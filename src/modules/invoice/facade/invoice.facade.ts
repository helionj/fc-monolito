import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

type InvoiceFacadeProps ={
  generateUseCase: UseCaseInterface,
  findUseCase: UseCaseInterface
}

export default class InvoiceFacade implements InvoiceFacadeInterface {

  private _generateUseCase: UseCaseInterface;
  private _findUseCase: UseCaseInterface;

  constructor(props: InvoiceFacadeProps) {
    this._findUseCase = props.findUseCase;
    this._generateUseCase = props.generateUseCase;
  }

  async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
   await this._generateUseCase.execute(input);
  }

  async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDTO> {
    return  await this._findUseCase.execute(input);
  }

}