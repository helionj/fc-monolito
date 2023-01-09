import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway{
  async find(id: string): Promise<Product> {

    const productDb = await ProductModel.findOne({ where: { id: id },})
    const props ={
      id: new Id(productDb.id),
      name: productDb.name,
      description: productDb.description,
      purchasePrice: productDb.purchasePrice,
      stock: productDb.stock,
      createdAt: productDb.createdAt,
      updatedAt: productDb.updatedAt
      
    }
    if(!productDb){
      throw  new Error("Product not found");
    }
    return new Product(props);
  }

  async add(entity: Product): Promise<void>{
  
    await ProductModel.create({
      id: entity.id.id,
      name: entity.name,
      description: entity.description,
      purchasePrice: entity.purchasePrice,
      stock: entity.stock,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  
    
  }
 
}