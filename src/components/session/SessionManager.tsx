
import { useState, useEffect } from "react";
import { Plus, MessageSquare, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Session } from "@/types/agent";
import { SessionItem } from "./SessionItem";

interface SessionManagerProps {
  currentSessionId: string;
  onSessionChange: (sessionId: string) => void;
}

export const SessionManager = ({ currentSessionId, onSessionChange }: SessionManagerProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('ai-agent-sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed.map((s: any) => ({
        ...s,
        lastActivity: new Date(s.lastActivity)
      })));
    }
  }, []);

  useEffect(() => {
    // Save sessions to localStorage
    localStorage.setItem('ai-agent-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const createNewSession = () => {
    const sessionName = newSessionName.trim() || `Session ${sessions.length + 1}`;
    const newSession: Session = {
      id: Date.now().toString(),
      name: sessionName,
      lastMessage: "",
      lastActivity: new Date(),
      messageCount: 0,
    };

    setSessions(prev => [newSession, ...prev]);
    onSessionChange(newSession.id);
    setIsCreating(false);
    setNewSessionName("");
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      onSessionChange("");
    }
  };

  const renameSession = (sessionId: string, newName: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, name: newName } : s
    ));
  };

  const updateSessionActivity = (sessionId: string, lastMessage: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { 
            ...s, 
            lastMessage, 
            lastActivity: new Date(),
            messageCount: s.messageCount + 1 
          } 
        : s
    ));
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Sessions
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-3">
        {isCreating && (
          <div className="mb-3 space-y-2">
            <Input
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              placeholder="Session name..."
              className="h-8"
              onKeyPress={(e) => e.key === 'Enter' && createNewSession()}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={createNewSession} className="flex-1">
                Create
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setNewSessionName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <ScrollArea className="h-full">
          <div className="space-y-2">
            {sessions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No sessions yet</p>
                <p className="text-xs">Create your first session to begin</p>
              </div>
            ) : (
              sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === currentSessionId}
                  onClick={() => onSessionChange(session.id)}
                  onDelete={() => deleteSession(session.id)}
                  onRename={(newName) => renameSession(session.id, newName)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
