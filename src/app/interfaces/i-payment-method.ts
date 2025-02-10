export interface iPaymentMethod {
  id?: number;
  userId?: number;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  cardHolderName: string;
  type: 'CREDIT' | 'DEBIT' | 'PAYPAL';
}
