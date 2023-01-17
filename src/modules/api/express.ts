import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import OrderProductModel from "../checkout/repository/sequelize/order-product.model";
import OrderModel from "../checkout/repository/sequelize/order.model";
import ClientModel from "../client-adm/repository/client.model";
import InvoiceProductModel from "../invoice/repository/sequelize/invoice-product.model";
import InvoiceModel from "../invoice/repository/sequelize/invoice.model";
import TransactionModel from "../payment/repository/transaction.model";
import ProductModel from "../product-adm/repository/product.model";
import StoreProductModel from "../store-catalog/repository/store-product.model";
import { checkoutRoute } from "./routes/checkout.route";
import { clientRoute } from "./routes/client.route";
import { invoiceRoute } from "./routes/invoice.route";
import { productRoute } from "./routes/product.route";

export const app: Express = express();

app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/invoices", invoiceRoute);
app.use("/checkout", checkoutRoute)

export let sequelize: Sequelize;

async function setupDb(){
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
  });
  await sequelize.addModels([ProductModel,ClientModel,InvoiceModel, 
    InvoiceProductModel,TransactionModel,OrderProductModel,OrderModel,StoreProductModel]);
  await sequelize.sync();
 
}

setupDb();
