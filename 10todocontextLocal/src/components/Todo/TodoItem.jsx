import React, { useState, useEffect, useRef } from "react";
import { useTodo } from "../../contexts";
import { triggerTaskConfetti } from "../../utils/confettiUtils";
import { formatTaskTime } from "../../utils/dateUtils";

const PRIORITY_BADGES = {
  high: { label: "High", badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  medium: { label: "Medium", badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  low: { label: "Low", badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
};

function TodoItem({ todo, showDateBadge = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);
  const [editPriority, setEditPriority] = useState(todo.priority || "medium");
  const [isAnimatingCheck, setIsAnimatingCheck] = useState(false);
  const { updateTodo, deleteTodo, toggleComplete } = useTodo();
  const inputRef = useRef(null);

  useEffect(() => {
    setEditText(todo.todo);
    setEditPriority(todo.priority || "medium");
  }, [todo]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = (e) => {
    if (!todo.completed) {
      triggerTaskConfetti(e);
      setIsAnimatingCheck(true);
      setTimeout(() => setIsAnimatingCheck(false), 500);
    }
    toggleComplete(todo.id);
  };

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      deleteTodo(todo.id);
      return;
    }
    updateTodo(todo.id, {
      ...todo,
      todo: trimmed,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.todo);
    setEditPriority(todo.priority || "medium");
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const priorityInfo = PRIORITY_BADGES[todo.priority || "medium"] || PRIORITY_BADGES.medium;
  const createdTime = formatTaskTime(todo.createdAt || todo.id);
  const completedTime = todo.completedAt ? formatTaskTime(todo.completedAt) : null;

  return (
    <div
      className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${
        isAnimatingCheck
          ? "scale-[1.02] bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          : todo.completed
          ? "bg-slate-850/40 border-slate-700/40 opacity-75"
          : "bg-slate-800/90 border-slate-700/70 hover:border-slate-600/80 shadow-md hover:shadow-lg"
      }`}
    >
      {/* Left side: Checkbox + Content */}
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
        <button
          type="button"
          onClick={handleToggle}
          className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all duration-200 shrink-0 ${
            todo.completed
              ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-100"
              : "border-slate-500 hover:border-indigo-400 bg-slate-700/50 hover:scale-110 active:scale-90"
          }`}
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        >
          {todo.completed && (
            <span className="text-sm font-black animate-[bounce_0.3s_ease-out]">
              ✓
            </span>
          )}
        </button>

        {isEditing ? (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-slate-900 border border-indigo-500/60 rounded-xl px-2.5 py-1 text-sm text-slate-100 outline-none ring-2 ring-indigo-500/20"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="bg-slate-900 border border-slate-600 rounded-xl px-2 py-1 text-xs text-slate-200 outline-none"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                onClick={() => !todo.completed && setIsEditing(true)}
                className={`text-sm break-words transition-all duration-300 ${
                  todo.completed
                    ? "line-through text-slate-400 decoration-emerald-500 decoration-2"
                    : "text-slate-100 cursor-pointer hover:text-indigo-200"
                }`}
              >
                {todo.todo}
              </span>
              
              {/* Priority badge */}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityInfo.badgeClass}`}
              >
                {priorityInfo.label}
              </span>

              {/* Created Time badge */}
              {createdTime && (
                <span
                  title={`Created at ${createdTime}`}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/60 text-slate-300 border border-slate-600/40 flex items-center gap-1"
                >
                  <span>🕒</span>
                  <span>{createdTime}</span>
                </span>
              )}

              {/* Completed Time badge (shown when task is completed) */}
              {todo.completed && completedTime && (
                <span
                  title={`Completed at ${completedTime}`}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-fadeIn"
                >
                  <span>✓</span>
                  <span>Done: {completedTime}</span>
                </span>
              )}

              {/* Date badge if in All History mode */}
              {showDateBadge && todo.date && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-700/80 text-indigo-300 border border-slate-600/50">
                  📅 {todo.date}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors text-xs font-semibold px-2.5"
              title="Save (Enter)"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors text-xs px-2.5"
              title="Cancel (Esc)"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              disabled={todo.completed}
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
              title="Edit Task"
            >
              ✏️
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Task"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
