
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Calendar } from "lucide-react";

interface RecentExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  groupName: string;
  date: string;
  splitType: 'equal' | 'percentage';
}

// Mock data - replace with API calls
const mockExpenses: RecentExpense[] = [
  {
    id: "1",
    description: "Dinner at Beach Restaurant",
    amount: 120.50,
    paidBy: "Alice",
    groupName: "Weekend Trip",
    date: "2024-01-20",
    splitType: "equal"
  },
  {
    id: "2",
    description: "Grocery Shopping",
    amount: 85.30,
    paidBy: "Diana",
    groupName: "House Expenses",
    date: "2024-01-19",
    splitType: "percentage"
  },
  {
    id: "3",
    description: "Team Pizza Lunch",
    amount: 89.50,
    paidBy: "Bob",
    groupName: "Office Lunch",
    date: "2024-01-18",
    splitType: "equal"
  },
  {
    id: "4",
    description: "Uber to Airport",
    amount: 45.75,
    paidBy: "Charlie",
    groupName: "Weekend Trip",
    date: "2024-01-17",
    splitType: "equal"
  },
];

const RecentExpenses = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Receipt className="h-5 w-5 mr-2" />
          Recent Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mockExpenses.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No recent expenses
          </p>
        ) : (
          <div className="space-y-3">
            {mockExpenses.map((expense) => (
              <div key={expense.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{expense.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Paid by {expense.paidBy} • {expense.groupName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">${expense.amount.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(expense.date)}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      expense.splitType === 'equal' 
                        ? 'border-blue-200 text-blue-700' 
                        : 'border-purple-200 text-purple-700'
                    }`}
                  >
                    {expense.splitType}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentExpenses;
