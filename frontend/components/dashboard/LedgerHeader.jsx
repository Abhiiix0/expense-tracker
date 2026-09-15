"use client";

import { monthLabelFromKey } from "./constants";

function NavArrow({ direction, onClick, disabled, label }) {
  const d = direction === "prev" ? "M6.5 1.5L2.5 5l4 3.5" : "M3.5 1.5l4 3.5-4 3.5";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[3px] border border-rule-strong text-ink-soft hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-rule-strong disabled:hover:text-ink-soft"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </button>
  );
}

export default function LedgerHeader({ month, onPrevMonth, onNextMonth, canGoNext, entriesLine }) {
  const monthLabel = month ? monthLabelFromKey(month) : "";

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <p className="text-[13px] text-ink-soft">Your ledger</p>
        <div className="mt-1 flex items-center gap-2">
          <NavArrow direction="prev" onClick={onPrevMonth} label="Previous month" />
          <h1 className="font-editorial text-[clamp(1.6rem,6vw,2.9rem)] leading-tight italic">
            {monthLabel}
          </h1>
          <NavArrow direction="next" onClick={onNextMonth} disabled={!canGoNext} label="Next month" />
        </div>
      </div>
      {entriesLine && <p className="text-[13px] text-ink-soft">{entriesLine}</p>}
    </div>
  );
}
