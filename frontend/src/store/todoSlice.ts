import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo, TodoState } from "../types";

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    // 1. Read / Fetch Sync
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    // 2. Create (Backend se full todo entity return aane par dynamic entry insert karega)
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    // 3. Update Toggle Status
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    // 4. Delete 
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((t) => t.id !== action.payload);
    },
    // 5. Bulk Sort / Ordering actions
    reorderTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
  },
});

export const { setTodos, addTodo, toggleTodo, deleteTodo, reorderTodos } = todoSlice.actions;
export default todoSlice.reducer;