import { createContext, useContext } from "react";
import { getTodayDateString } from "../utils/dateUtils";

export const TodoContext = createContext({
  todos: [],
  selectedDate: getTodayDateString(),
  searchQuery: "",
  searchScope: "current", // 'current' | 'all'
  statusFilter: "all",    // 'all' | 'active' | 'completed'

  addTodo: (todo) => {},
  updateTodo: (id, updatedTodo) => {},
  deleteTodo: (id) => {},
  toggleComplete: (id) => {},
  setSelectedDate: (dateStr) => {},
  setSearchQuery: (query) => {},
  setSearchScope: (scope) => {},
  setStatusFilter: (filter) => {},
  rolloverIncompleteTasks: (fromDate, toDate) => {},
  deleteCompletedForDate: (dateStr) => {},
});

export const useTodo = () => {
  return useContext(TodoContext);
};

export const TodoProvider = TodoContext.Provider;