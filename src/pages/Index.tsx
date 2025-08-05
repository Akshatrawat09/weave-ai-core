
import { useState } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { SessionManager } from "@/components/session/SessionManager";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Session Management Sidebar */}
            <div className="lg:col-span-1">
              <SessionManager 
                currentSessionId={currentSessionId}
                onSessionChange={setCurrentSessionId}
              />
            </div>
            
            {/* Main Chat Interface */}
            <div className="lg:col-span-3">
              <ChatInterface sessionId={currentSessionId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
