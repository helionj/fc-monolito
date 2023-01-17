import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../client-adm/factory/facade-factory";

export const clientRoute = express.Router();

clientRoute.post('/', async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create();
  
  try {
    const clientDto = {
      id: req.body.id,
      name: req.body.name,
      document: req.body.document,
      email: req.body.email,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      zipCode: req.body.zipCode,
      state: req.body.state,
      }
    
    await clientFacade.add(clientDto);
    res.status(201).send({message: "Client created"})
  } catch(error) {
    res.status(500).send(error)
  }
});