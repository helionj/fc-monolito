import PaymentFacade from "../facade/payment.facade";
import TransactionRepository from "../repository/transaction.repository";
import ProcessPaymentUseCase from "../usecase/transaction-payment/process-payment.usecase.dto";

export default class PaymentFacadeFactory {
  static create(){
    const paymentRepository = new TransactionRepository();
    const paymentUseCase = new ProcessPaymentUseCase(paymentRepository);
    return  new PaymentFacade(paymentUseCase);
  }
}