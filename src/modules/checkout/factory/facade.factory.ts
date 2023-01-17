import ClientAdmFacadeFactory from "../../client-adm/factory/facade-factory";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import PaymentFacadeFactory from "../../payment/factory/facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import CheckOutFacade from "../facade/checkout.facade";
import OrderRepository from "../repository/order.repository";
import FindOrderUseCase from "../usecase/find-order/find-order.usecase";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckOutFacadeFactory {

  static create() {
    try {
      const checkOutRepository = new OrderRepository();

      const clientFacade = ClientAdmFacadeFactory.create()
      const productFacade = ProductAdmFacadeFactory.create();
      const catalogueFace = StoreCatalogFacadeFactory.create();
      const invoiceFacade = InvoiceFacadeFactory.create();
      const paymentFacade = PaymentFacadeFactory.create();

      const addOrderUseCase = new PlaceOrderUseCase(
        clientFacade,
        productFacade,
        catalogueFace,
        checkOutRepository,
        invoiceFacade,
        paymentFacade
      );

      const findOrderUseCase = new FindOrderUseCase(checkOutRepository);

      const checkOutFacade = new CheckOutFacade({
        addUseCase: addOrderUseCase,
        findUseCase: findOrderUseCase
      });
      
      return checkOutFacade;

    } catch (error) {
      console.log(error);
    }
    

   
    
  }
}