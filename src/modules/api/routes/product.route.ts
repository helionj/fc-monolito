import express, {Request, Response} from "express";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
  const productFacade = ProductAdmFacadeFactory.create();
  
  try {
    const productDto = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock
      }
    
    await productFacade.addProduct(productDto);
    res.status(201).send({message: "Product created"})
  } catch(error) {
    res.status(500).send(error)
  }
});

productRoute.get('/stock/:productId', async (req: Request, res: Response) => {
  const productFacade = ProductAdmFacadeFactory.create();
  
  try {
   
      const { productId } = req.params;
    
      const input = {
        productId
      }
    
    const product = await productFacade.checkStock(input);
    res.status(200).send(product)
  } catch(error) {
    res.status(500).send(error)
  }
});