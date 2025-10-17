export interface User {
  id: string;
  google_id: string;
  email: string;
  name: string | null;
  picture: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Diagram {
  id: string;
  project_id: string;
  name: string;
  mermaid_code: string;
  layout: string;
  theme: string;
  direction: string;
  created_at: string;
  updated_at: string;
}

export interface DiagramHistory {
  id: string;
  diagram_id: string;
  mermaid_code: string;
  user_prompt: string | null;
  ai_response: string | null;
  layout: string;
  theme: string;
  direction: string;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
