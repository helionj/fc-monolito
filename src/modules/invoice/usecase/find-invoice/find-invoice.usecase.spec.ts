import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity";
import Address from "../../domain/value-objet/address";
import FindInvoiceUseCase from "./find-invoice.usecase";

describe("FindInvoiceUseCase unit tests", () => {

  const product1 = new Product({
    id:new Id("1"),
    name: "Product 1",
    price: 10.0
  });

  const product2 = new Product({
    id:new Id("2"),
    name: "Product 2",
    price: 20.0
  });

  const address = new Address({
    street: "Main Street",
    number: "10",
    complement: "Bulding 01",
    zipCode: "55000555",
    city: "New Order",
    state: "Woods"
  });

  const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoice 1",
    document: "Document-1",
    address: address,
    items: [product1, product2] 
  });

  const MockInvoiceRepository = () => {
    return {
      generate: jest.fn(),
      find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    }
  };
  
  it("should find an invoice", async () => {

    const invoiceRepository = MockInvoiceRepository();
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: "1"
    }
    const result = await findInvoiceUseCase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toEqual(invoice.id.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.zipCode).toEqual(invoice.address.zipCode);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toEqual("1");
    expect(result.items[0].name).toEqual("Product 1");
    expect(result.items[0].price).toBe(10.0);
    expect(result.items[1].id).toEqual("2");
    expect(result.items[1].name).toEqual("Product 2");
    expect(result.items[1].price).toBe(20.0);
    expect(result.total).toBe(invoice.total());
  });
 
});