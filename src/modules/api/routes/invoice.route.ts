import express, {Request, Response} from "express";
import { GenerateInvoiceFacadeInputDto } from "../../invoice/facade/invoice.facade.interface";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.post('/', async (req: Request, res: Response) => {

  const invoiceFacade = InvoiceFacadeFactory.create();

  try {
    
    const input:GenerateInvoiceFacadeInputDto = {
      id: req.body.id,
      name: req.body.name,
      document: req.body.document,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      items: req.body.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price
      }))
    }
    const invoice = await invoiceFacade.generate(input);

    res.status(201).send(invoice);
  
  } catch (error) {
    res.status(500).send(error)
  }
});

invoiceRoute.get('/:invoiceId', async (req: Request, res: Response) => {
  const invoiceFacade = InvoiceFacadeFactory.create();
  
  try {
   
      const { invoiceId } = req.params;
    
      const input = {
        id:invoiceId
      }
    
    const invoice = await invoiceFacade.find(input);
    res.status(200).send(invoice)
  } catch(error) {
    res.status(500).send(error)
  }
});