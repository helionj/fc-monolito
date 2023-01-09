export interface ProcessPaymentInputDto{
  orderId: string,
  amount: number
}

export interface ProcessPaymentOutputDto{
  transactionId: string,
  amount: number,
  orderId: string,
  status: string,
  createdAt: Date,
  updatedAt: Date
}