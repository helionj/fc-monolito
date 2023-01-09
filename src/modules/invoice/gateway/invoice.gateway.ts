import Invoice from "../domain/entity/invoice.entity";

export interface InvoiceGateway{

  find(id: string): Promise<Invoice>;
  generate(invoice: Invoice): Promise<void>;
}