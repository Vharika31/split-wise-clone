
import { useState } from "react";
import { Users, Plus, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddExpenseModal from "./AddExpenseModal";
import GroupDetailModal from "./GroupDetailModal";
import { Group } from "@/types";

// Mock data - replace with API calls
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Weekend Trip",
    description: "Beach vacation expenses",
    users: [
      { id: "1", name: "Alice", email: "alice@example.com" },
      { id: "2", name: "Bob", email: "bob@example.com" },
      { id: "3", name: "Charlie", email: "charlie@example.com" }
    ],
    totalExpenses: 540.75,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "House Expenses",
    description: "Shared apartment costs",
    users: [
      { id: "1", name: "Alice", email: "alice@example.com" },
      { id: "4", name: "Diana", email: "diana@example.com" }
    ],
    totalExpenses: 1250.00,
    createdAt: "2024-01-01"
  },
  {
    id: "3",
    name: "Office Lunch",
    description: "Team lunch expenses",
    users: [
      { id: "1", name: "Alice", email: "alice@example.com" },
      { id: "2", name: "Bob", email: "bob@example.com" },
      { id: "5", name: "Eve", email: "eve@example.com" },
      { id: "6", name: "Frank", email: "frank@example.com" }
    ],
    totalExpenses: 89.50,
    createdAt: "2024-01-20"
  }
];

const GroupsList = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showGroupDetail, setShowGroupDetail] = useState(false);

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupDetail(true);
  };

  const handleAddExpense = (group: Group) => {
    setSelectedGroup(group);
    setShowAddExpense(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Groups</h2>
      </div>

      <div className="grid gap-6">
        {mockGroups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div onClick={() => handleGroupClick(group)} className="flex-1">
                  <CardTitle className="text-lg font-semibold hover:text-indigo-600 transition-colors">
                    {group.name}
                  </CardTitle>
                  {group.description && (
                    <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddExpense(group);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {group.users.length} members
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${group.totalExpenses.toFixed(2)} total
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {group.users.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                    >
                      {user.name.charAt(0)}
                    </div>
                  ))}
                  {group.users.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                      +{group.users.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {selectedGroup && (
        <>
          <AddExpenseModal
            group={selectedGroup}
            open={showAddExpense}
            onOpenChange={setShowAddExpense}
          />
          <GroupDetailModal
            group={selectedGroup}
            open={showGroupDetail}
            onOpenChange={setShowGroupDetail}
          />
        </>
      )}
    </div>
  );
};

export default GroupsList;
