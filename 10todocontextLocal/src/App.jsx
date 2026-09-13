import React, { useState, useEffect } from "react";
import { TodoProvider } from "./contexts";
import { getTodayDateString } from "./utils/dateUtils";
import {
  CalendarView,
  DateStrip,
  TodoStats,
  TodoForm,
  TodoList,
  SearchBar,
  RolloverBanner,
} from "./components";

function App() {
  const todayStr = getTodayDateString();

  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem("todos_daily_v2");
      if (stored) {
        return JSON.parse(stored);
      }
      // Fallback check for older todos key and migrate
      const oldStored = localStorage.getItem("todos");
      if (oldStored) {
        const parsed = JSON.parse(oldStored);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => ({
            ...item,
            date: item.date || todayStr,
            priority: item.priority || "medium",
            createdAt: item.createdAt || new Date().toISOString(),
          }));
        }
      }
    } catch (e) {
      console.error("Failed to load todos from localStorage", e);
    }
    return [];
  });

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState("current"); // 'current' | 'all'
  const [statusFilter, setStatusFilter] = useState("all");   // 'all' | 'active' | 'completed'

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("todos_daily_v2", JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos to localStorage", e);
    }
  }, [todos]);

  // Context Actions
  const addTodo = (todo) => {
    const newTodo = {
      id: Date.now(),
      todo: todo.todo,
      completed: false,
      date: todo.date || selectedDate,
      priority: todo.priority || "medium",
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (id, updatedTodo) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id ? { ...prevTodo, ...updatedTodo } : prevTodo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) => {
        if (prevTodo.id === id) {
          const nextCompleted = !prevTodo.completed;
          return {
            ...prevTodo,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
          };
        }
        return prevTodo;
      })
    );
  };

  const rolloverIncompleteTasks = (fromDate, toDate) => {
    setTodos((prev) =>
      prev.map((item) => {
        if (!item.completed && item.date === fromDate) {
          return { ...item, date: toDate };
        }
        return item;
      })
    );
  };

  const deleteCompletedForDate = (dateStr) => {
    setTodos((prev) => prev.filter((t) => !(t.date === dateStr && t.completed)));
  };

  return (
    <TodoProvider
      value={{
        todos,
        selectedDate,
        searchQuery,
        searchScope,
        statusFilter,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        setSelectedDate,
        setSearchQuery,
        setSearchScope,
        setStatusFilter,
        rolloverIncompleteTasks,
        deleteCompletedForDate,
      }}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          
          {/* Main Top Header */}
          <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                ✅
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Daily<span className="text-indigo-400">Track</span> Todo
                </h1>
                <p className="text-xs text-slate-400">
                  Organize daily tasks, track calendar history & achieve streaks
                </p>
              </div>
            </div>

            {/* Quick summary badges */}
            <div className="flex items-center gap-2 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300">
                Total Tasks: <span className="font-bold text-white">{todos.length}</span>
              </div>
            </div>
          </header>

          {/* Main 2-Column Grid Layout */}
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Calendar & Monthly Stats */}
            <aside className="lg:col-span-5 flex flex-col gap-5">
              <CalendarView />
              <TodoStats />
            </aside>

            {/* Right Column: Date Controls, Rollover, Search, Form & List */}
            <section className="lg:col-span-7 flex flex-col gap-4">
              <DateStrip />
              <RolloverBanner />
              <SearchBar />
              <TodoForm />
              <TodoList />
            </section>

          </main>

        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
