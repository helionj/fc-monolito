import express, { Request, Response } from "express";
import CheckOutFacadeFactory from "../../checkout/factory/facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
  
  const checkOutFacade = CheckOutFacadeFactory.create();

  try {
    const input = {
      clientId: req.body.clientId,
      products: req.body.products.map((item:any) => ({
        productId: item.productId
      }))
    };
    const response = await checkOutFacade.addOrder(input);
    res.status(201).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

checkoutRoute.get('/:orderId', async (req: Request, res: Response) => {
  
  const checkOutFacade = CheckOutFacadeFactory.create();
  
  try {
   
      const { orderId } = req.params;
    
      const input = {
        id:orderId
      }
    
    const order = await checkOutFacade.findOrder(input)
    res.status(200).send(order)
  } catch(error) {
    res.status(500).send(error)
  }
});