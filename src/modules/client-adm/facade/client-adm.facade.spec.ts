import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase  from "../usecase/find-client/find-client-usecase";
import ClientAdmFacade from "./client-adm.facade";

describe("ClientAdmFacade tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {

    const clientRepository = new ClientRepository();
    const addClientUseCase = new AddClientUseCase(clientRepository);
    const clientFacade = new ClientAdmFacade({
      addUseCase: addClientUseCase,
      findUseCase: undefined
    });

    const input = {
      id: "1",
      name: "Client 1",
      email: "client1@email.com",
      document: "doc1",
      street: "Main street",
      number: "10",
      complement: "cpl",
      city: "City",
      zipCode: "55000555",
      state: "ST",
      
    }
    await clientFacade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" }});

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
  })

  it("should find a client", async () => {
    const clientRepository = new ClientRepository();
    const findClientUseCase = new FindClientUseCase(clientRepository);
    const clientFacade = new ClientAdmFacade({
      addUseCase: undefined,
      findUseCase: findClientUseCase,
    });

    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "client1@email.com",
      document: "doc1",
      street: "Main Street",
      number: "10",
      complement: "",
      city: "City",
      zipCode: "55000555",
      state: "ST",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const input = {
      id: "1"
    }

    const client = await clientFacade.find(input);

    expect(client.id).toBe("1");
    expect(client.name).toBe("Client 1");
    expect(client.email).toBe("client1@email.com")
    expect(client.document).toBe("doc1");
    expect(client.street).toBe("Main Street")

  });
})