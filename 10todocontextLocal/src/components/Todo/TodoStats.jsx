import React from "react";
import { useTodo } from "../../contexts";
import { calculateStreak } from "../../utils/dateUtils";

function TodoStats() {
  const { todos, selectedDate } = useTodo();

  const dayTodos = React.useMemo(() => {
    return todos.filter((t) => t.date === selectedDate);
  }, [todos, selectedDate]);

  const total = dayTodos.length;
  const completed = dayTodos.filter((t) => t.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const streak = calculateStreak(todos);

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 shadow-xl text-slate-100 transition-all duration-300">
      {/* Top row: Streak & Counts */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <div className="text-sm font-bold text-white">
              {streak} {streak === 1 ? "Day" : "Days"} Streak
            </div>
            <div className="text-[11px] text-slate-400">100% completion streak</div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xl font-extrabold text-indigo-400 transition-all duration-300">
            {completed}/{total}
          </span>
          <span className="text-xs text-slate-400 ml-1">Tasks Done</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700/70 h-3 rounded-full overflow-hidden p-0.5 border border-slate-600/40">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            percentage === 100 && total > 0
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
              : "bg-gradient-to-r from-indigo-500 to-purple-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Status bottom row */}
      <div className="flex items-center justify-between mt-2.5 text-xs text-slate-400">
        <span>
          {percentage === 100 && total > 0 ? (
            <span className="text-emerald-400 font-semibold">
              ✓ All tasks completed ({percentage}%)
            </span>
          ) : (
            <span>{percentage}% Completed</span>
          )}
        </span>
      </div>
    </div>
  );
}

export default TodoStats;
