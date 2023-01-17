import AddClientUseCase from "./add-client.usecase";
import { AddClientUseCaseInputDto } from "./add-client.usecase.dto";


const MockClientRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn()
  }
}

describe("AddClientUseCase unit tests", () => {

  it("should add a client", async () => {

    const clientRepository = MockClientRepository();
    
    const input:AddClientUseCaseInputDto = {
      id: "1",
      name: "Fulano de Tal",
      email: "fulano@email.com",
      document: "xyz98",
      street: "Rua Tal",
      number: "sn",
      complement: "",
      city: "Alegre",
      zipCode: "55000555",
      state: "ST"
      }

    const usecase = new AddClientUseCase(clientRepository);
    const client = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document)
    expect(client.address.street).toBe(input.street);
    expect(client.address.number).toBe(input.number);
    expect(client.address.complemet).toBe(input.complement);
    expect(client.address.city).toBe(input.city);
    expect(client.address.zipCode).toBe(input.zipCode);
    expect(client.address.state).toBe(input.state);

  });
})