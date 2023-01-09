import Id from "../../../@shared/domain/value-object/id.value-object"
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase.dto";

const transaction = new Transaction({
  id: new Id("1"),
  amount: 101.0,
  orderId: "1",
});

transaction.process();
const MockProcessPaymentRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
  }
}
describe("ProcessPaymentUseCase unit tests", () => {

  it("should create a transaction", async () => {
    const paymentRepository = MockProcessPaymentRepository();
    const paymentUseCase = new ProcessPaymentUseCase(paymentRepository);

    const input = {
      orderId: "1",
      amount: 101.0
    }

    const result = await paymentUseCase.execute(input);

    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe(transaction.id.id);
    expect(result.orderId).toBe(transaction.orderId);
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(101.0);
  })
})