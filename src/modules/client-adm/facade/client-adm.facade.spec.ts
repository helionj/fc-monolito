import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import { FindClientUseCase } from "../usecase/find-client/find-client-usecase";
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

  it("should create a product", async () => {

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
      address: "Address 1",
      
    }
    await clientFacade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" }});

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
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
      address: "Address 1",
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
    expect(client.address).toBe("Address 1");

  });
})