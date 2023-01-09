import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Transaction from "../domain/transaction";
import TransactionModel from "../repository/transaction.model";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/transaction-payment/process-payment.usecase.dto";
import PaymentFacade from "./payment.facade";

describe("PaymentFacade tests", () => {
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

  it("should return an aprroved transaction", async () => {
    
    const paymentRepository = new TransactionRepository();
    const paymentUseCase = new ProcessPaymentUseCase(paymentRepository);
    const paymentFacade = new PaymentFacade(paymentUseCase);

    const input = {
      orderId: "1",
      amount: 101.0
    }

    const result = await paymentFacade.process(input);

    expect(result.orderId).toBe(input.orderId);
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(101.0);

  });
  it("should return a declined transaction", async () => {
    
    const paymentRepository = new TransactionRepository();
    const paymentUseCase = new ProcessPaymentUseCase(paymentRepository);
    const paymentFacade = new PaymentFacade(paymentUseCase);

    const input = {
      orderId: "1",
      amount: 99.0
    }

    const result = await paymentFacade.process(input);

    expect(result.orderId).toBe(input.orderId);
    expect(result.status).toBe("declined");
    expect(result.amount).toBe(99.0);

  });
});