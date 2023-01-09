import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client-entity";
import AddClientUseCase from "./add-client.usecase";


const MockClientRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn()
  }
}

describe("AddClientUseCase unit tests", () => {

  it("should add a client", async () => {

    const clientRepository = MockClientRepository();
    
    const input = {
      id: "1",
      name: "Fulano de Tal",
      email: "fulano@email.com",
      address: "Rua tal, 77 - Cidade Alegre"
    }

    const usecase = new AddClientUseCase(clientRepository);
    const client = await usecase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });
})