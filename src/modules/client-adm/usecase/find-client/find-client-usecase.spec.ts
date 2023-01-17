import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client-entity"
import Address from "../../domain/value-objet/address";
import FindClientUseCase  from "./find-client-usecase";

const address = new Address({
  street: "Main street",
  number: "10",
  complement: "",
  city:"City",
  zipCode: "55000555",
  state: "ST"
})
const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "client1@email.com",
  document: "doc1",
  address: address,
});

const MockClientRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client))
  }
}
describe("FindClientUseCase unit tests", () => {

  it("should find a client", async () => {
    const clientRepository = MockClientRepository();
    const usecase = new FindClientUseCase(clientRepository);
    
    const input = {
      id: client.id.id
    }
    const result = await usecase.execute(input);
  });

});