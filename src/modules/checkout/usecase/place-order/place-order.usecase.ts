import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client-entity";
import Order from "../../domain/order-entity";
import Product from "../../domain/product-entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogueFacade: StoreCatalogFacadeInterface;
  private _checkOutRepository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(clientFacade: ClientAdmFacadeInterface, 
    productFacade: ProductAdmFacadeInterface,
    catalogueFacade: StoreCatalogFacadeInterface,
    checkOutRepository: CheckoutGateway,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
     ){
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogueFacade = catalogueFacade;
    this._checkOutRepository = checkOutRepository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }
  
  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({id: input.clientId});
    if(!client){
    throw new Error("Client not found");
    }
    await this.validateProducts(input);

    const products = await Promise.all(input.products.map((product) => this.getProduct(product.productId)));
    
    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      address: client.street,
      email: client.email
    });

    const order = new Order( {
      client: myClient,
      products: products
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    const invoice = payment.status === "approved" 
      ? await this._invoiceFacade.generate({
        name: client.name,
        document: client.document,
        street: client.street,
        number: client.number,
        complement: client.complement,
        zipCode: client.zipCode,
        city: client.city,
        state: client.state,
        items: products.map((p) => {
          return{
            id: p.id.id,
            name: p.name,
            price: p.salesPrice
          }
        })

      })
      : null;
      
    payment.status === "approved" && order.approved();
    this._checkOutRepository.addOrder(order);
  
    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => {
        return {
          productId: p.id.id
        }
      }) 
    };

  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void>{
    if(input.products.length == 0){
      throw new Error("No products selected");
    }

    for(const p of input.products){
      const product = await this._productFacade.checkStock({
        productId: p.productId
      });
      if(product.stock <= 0){
        throw new Error(`Product ${p.productId} is not available in stock`);
      }

    }
  }

  private async getProduct(input: string): Promise<Product>{
   
    const product = await this._catalogueFacade.find({id: input});
    if(!product) {
      throw new Error(`Product ${input} not found`);
    }
    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    });
  }

}