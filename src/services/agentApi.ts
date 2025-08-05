
import { AgentRequest, AgentResponse } from "@/types/agent";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export class AgentApiService {
  /**
   * Send message to AI agent backend
   */
  static async sendMessage(request: AgentRequest): Promise<AgentResponse> {
    const response = await fetch(`${API_BASE_URL}/agent/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Check if backend is available
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
