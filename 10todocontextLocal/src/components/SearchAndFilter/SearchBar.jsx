import React from "react";
import { useTodo } from "../../contexts";

function SearchBar() {
  const {
    searchQuery,
    setSearchQuery,
    searchScope,
    setSearchScope,
    statusFilter,
    setStatusFilter,
    selectedDate,
  } = useTodo();

  return (
    <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 border border-slate-700/60 shadow-lg flex flex-col gap-3 text-slate-100">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder={
            searchScope === "all"
              ? "Search tasks across all dates..."
              : `Search tasks for ${selectedDate}...`
          }
          className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 text-xs text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter and Scope Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Scope Toggle */}
        <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-700/50">
          <button
            type="button"
            onClick={() => setSearchScope("current")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              searchScope === "current"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            This Day
          </button>
          <button
            type="button"
            onClick={() => setSearchScope("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              searchScope === "all"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All History
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1">
          {["all", "active", "completed"].map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              onClick={() => setStatusFilter(filterKey)}
              className={`px-2.5 py-1 rounded-xl capitalize font-medium transition-all border ${
                statusFilter === filterKey
                  ? "bg-slate-700 text-indigo-300 border-indigo-500/40 shadow-sm"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {filterKey}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
