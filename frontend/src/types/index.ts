export interface Todo {
  _id: string;
  id: string;
  title: string;
  text?: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  order?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}