// Pure utility functions for date calculations, formatting, and streak tracking

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Formats a timestamp or ISO string into 12-hour time format (e.g. "10:30 AM")
 */
export const formatTaskTime = (timestampOrIso) => {
  if (!timestampOrIso) return "";
  try {
    const d = new Date(timestampOrIso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

/**
 * Formats a YYYY-MM-DD string into a human-readable title (e.g. "Today, Oct 12" or "Wed, Oct 12, 2026")
 */
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const today = getTodayDateString();
  
  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = `${tomorrowDate.getFullYear()}-${String(tomorrowDate.getMonth() + 1).padStart(2, "0")}-${String(tomorrowDate.getDate()).padStart(2, "0")}`;

  const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" };
  const formatted = dateObj.toLocaleDateString(undefined, options);

  if (dateStr === today) {
    return `Today (${dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" })})`;
  } else if (dateStr === yesterdayStr) {
    return `Yesterday (${dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" })})`;
  } else if (dateStr === tomorrowStr) {
    return `Tomorrow (${dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" })})`;
  }

  return formatted;
};

/**
 * Shifts a YYYY-MM-DD date by offsetDays (+1, -1, etc.)
 */
export const shiftDate = (dateStr, offsetDays) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + offsetDays);
  const newYear = d.getFullYear();
  const newMonth = String(d.getMonth() + 1).padStart(2, "0");
  const newDay = String(d.getDate()).padStart(2, "0");
  return `${newYear}-${newMonth}-${newDay}`;
};

/**
 * Generates days grid for a calendar given a year and month (0-indexed month)
 */
export const getCalendarMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const totalDays = lastDay.getDate();

  const days = [];

  // Padding days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    days.push({
      dateStr: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`,
      dayNumber: dayNum,
      isCurrentMonth: false,
    });
  }

  // Days of current month
  for (let i = 1; i <= totalDays; i++) {
    days.push({
      dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      dayNumber: i,
      isCurrentMonth: true,
    });
  }

  // Padding days for next month to complete the 35 or 42 grid
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    days.push({
      dateStr: `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      dayNumber: i,
      isCurrentMonth: false,
    });
  }

  return days;
};

/**
 * Calculates current streak (consecutive days ending today or yesterday where all tasks were completed, with at least 1 task)
 */
export const calculateStreak = (todos) => {
  if (!todos || todos.length === 0) return 0;

  // Group tasks by date
  const dateMap = {};
  todos.forEach((t) => {
    if (!dateMap[t.date]) {
      dateMap[t.date] = { total: 0, completed: 0 };
    }
    dateMap[t.date].total += 1;
    if (t.completed) dateMap[t.date].completed += 1;
  });

  const today = getTodayDateString();
  let streak = 0;
  let checkDate = today;

  // If today has tasks and not all are completed yet, check if yesterday was full
  const todayStats = dateMap[today];
  if (!todayStats || todayStats.completed !== todayStats.total) {
    checkDate = shiftDate(today, -1);
  }

  while (true) {
    const stats = dateMap[checkDate];
    if (stats && stats.total > 0 && stats.completed === stats.total) {
      streak += 1;
      checkDate = shiftDate(checkDate, -1);
    } else {
      break;
    }
  }

  return streak;
};
