export interface ITransaction {
  id: number;
  type: string;
  reason: string;
  created_at: string;
  amount: number;
  customerId: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  allCode: {
    value: string;
  };
}

export interface CustomerRanking {
  id?: number;
  tierName: string;
  pointRate: number;
  min_spent: number;
  // customers?: Customer[]; // giả sử bạn có interface Customer
  created_at?: string | undefined;
}
