
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  users: User[];
  totalExpenses: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitType: 'equal' | 'percentage';
  splits: Split[];
  createdAt: string;
}

export interface Split {
  userId: string;
  amount: number;
  percentage?: number;
}

export interface Balance {
  userId: string;
  userName: string;
  amount: number; // positive = owed to you, negative = you owe
}

export interface GroupBalance {
  groupId: string;
  groupName: string;
  balances: Balance[];
}

export interface UserBalance {
  totalOwed: number; // money owed to you
  totalOwing: number; // money you owe
  groupBalances: GroupBalance[];
}
