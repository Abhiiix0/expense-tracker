"use client";

import LedgerHeader from "./dashboard/LedgerHeader";
import SummaryStrip from "./dashboard/SummaryStrip";
import CategoryBreakdown from "./dashboard/CategoryBreakdown";
import EntriesTable from "./dashboard/EntriesTable";
import AtAGlance from "./dashboard/AtAGlance";
import { CATEGORIES, money, shortDate } from "./dashboard/constants";

export default function DashboardView({
  onEdit = () => {},
  onDelete = () => {},
  data,
  month,
  onPrevMonth = () => {},
  onNextMonth = () => {},
  canGoNext = false,
}) {
  if (!data) {
    return (
      <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-5 py-10 sm:px-8">
        <LedgerHeader month={month} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} canGoNext={canGoNext} />
        <p className="mt-6 text-[14px] text-ink-soft">Loading your ledger…</p>
      </main>
    );
  }

  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const entries = sorted.reduce((acc, e) => {
    const prevBalance = acc.length ? acc[acc.length - 1].balance : 0;
    const balance = prevBalance + (e.type === "income" ? e.amount : -e.amount);
    return [...acc, { ...e, balance }];
  }, []);

  const closing = entries.length ? entries[entries.length - 1].balance : 0;
  const totalIncome = data
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = data
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalsByCat = {};
  const countsByCat = {};
  for (const e of data) {
    if (e.type !== "expense") continue;
    totalsByCat[e.category] = (totalsByCat[e.category] ?? 0) + e.amount;
    countsByCat[e.category] = (countsByCat[e.category] ?? 0) + 1;
  }
  const breakdown = Object.keys(CATEGORIES)
    .map((key) => ({ key, amount: totalsByCat[key] ?? 0 }))
    .filter((seg) => seg.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const expenseEntries = data.filter((e) => e.type === "expense");
  const largest = expenseEntries.length
    ? expenseEntries.reduce((max, e) => (e.amount > max.amount ? e : max))
    : null;
  const mostFrequent = Object.entries(countsByCat).sort((a, b) => b[1] - a[1])[0];
  const daysLogged = new Set(data.map((e) => e.date.slice(0, 10))).size;
  const avgPerDay = daysLogged ? totalSpent / daysLogged : 0;

  const glance = [
    largest && {
      label: "Largest expense",
      value: `${CATEGORIES[largest.category].label}, $${money(largest.amount)}`,
    },
    mostFrequent && {
      label: "Most entries",
      value: `${CATEGORIES[mostFrequent[0]].label} (${mostFrequent[1]})`,
    },
    { label: "Average per day", value: `$${money(avgPerDay)}` },
    { label: "Days with an entry", value: String(daysLogged) },
  ].filter(Boolean);

  const summary = [
    { label: "Total income", value: `$${money(totalIncome)}` },
    { label: "Total spent", value: `−$${money(totalSpent)}`, muted: true },
    { label: "Balance", value: `$${money(closing)}` },
    { label: "Entries", value: String(data.length) },
  ];

  const entriesLine =
    entries.length > 0
      ? `${data.length} entries, last added ${shortDate(entries[entries.length - 1].date)}`
      : null;

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <LedgerHeader
        month={month}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        canGoNext={canGoNext}
        entriesLine={entriesLine}
      />

      <SummaryStrip items={summary} />

      {data.length === 0 ? (
        <p className="mt-10 text-[14px] text-ink-soft">
          No entries yet. Add your first expense to get started.
        </p>
      ) : (
        <div className="mt-9 grid min-w-0 gap-9 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <CategoryBreakdown breakdown={breakdown} totalSpent={totalSpent} />
            <EntriesTable
              entries={entries}
              totalSpent={totalSpent}
              closing={closing}
              totalCount={data.length}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>

          <aside className="space-y-9 lg:sticky lg:top-20 lg:self-start">
            <AtAGlance items={glance} />
          </aside>
        </div>
      )}

      <footer className="mt-12 border-t border-rule pt-5 text-[12px] text-ink-soft">
        Tally keeps your records; it doesn&rsquo;t move your money.
      </footer>
    </main>
  );
}
