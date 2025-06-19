export interface IredeemData {
  id: number;
  codeId: number;
  amount: number;
  customerId: number;
  point_used: number;
  exchangeId: number;
  created_at: string;
  code: {
    code: string;
    isUsed: boolean;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  exchange: {
    moneyAmount: number;
    pointNumber: number;
  };
}
