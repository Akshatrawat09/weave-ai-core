
import { MessageCircle, Zap, Brain, Plug } from "lucide-react";

export const ChatPlaceholder = () => {
  return (
    <div className="text-center space-y-6 max-w-md mx-auto p-6">
      <div className="flex justify-center">
        <div className="relative">
          <MessageCircle className="h-16 w-16 text-muted-foreground/50" />
          <div className="absolute -top-1 -right-1">
            <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Welcome to AI Agent
        </h3>
        <p className="text-muted-foreground">
          Select or create a session to start chatting with the AI agent
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 text-sm">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Brain className="h-5 w-5 text-primary" />
          <div className="text-left">
            <div className="font-medium">RAG-Powered</div>
            <div className="text-muted-foreground">Access to knowledge base</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
          <Plug className="h-5 w-5 text-primary" />
          <div className="text-left">
            <div className="font-medium">Plugin System</div>
            <div className="text-muted-foreground">Weather, math & more</div>
          </div>
        </div>
      </div>
    </div>
  );
};
