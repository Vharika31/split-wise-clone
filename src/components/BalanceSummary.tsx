
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BalanceItem {
  name: string;
  amount: number;
  groupName: string;
}

// Mock data - replace with API calls
const mockBalances: BalanceItem[] = [
  { name: "Bob", amount: 45.50, groupName: "Weekend Trip" },
  { name: "Charlie", amount: -30.25, groupName: "Weekend Trip" },
  { name: "Diana", amount: 89.00, groupName: "House Expenses" },
  { name: "Eve", amount: -15.75, groupName: "Office Lunch" },
];

const BalanceSummary = () => {
  const totalOwed = mockBalances
    .filter(balance => balance.amount > 0)
    .reduce((sum, balance) => sum + balance.amount, 0);

  const totalOwing = mockBalances
    .filter(balance => balance.amount < 0)
    .reduce((sum, balance) => sum + Math.abs(balance.amount), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Balance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700">You're owed</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-semibold text-green-800">
              ${totalOwed.toFixed(2)}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-700">You owe</span>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-lg font-semibold text-red-800">
              ${totalOwing.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Individual Balances */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Details</h4>
          {mockBalances.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No balances to show
            </p>
          ) : (
            mockBalances.map((balance, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="font-medium text-sm">{balance.name}</div>
                  <div className="text-xs text-gray-500">{balance.groupName}</div>
                </div>
                <div className="text-right">
                  {balance.amount > 0 ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +${balance.amount.toFixed(2)}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      -${Math.abs(balance.amount).toFixed(2)}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceSummary;
