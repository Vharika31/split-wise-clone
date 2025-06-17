
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Group, Split } from "@/types";

interface AddExpenseModalProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddExpenseModal = ({ group, open, onOpenChange }: AddExpenseModalProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "percentage">("equal");
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handlePercentageChange = (userId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPercentages(prev => ({ ...prev, [userId]: numValue }));
  };

  const getTotalPercentage = () => {
    return Object.values(percentages).reduce((sum, val) => sum + val, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || !amount || !paidBy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (splitType === "percentage") {
      const totalPercentage = getTotalPercentage();
      if (Math.abs(totalPercentage - 100) > 0.01) {
        toast({
          title: "Error",
          description: "Percentages must add up to 100%",
          variant: "destructive",
        });
        return;
      }
    }

    // Calculate splits
    let splits: Split[];
    if (splitType === "equal") {
      const splitAmount = numAmount / group.users.length;
      splits = group.users.map(user => ({
        userId: user.id,
        amount: splitAmount
      }));
    } else {
      splits = group.users.map(user => ({
        userId: user.id,
        amount: (numAmount * (percentages[user.id] || 0)) / 100,
        percentage: percentages[user.id] || 0
      }));
    }

    // Here you would call your API to create the expense
    console.log("Creating expense:", {
      groupId: group.id,
      description,
      amount: numAmount,
      paidBy,
      splitType,
      splits
    });

    toast({
      title: "Success",
      description: "Expense added successfully!",
    });

    // Reset form
    setDescription("");
    setAmount("");
    setPaidBy("");
    setSplitType("equal");
    setPercentages({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Expense to {group.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Dinner at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Paid by</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {group.users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Split type</Label>
            <RadioGroup value={splitType} onValueChange={(value: "equal" | "percentage") => setSplitType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="equal" id="equal" />
                <Label htmlFor="equal">Split equally</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage">Split by percentage</Label>
              </div>
            </RadioGroup>
          </div>

          {splitType === "percentage" && (
            <div className="space-y-3">
              <Label>Set percentages for each member</Label>
              <div className="space-y-2">
                {group.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <span className="text-sm">{user.name}</span>
                    <div className="flex items-center space-x-1">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0"
                        value={percentages[user.id] || ""}
                        onChange={(e) => handlePercentageChange(user.id, e.target.value)}
                        className="w-20"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-right">
                Total: {getTotalPercentage().toFixed(1)}%
                {Math.abs(getTotalPercentage() - 100) > 0.01 && (
                  <span className="text-red-500 ml-2">Must equal 100%</span>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
