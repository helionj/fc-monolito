import { UnknownConstraintError } from "sequelize/types";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client-entity";
import Order from "../domain/order-entity";
import Product from "../domain/product-entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderProductModel from "./sequelize/order-product.model";
import OrderModel from "./sequelize/order.model";

export default class OrderRepository implements CheckoutGateway {
 
  async addOrder(order: Order): Promise<void>{
    
    try {
      await OrderModel.create({
        id: order.id.id,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        products: order.products.map((product) => ({
          id: product.id.id,
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        })),
  
        client_id: order.client.id.id,
        client_name: order.client.name,
        client_email: order.client.email,
        client_address: order.client.address
      
      },{
        include: [{model: OrderProductModel}]
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findOrder(id: string): Promise<Order | null>{
    
    const result = await OrderModel.findOne({where: {id}, include: ["products"] })
    if(result){
      return this.makeOrder(result);
    }
    return null;
  }

  makeOrder(orderModel: OrderModel): Order {

    const products: Product[] = orderModel.products.map(p => {
      return new Product({
        id: new Id(p.id), 
        name: p.name, 
        description: p.description, 
        salesPrice: p.salesPrice});
    });

    const client = new Client({
      id: new Id(orderModel.client_id),
      name: orderModel.client_name,
      email: orderModel.client_email,
      address: orderModel.client_address
    });

    
    const order = new Order({
      id: new  Id(orderModel.id),
      client: client,
      products: products,
      status: orderModel.status
    });
    return order;
  }
}