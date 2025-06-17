
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Receipt, DollarSign, Calendar, Plus } from "lucide-react";
import { Group, Expense, Balance } from "@/types";
import AddExpenseModal from "./AddExpenseModal";

interface GroupDetailModalProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data - replace with API calls
const mockExpenses: Expense[] = [
  {
    id: "1",
    groupId: "1",
    description: "Dinner at Beach Restaurant",
    amount: 120.50,
    paidBy: "1",
    splitType: "equal",
    splits: [
      { userId: "1", amount: 40.17 },
      { userId: "2", amount: 40.17 },
      { userId: "3", amount: 40.16 }
    ],
    createdAt: "2024-01-20"
  },
  {
    id: "2",
    groupId: "1",
    description: "Uber to Airport",
    amount: 45.75,
    paidBy: "3",
    splitType: "equal",
    splits: [
      { userId: "1", amount: 15.25 },
      { userId: "2", amount: 15.25 },
      { userId: "3", amount: 15.25 }
    ],
    createdAt: "2024-01-17"
  }
];

const mockBalances: Balance[] = [
  { userId: "1", userName: "Alice", amount: -25.33 },
  { userId: "2", userName: "Bob", amount: -25.33 },
  { userId: "3", userName: "Charlie", amount: 50.66 }
];

const GroupDetailModal = ({ group, open, onOpenChange }: GroupDetailModalProps) => {
  const [showAddExpense, setShowAddExpense] = useState(false);

  const getUserName = (userId: string) => {
    return group.users.find(user => user.id === userId)?.name || "Unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl">{group.name}</DialogTitle>
              <Button
                onClick={() => setShowAddExpense(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Expense
              </Button>
            </div>
            {group.description && (
              <p className="text-sm text-gray-600">{group.description}</p>
            )}
          </DialogHeader>

          <Tabs defaultValue="expenses" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="balances">Balances</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockExpenses.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No expenses yet</p>
                    <p className="text-sm text-gray-400">Add your first expense to get started</p>
                  </div>
                ) : (
                  mockExpenses.map((expense) => (
                    <Card key={expense.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{expense.description}</h4>
                            <p className="text-sm text-gray-600">
                              Paid by {getUserName(expense.paidBy)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">${expense.amount.toFixed(2)}</div>
                            <Badge variant="outline" className="text-xs">
                              {expense.splitType}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Split details:</div>
                          {expense.splits.map((split) => (
                            <div key={split.userId} className="flex justify-between text-sm">
                              <span>{getUserName(split.userId)}</span>
                              <span>${split.amount.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500 mt-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(expense.createdAt)}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="balances" className="space-y-4">
              <div className="space-y-4">
                {mockBalances.map((balance) => (
                  <Card key={balance.userId}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium mr-3">
                            {balance.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{balance.userName}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {balance.amount > 0 ? (
                            <div>
                              <div className="text-green-600 font-semibold">
                                Gets back ${balance.amount.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">is owed</div>
                            </div>
                          ) : balance.amount < 0 ? (
                            <div>
                              <div className="text-red-600 font-semibold">
                                Owes ${Math.abs(balance.amount).toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">should pay</div>
                            </div>
                          ) : (
                            <div>
                              <div className="text-gray-600 font-semibold">Settled up</div>
                              <div className="text-xs text-gray-500">no balance</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <div className="grid gap-4">
                {group.users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium mr-4">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AddExpenseModal
        group={group}
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
      />
    </>
  );
};

export default GroupDetailModal;
