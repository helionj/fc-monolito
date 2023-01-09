import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import { ProductGateway } from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
  
  async findAll(): Promise<Product[]> {
    
    const products = await ProductModel.findAll();
    return products.map(product => 
      new Product({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice
      })
    );
  }
  
  async find(id: string): Promise<Product> {
   
    const productDb = await ProductModel.findOne({where: { id:id }});
    const props = {
      id: new Id(productDb.id),
      name: productDb.name,
      description: productDb.description,
      salesPrice: productDb.salesPrice,
      
    }
    if(!productDb){
      throw  new Error("Product not found");
    }
    return new Product(props);
  }

 

 
}