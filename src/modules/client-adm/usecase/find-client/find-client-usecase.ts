import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { ClientGateway } from "../../gateway/client.gateway";
import { FindClientInputDto, FindClientOutputDto } from "./find-client.usecase.dto";

export default class FindClientUseCase implements UseCaseInterface {
  
  private _clientRepository: ClientGateway;
  
  constructor(clientRepository: ClientGateway){
    this._clientRepository= clientRepository;
  }
  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    const client =  await this._clientRepository.find(input.id);
    return {
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
    }
  }

}