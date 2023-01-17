import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client-entity";
import Address from "../domain/value-objet/address";
import { ClientGateway } from "../gateway/client.gateway";
import ClientModel from "./client.model";

export default class ClientRepository implements ClientGateway {
 
  async add(client: Client): Promise<void> {

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      zipCode: client.address.zipCode,
      state: client.address.state,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    });
   
  }

  async find(id: string): Promise<Client> {
    
    const result = await ClientModel.findOne( { where: { id: id}});
    const address = new Address({
      street: result.street,
      number: result.number,
      complement: result.complement,
      city: result.city,
      zipCode: result.zipCode,
      state: result.state, 
    });

    return new Client({
      id: new Id(result.id),
      name: result.name,
      email: result.email,
      document: result.document,
      address: address,
    })
  }
}