import React, { useState } from "react";
import { useTodo } from "../../contexts";
import { getCalendarMonthDays, getTodayDateString } from "../../utils/dateUtils";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function CalendarView() {
  const { todos, selectedDate, setSelectedDate } = useTodo();
  const todayStr = getTodayDateString();

  // Selected month state
  const selectedDateObj = selectedDate ? new Date(selectedDate + "T00:00:00") : new Date();
  const [currentYear, setCurrentYear] = useState(selectedDateObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDateObj.getMonth());

  // Quick lookup map for task completion stats per date
  const taskStatsByDate = React.useMemo(() => {
    const map = {};
    todos.forEach((t) => {
      if (!t.date) return;
      if (!map[t.date]) {
        map[t.date] = { total: 0, completed: 0 };
      }
      map[t.date].total += 1;
      if (t.completed) map[t.date].completed += 1;
    });
    return map;
  }, [todos]);

  const daysGrid = React.useMemo(() => {
    return getCalendarMonthDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/60 shadow-xl text-slate-100">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">
            {MONTH_NAMES[currentMonth]} <span className="text-slate-400 font-normal">{currentYear}</span>
          </h2>
          <p className="text-xs text-slate-400">Click any date to see history</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleJumpToToday}
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-colors font-medium"
            title="Jump to Today"
          >
            Today
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Previous Month"
          >
            ◀
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Next Month"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="text-xs font-semibold text-slate-400 py-1">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysGrid.map((day) => {
          const isSelected = day.dateStr === selectedDate;
          const isToday = day.dateStr === todayStr;
          const stats = taskStatsByDate[day.dateStr];

          // Determine dot color
          let statusBadge = null;
          if (stats && stats.total > 0) {
            if (stats.completed === stats.total) {
              statusBadge = <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" title={`${stats.completed}/${stats.total} completed`} />;
            } else if (stats.completed > 0) {
              statusBadge = <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" title={`${stats.completed}/${stats.total} completed`} />;
            } else {
              statusBadge = <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80" title={`0/${stats.total} completed`} />;
            }
          }

          return (
            <button
              key={day.dateStr}
              onClick={() => setSelectedDate(day.dateStr)}
              className={`relative flex flex-col items-center justify-center h-10 rounded-xl transition-all duration-150 text-sm font-medium ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400"
                  : isToday
                  ? "bg-slate-700/80 text-indigo-300 border border-indigo-500/50 hover:bg-slate-700"
                  : day.isCurrentMonth
                  ? "text-slate-200 hover:bg-slate-700/60"
                  : "text-slate-600 hover:bg-slate-800/40"
              }`}
            >
              <span>{day.dayNumber}</span>
              <div className="h-1.5 flex items-center justify-center mt-0.5">
                {statusBadge}
              </div>
            </button>
          );
        })}
      </div>

      {/* Activity Legend */}
      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-around text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
