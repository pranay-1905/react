import React, { useState } from "react";
import { useTodo } from "../../contexts";
import { getTodayDateString } from "../../utils/dateUtils";

function RolloverBanner() {
  const { todos, selectedDate, rolloverIncompleteTasks } = useTodo();
  const [dismissedDates, setDismissedDates] = useState({});
  const todayStr = getTodayDateString();

  // Find incomplete tasks from past days before selectedDate
  const pastIncompleteTasks = React.useMemo(() => {
    return todos.filter((t) => !t.completed && t.date && t.date < selectedDate);
  }, [todos, selectedDate]);

  // If no incomplete past tasks, or user skipped for this selectedDate
  if (pastIncompleteTasks.length === 0 || dismissedDates[selectedDate]) {
    return null;
  }

  const handleRollover = () => {
    const pastDates = [...new Set(pastIncompleteTasks.map((t) => t.date))];
    pastDates.forEach((fromDate) => {
      rolloverIncompleteTasks(fromDate, selectedDate);
    });
  };

  const handleSkip = () => {
    setDismissedDates((prev) => ({
      ...prev,
      [selectedDate]: true,
    }));
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-amber-200 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">⚠️</span>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-amber-100">
            {pastIncompleteTasks.length} unfinished {pastIncompleteTasks.length === 1 ? "task" : "tasks"} from past days
          </h4>
          <p className="text-[11px] text-amber-300/80">
            Would you like to move them to {selectedDate === todayStr ? "Today" : selectedDate}?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSkip}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 font-medium text-xs transition-colors"
          title="Dismiss this notification"
        >
          Skip
        </button>

        <button
          onClick={handleRollover}
          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/30 transition-all active:scale-95 flex items-center gap-1.5"
        >
          <span>⏩</span>
          <span>Move to {selectedDate === todayStr ? "Today" : "This Day"}</span>
        </button>
      </div>
    </div>
  );
}

export default RolloverBanner;
