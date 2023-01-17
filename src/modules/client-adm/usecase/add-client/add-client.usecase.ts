import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Client from "../../domain/client-entity";
import Address from "../../domain/value-objet/address";
import { ClientGateway } from "../../gateway/client.gateway";
import { AddClientUseCaseInputDto, AddClientUseCaseOutputDto } from "./add-client.usecase.dto";

export default class AddClientUseCase implements UseCaseInterface {
  
  private _clientRepository: ClientGateway;

  constructor(clientRepository: ClientGateway){
    this._clientRepository=clientRepository;
  }

  async execute(input: AddClientUseCaseInputDto ): Promise<AddClientUseCaseOutputDto> {
   
    const address = new Address(
      {
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        zipCode: input.zipCode,
        state: input.state
      }
    )
    const client = new Client({
      id: new Id(input.id),
      name: input.name,
      email: input.email,
      document: input.document,
      address: address
    })
    await this._clientRepository.add(client);

    return({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      address: {
        street: client.address.street,
        number:client.address.number,
        complemet: client.address.complement,
        city: client.address.city,
        zipCode: client.address.zipCode,
        state: client.address.state
      },
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    });
  }

}