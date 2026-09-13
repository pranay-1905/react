import React from "react";
import { useTodo } from "../../contexts";
import TodoItem from "./TodoItem";

function TodoList() {
  const { todos, selectedDate, searchQuery, searchScope, statusFilter } = useTodo();

  const filteredTodos = React.useMemo(() => {
    return todos.filter((item) => {
      // Date filter (unless searching all history)
      const matchesDate = searchScope === "all" ? true : item.date === selectedDate;
      if (!matchesDate) return false;

      // Search filter
      const matchesSearch = searchQuery
        ? item.todo.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === "active") return !item.completed;
      if (statusFilter === "completed") return item.completed;
      return true;
    });
  }, [todos, selectedDate, searchQuery, searchScope, statusFilter]);

  if (filteredTodos.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 text-center text-slate-400">
        <div className="text-4xl mb-3">
          {searchQuery ? "🔍" : statusFilter === "completed" ? "🎉" : "📋"}
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">
          {searchQuery
            ? "No matching tasks found"
            : statusFilter === "completed"
            ? "No completed tasks yet"
            : statusFilter === "active"
            ? "No active tasks for this day"
            : "No tasks scheduled for this day"}
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          {searchQuery
            ? "Try changing your search keywords or switch to 'All History' scope."
            : "Use the form above to add your first task and stay organized!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          showDateBadge={searchScope === "all"}
        />
      ))}
    </div>
  );
}

export default TodoList;
