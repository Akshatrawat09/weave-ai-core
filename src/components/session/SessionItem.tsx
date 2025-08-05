
import { useState } from "react";
import { MessageSquare, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Session } from "@/types/agent";

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

export const SessionItem = ({ 
  session, 
  isActive, 
  onClick, 
  onDelete, 
  onRename 
}: SessionItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(session.name);

  const handleRename = () => {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(session.name);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-2 border rounded-lg bg-card">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') handleCancel();
          }}
          className="h-8 mb-2"
          autoFocus
        />
        <div className="flex space-x-1">
          <Button size="sm" onClick={handleRename} className="flex-1 h-6">
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="flex-1 h-6">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group p-3 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-muted'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center min-w-0 flex-1">
          <MessageSquare className={`h-4 w-4 mr-2 flex-shrink-0 ${
            isActive ? 'text-primary-foreground' : 'text-muted-foreground'
          }`} />
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium truncate ${
              isActive ? 'text-primary-foreground' : 'text-foreground'
            }`}>
              {session.name}
            </p>
            {session.lastMessage && (
              <p className={`text-xs truncate mt-1 ${
                isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {session.lastMessage}
              </p>
            )}
            <p className={`text-xs mt-1 ${
              isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              {session.lastActivity.toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
