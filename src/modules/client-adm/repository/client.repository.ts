import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client-entity";
import { ClientGateway } from "../gateway/client.gateway";
import ClientModel from "./client.model";

export default class ClientRepository implements ClientGateway {
 
  async add(client: Client): Promise<void> {

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    });
   
  }

  async find(id: string): Promise<Client> {
    
    const result = await ClientModel.findOne( { where: { id: id}});
    return new Client({
      id: new Id(result.id),
      name: result.name,
      email: result.email,
      address: result.address
    })
  }
}