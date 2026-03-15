export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'sales' | 'compliance' | 'admin';
  avatar_url?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'sales' | 'compliance' | 'admin';
  department?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  module: 'sales' | 'compliance';
  question: string;
  answer: string;
  citations?: string;
  created_at: string;
}
