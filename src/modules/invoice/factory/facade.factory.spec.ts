import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/sequelize/invoice.model";
import ProductModel from "../repository/sequelize/product.model";
import InvoiceFacadeFactory from "./facade.factory";

describe("InvoiceFacadeFactory  tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate a invoice", async () => {

   
    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      id: "1",
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
    await invoiceFacade.generate(input);

    const invoiceDb = await InvoiceModel.findOne({ where: {id: input.id}, include: ["items"]});

    expect(invoiceDb.id).toEqual(input.id);
    expect(invoiceDb.name).toEqual(input.name);
    expect(invoiceDb.street).toEqual(input.street);
    expect(invoiceDb.document).toEqual(input.document);
    expect(invoiceDb.items.length).toEqual(2);
    expect(invoiceDb.items[0].id).toEqual(input.items[0].id);
    expect(invoiceDb.items[0].name).toEqual(input.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(input.items[0].price);
    expect(invoiceDb.items[1].id).toEqual(input.items[1].id);
    expect(invoiceDb.items[1].name).toEqual(input.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(input.items[1].price);
    expect(invoiceDb.total).toBe(30.0);
  })

  it("should find a client", async () => {
    
    const invoiceFacade = InvoiceFacadeFactory.create();

    const inputInvoice = {
      
        id: "1",
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
            price: 10.0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "2",
            name: "Product 2",
            price: 20.0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
        total: 30.0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      
    }
    await InvoiceModel.create(inputInvoice,{
      include: [{ model: ProductModel }]
    });

    const input = {
      id: "1"
    }

    const result = await invoiceFacade.find(input);

    expect(result.id).toEqual(inputInvoice.id);
    expect(result.name).toEqual(inputInvoice.name);
    expect(result.document).toEqual(inputInvoice.document);
    expect(result.address.street).toEqual(inputInvoice.street);
    expect(result.address.number).toBe(inputInvoice.number);
    expect(result.address.complement).toEqual(inputInvoice.complement);
    expect(result.address.city).toEqual(inputInvoice.city);
    expect(result.address.zipCode).toEqual(inputInvoice.zipCode);
    expect(result.address.state).toEqual(inputInvoice.state);
    expect(result.items.length).toBe(2);
    expect(result.items[0].id).toEqual("1");
    expect(result.items[0].name).toEqual("Product 1");
    expect(result.items[0].price).toBe(10.0);
    expect(result.items[1].id).toEqual("2");
    expect(result.items[1].name).toEqual("Product 2");
    expect(result.items[1].price).toBe(20.0);
    expect(result.total).toBe(inputInvoice.total);

  }); 
});