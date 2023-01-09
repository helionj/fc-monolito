import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/entity/invoice.entity";
import Product from "../../domain/entity/product.entity"
import Address from "../../domain/value-objet/address";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("GenerateInvoiceUseCase unit tests", () => {
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
      find: jest.fn(),
    }
  };

  it("should generate an invoice", async () => {
  
    const input = {

      name: "Invoice 1",
      document: "Document-1",
      street: "Main Street",
      number: "10",
      complement: "Bulding 01",
      zipCode: "55000555",
      city: "New Order",
      state: "Woods",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10.0
        },
        {
          id: "2",
          name: "Product 2",
          price: 20.0
        },
      ]
    };

    const invoiceRepository = MockInvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);

    const result = await generateInvoiceUseCase.execute(input);

    expect(invoiceRepository.generate).toHaveBeenCalled()
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.zipCode).toEqual(input.zipCode);
    expect(result.state).toEqual(input.state);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toEqual("1");
    expect(result.items[0].name).toEqual("Product 1");
    expect(result.items[0].price).toBe(10.0);
    expect(result.items[1].id).toEqual("2");
    expect(result.items[1].name).toEqual("Product 2");
    expect(result.items[1].price).toBe(20.0);
    expect(result.total).toBe(30.0);
  });
});