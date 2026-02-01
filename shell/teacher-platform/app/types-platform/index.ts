// User Types
export interface User {
  id: string;
  username: string;
  classes: ClassInfo[];
  subjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassInfo {
  grade: number;
  class: number;
}

// Tool Types
export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'create' | 'analyze';
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Chat Types
export interface ChatSession {
  chatId: string;
  toolId: string;
  toolName: string;
  createdAt: string;
  messages: Message[];
  outputId?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Output Types
export interface Output {
  outputId: string;
  toolId: string;
  toolName: string;
  title: string;
  type: 'download' | 'copy';
  format?: 'xlsx' | 'png' | 'pdf' | 'text' | 'link' | 'qr';
  fileUrl?: string;
  content?: string;
  createdAt: string;
  chatId: string;
  metadata?: Record<string, any>;
}

// Auth Types
export interface LoginCredentials {
  username: string;
  password: string;
  rememberUsername?: boolean;
  rememberPassword?: boolean;
}

export interface SignupData {
  userId: string;
  password: string;
  classes: ClassInfo[];
  subjects: string[];
}
