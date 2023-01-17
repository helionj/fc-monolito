import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Transaction from "../domain/transaction";
import TransactionModel from "./transaction.model";
import TransactionRepository from "./transaction.repository";

describe("TransactionRepository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
    });

    await sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a transaction", async () => {
    
    const props = {
      id: new Id("1"),
      orderId: "1",
      amount: 100.0,
    
    }
    const transaction = new Transaction(props);
    transaction.approve();
    const transactionRepository = new TransactionRepository();
    transactionRepository.save(transaction);

    const transactionDb = await TransactionModel.findOne(
      { where : { id: props.id.id }, }
    );
   

    expect(props.id.id).toEqual(transactionDb.id);
    expect(props.orderId).toEqual(transactionDb.orderId);
    expect(props.amount).toEqual(transactionDb.amount);
    expect("approved").toEqual(transactionDb.status);
    expect(transactionDb.createdAt).toBeDefined();
    expect(transactionDb.updatedAt).toBeDefined();

  });
});