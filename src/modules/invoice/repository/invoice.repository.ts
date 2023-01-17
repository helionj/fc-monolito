import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import Address from "../domain/value-objet/address";
import { InvoiceGateway } from "../gateway/invoice.gateway";
import InvoiceModel from "./sequelize/invoice.model";
import InvoiceProductModel from "./sequelize/invoice-product.model";

export default class InvoiceRepository implements InvoiceGateway {

  async find(id: string): Promise<Invoice>{
    
    const invoiceModel = await InvoiceModel.findOne({
      where: { id }, 
      include: ["items"]
    });
    return this.makeInvoice(invoiceModel);
  }
  async generate(invoice: Invoice): Promise<void>{
    try {
      await InvoiceModel.create({
        id: invoice.id.id,
        name:invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        zipCode: invoice.address.zipCode,
        city: invoice.address.city,
        state:invoice.address.state,
        total: invoice.total(),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
          updatedAt: item.updatedAt,
          createdAt: item.createdAt

        }))
      }, 
      {
        include: [{ model: InvoiceProductModel }]
      });
    } catch (error) {
      console.log(error);
    }
    
  }

  makeInvoice(invoiceModel: InvoiceModel): Invoice {

    let items: Product[] = invoiceModel.items.map(item => {
       const product = new Product({id:new Id(item.id), name:item.name, price: item.price});
       product.createdAt = item.createdAt;
       product.updatedAt = item.updatedAt;
       return product;
    })
    
    const invoice = new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: new Address({
        street: invoiceModel.street,
        number: invoiceModel.number,
        complement: invoiceModel.complement,
        zipCode: invoiceModel.zipCode,
        city: invoiceModel.city,
        state: invoiceModel.state
      }),
      items: items,
    });
    invoice.updatedAt = invoiceModel.updatedAt
    invoice.createdAt = invoiceModel.createdAt
    return invoice;
  }
}