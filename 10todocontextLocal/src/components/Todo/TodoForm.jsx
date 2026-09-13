import React, { useState } from "react";
import { useTodo } from "../../contexts";

const PRIORITIES = [
  { id: "medium", label: "🟡 Medium", color: "text-amber-400 border-amber-500/30" },
  { id: "high", label: "🔴 High", color: "text-rose-400 border-rose-500/30" },
  { id: "low", label: "🟢 Low", color: "text-emerald-400 border-emerald-500/30" },
];

function TodoForm() {
  const [todoText, setTodoText] = useState("");
  const [priority, setPriority] = useState("medium");
  const { addTodo, selectedDate } = useTodo();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = todoText.trim();
    if (!trimmed) return;

    addTodo({
      todo: trimmed,
      priority,
      date: selectedDate,
      completed: false,
    });

    setTodoText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-slate-700/60 shadow-xl flex flex-col sm:flex-row items-stretch gap-2.5 transition-all focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20"
    >
      {/* Input box */}
      <input
        type="text"
        placeholder="✍️ What needs to be done on this day?"
        className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />

      {/* Priority Selector & Add Button */}
      <div className="flex items-center gap-2 justify-end">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-slate-700/80 border border-slate-600/60 rounded-xl px-2.5 py-2 text-xs text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          {PRIORITIES.map((p) => (
            <option key={p.id} value={p.id} className="bg-slate-800 text-slate-200">
              {p.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!todoText.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/30 active:scale-95 shrink-0 flex items-center gap-1.5"
        >
          <span>➕</span>
          <span>Add</span>
        </button>
      </div>
    </form>
  );
}

export default TodoForm;
