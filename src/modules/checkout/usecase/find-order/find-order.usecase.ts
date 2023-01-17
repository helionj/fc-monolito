import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { FindOrderInputDto, FindOrderOutputDto } from "./find-order.dto";

export default class FindOrderUseCase implements UseCaseInterface {
  
  private _checkOutRepository: CheckoutGateway;

  constructor (checkOutRepository: CheckoutGateway) {
    this._checkOutRepository = checkOutRepository;
  }
  async execute(input: FindOrderInputDto): Promise<FindOrderOutputDto> {
   
   const order = await this._checkOutRepository.findOrder(input.id);
   if(order){
    return {
      id: order.id.id,
      clientId: order.client.id.id,
      clientName: order.client.name,
      clientEmail: order.client.email,
      address: order.client.address,
      products: order.products.map((product) => ({
        productId: product.id.id
      })),
      total: order.total,
      status: order.status
   }
   
   throw new Error(`Order id: ${input.id} not found.`)
   }


  }

}