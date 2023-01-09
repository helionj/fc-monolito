import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import Address from "../domain/value-objet/address";
import InvoiceRepository from "./invoice.repository";
import InvoiceModel from "./sequelize/invoice.model";
import ProductModel from "./sequelize/product.model";

describe("InvoiceRepository tests", () => {

  const product1 = new Product({
    id: new Id("1"),
    name: "Product 1",
    price: 10.0
  });

  const product2 = new Product({
    id: new Id("2"),
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

  it("should create an invoice", async () => {
  
    const invoiceRepository = new InvoiceRepository()
    await invoiceRepository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({ where: { id: invoice.id.id}, include: ["items"]});

    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.items.length).toEqual(2);
    expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceDb.items[1].id).toEqual(invoice.items[1].id.id);
    expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price);
    expect(invoiceDb.total).toBe(invoice.total());
  });

  it("it should find an invoice", async () => {

    const invoiceRepository = new InvoiceRepository()
    await invoiceRepository.generate(invoice);

    const foundInvoice = await invoiceRepository.find(invoice.id.id);
    expect(foundInvoice).toStrictEqual(invoice);

  });
});