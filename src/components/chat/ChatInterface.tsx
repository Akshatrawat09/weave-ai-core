
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/agent";
import { AgentApiService } from "@/services/agentApi";
import { MessageBubble } from "./MessageBubble";
import { ChatPlaceholder } from "./ChatPlaceholder";

interface ChatInterfaceProps {
  sessionId: string;
}

export const ChatInterface = ({ sessionId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check backend availability on mount
    AgentApiService.healthCheck().then(setIsBackendAvailable);
  }, []);

  useEffect(() => {
    // Clear messages when session changes
    if (sessionId) {
      setMessages([]);
    }
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    if (!isBackendAvailable) {
      toast({
        title: "Backend Unavailable",
        description: "The AI agent backend is not running. Please start the backend server.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      sessionId,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await AgentApiService.sendMessage({
        message: userMessage.content,
        session_id: sessionId,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(response.timestamp),
        sessionId,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      
      // Add mock response when backend is not available
      const mockResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm currently running in demo mode. The backend server is not available. Please start the Node.js backend to enable full functionality including RAG, plugins, and OpenAI integration.",
        timestamp: new Date(),
        sessionId,
      };

      setMessages(prev => [...prev, mockResponse]);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the AI agent backend. Using demo mode.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!sessionId) {
    return (
      <Card className="h-[600px] flex items-center justify-center">
        <ChatPlaceholder />
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Connection Status */}
      {!isBackendAvailable && (
        <div className="bg-destructive/10 border-b border-destructive/20 p-3">
          <p className="text-sm text-destructive font-medium">
            ⚠️ Backend Unavailable - Running in Demo Mode
          </p>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with the AI agent!</p>
              <p className="text-sm mt-2">Try asking about weather, math, or general questions.</p>
            </div>
          )}
          
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Bot className="h-5 w-5" />
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">AI is thinking...</span>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... (e.g., 'weather in Paris', '2+2*3', or general questions)"
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="lg"
            className="px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>
  );
};
