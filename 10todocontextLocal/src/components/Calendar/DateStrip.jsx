import React from "react";
import { useTodo } from "../../contexts";
import { formatDisplayDate, shiftDate, getTodayDateString } from "../../utils/dateUtils";

function DateStrip() {
  const { selectedDate, setSelectedDate } = useTodo();
  const todayStr = getTodayDateString();
  const isToday = selectedDate === todayStr;

  const handlePrevDay = () => {
    setSelectedDate(shiftDate(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(shiftDate(selectedDate, 1));
  };

  const handleToday = () => {
    setSelectedDate(todayStr);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/60 shadow-lg flex flex-wrap items-center justify-between gap-3 text-slate-100">
      {/* Date Title & Badge */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg">
          📅
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">
              {formatDisplayDate(selectedDate)}
            </h1>
            {isToday && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Day
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {isToday
              ? "Focus on your tasks for today"
              : `Viewing log for ${selectedDate}`}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevDay}
          className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 border border-slate-600/50 text-sm font-medium transition-colors flex items-center gap-1"
          title="Previous Day"
        >
          <span>◀</span>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {!isToday && (
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 text-sm font-semibold transition-all"
          >
            Today
          </button>
        )}

        <button
          onClick={handleNextDay}
          className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 border border-slate-600/50 text-sm font-medium transition-colors flex items-center gap-1"
          title="Next Day"
        >
          <span className="hidden sm:inline">Next</span>
          <span>▶</span>
        </button>

        {/* Quick Date Picker */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
          className="bg-slate-700/80 border border-slate-600/50 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default DateStrip;
