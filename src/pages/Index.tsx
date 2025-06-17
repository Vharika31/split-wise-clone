
import { useState } from "react";
import { Plus, Users, Receipt, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GroupsList from "@/components/GroupsList";
import CreateGroupModal from "@/components/CreateGroupModal";
import RecentExpenses from "@/components/RecentExpenses";
import BalanceSummary from "@/components/BalanceSummary";
import ChatBot from "@/components/ChatBot";

const Index = () => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">SplitWise</h1>
            </div>
            <Button
              onClick={() => setShowCreateGroup(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">You Owe</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">$124.50</div>
              <p className="text-xs text-muted-foreground">Across all groups</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">You're Owed</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$89.25</div>
              <p className="text-xs text-muted-foreground">To be collected</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Groups Section */}
          <div className="lg:col-span-2">
            <GroupsList />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BalanceSummary />
            <RecentExpenses />
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        open={showCreateGroup} 
        onOpenChange={setShowCreateGroup} 
      />

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Index;
