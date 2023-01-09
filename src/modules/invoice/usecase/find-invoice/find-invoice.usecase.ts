import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  
  private _findInvoiceRepository: InvoiceGateway;

  constructor(findInvoiceRepository: InvoiceGateway){
    this._findInvoiceRepository = findInvoiceRepository;
  }
  async execute(input:FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    const result = await this._findInvoiceRepository.find(input.id);
    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      address:{
        street: result.address.street,
        number: result.address.number,
        complement: result.address.complement,
        zipCode: result.address.zipCode,
        city: result.address.city,
        state: result.address.state,
      },
      items: result.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      total: result.total(),
      createdAt: result.createdAt

    }
  }

}