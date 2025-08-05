
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sessionId: string;
}

export interface AgentResponse {
  response: string;
  session_id: string;
  timestamp: string;
}

export interface AgentRequest {
  message: string;
  session_id: string;
}

export interface Session {
  id: string;
  name: string;
  lastMessage: string;
  lastActivity: Date;
  messageCount: number;
}
