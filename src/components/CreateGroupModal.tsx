
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GroupMember {
  name: string;
  email: string;
}

const CreateGroupModal = ({ open, onOpenChange }: CreateGroupModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [members, setMembers] = useState<GroupMember[]>([{ name: "", email: "" }]);
  const { toast } = useToast();

  const addMember = () => {
    setMembers([...members, { name: "", email: "" }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof GroupMember, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }

    const validMembers = members.filter(m => m.name.trim() && m.email.trim());
    if (validMembers.length === 0) {
      toast({
        title: "Error",
        description: "At least one member is required",
        variant: "destructive",
      });
      return;
    }

    // Here you would call your API to create the group
    console.log("Creating group:", {
      name: groupName,
      description: groupDescription,
      members: validMembers
    });

    toast({
      title: "Success",
      description: `Group "${groupName}" created successfully!`,
    });

    // Reset form
    setGroupName("");
    setGroupDescription("");
    setMembers([{ name: "", email: "" }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="e.g., Weekend Trip"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupDescription">Description (Optional)</Label>
            <Textarea
              id="groupDescription"
              placeholder="Brief description of the group"
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMember}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
            </div>

            <div className="space-y-3 max-h-40 overflow-y-auto">
              {members.map((member, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => updateMember(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={member.email}
                    onChange={(e) => updateMember(index, "email", e.target.value)}
                    className="flex-1"
                  />
                  {members.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
