import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-objet/address";
import { InvoiceGateway } from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
 
  private _genarateInvoiceRepository : InvoiceGateway;
  
  constructor(generateInvoiceRepository: InvoiceGateway){
    this._genarateInvoiceRepository = generateInvoiceRepository;
  }
  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    
    const address = new Address({
      street: input.street,
      number:input.number,
      complement: input.complement,
      city: input.city,
      zipCode: input.zipCode,
      state: input.state
    });

    const items: Product[] = input.items.map(item => {
      return new Product({
        id: new Id(item.id),
        name: item.name,
        price: item.price
      })
    });

    const invoice = new Invoice({
      id: new Id(input.id),
      document: input.document,
      name: input.name,
      address: address,
      items: items
    });

    await this._genarateInvoiceRepository.generate(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street:invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      zipCode: invoice.address.zipCode,
      state: invoice.address.state,
      items: items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price
      })),
      total: invoice.total()
    }
  }
}