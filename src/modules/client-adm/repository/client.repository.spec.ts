import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client-entity";
import ClientModel from "./client.model";
import ClientRepository from "./client.repository";

describe("Client Repository unit tests", () => {
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
    
    const props = {
      id: new Id("1"),
      name: "Client 1",
      email: "client1@email.com",
      address: "Address 1",
      

    }
    const client = new Client(props);

    const clientRepository = new ClientRepository();
    clientRepository.add(client);

    const clientDb = await ClientModel.findOne(
      { where : { id: props.id.id }, }
    );
   

    expect(props.id.id).toEqual(clientDb.id);
    expect(props.name).toEqual(clientDb.name);
    expect(props.email).toEqual(clientDb.email);
    expect(props.address).toEqual(clientDb.address);
    expect(clientDb.createdAt).toBeDefined();

  });

  it("should find a client", async () => {
    const clientRepository = new ClientRepository();
   
    ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "client1@email.com",
      address: "Address 1",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });



    const clientDb = await clientRepository.find("1");

    expect(clientDb.id.id).toEqual("1");
    expect(clientDb.name).toEqual("Client 1");
    expect(clientDb.email).toEqual("client1@email.com");
    expect(clientDb.address).toEqual("Address 1");
    expect(clientDb.createdAt).toBeDefined();
  });
});