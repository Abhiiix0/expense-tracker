const OPENING = 3200;
const MONTH_LABEL = "March 2026";
const DAYS_IN_MONTH = 31;

const CATEGORIES = {
  rent: { label: "Rent", color: "var(--color-cat-rent)", limit: 1350 },
  groceries: { label: "Groceries", color: "var(--color-cat-groceries)", limit: 500 },
  dining: { label: "Eating out", color: "var(--color-cat-dining)", limit: 220 },
  transit: { label: "Transit", color: "var(--color-cat-transit)", limit: 120 },
  other: { label: "Other", color: "var(--color-cat-misc)", limit: 250 },
  subs: { label: "Subscriptions", color: "var(--color-cat-subs)", limit: 60 },
};

const RAW = [
  { day: 1, desc: "Rent", cat: "rent", amount: 1350 },
  { day: 2, desc: "Rye House coffee", cat: "dining", amount: 4.75 },
  { day: 3, desc: "Greenmarket groceries", cat: "groceries", amount: 82.1 },
  { day: 4, desc: "Transit card top-up", cat: "transit", amount: 33 },
  { day: 5, desc: "Electric bill", cat: "other", amount: 88.4 },
  { day: 6, desc: "Figma subscription", cat: "subs", amount: 15 },
  { day: 8, desc: "Dinner at Lupa", cat: "dining", amount: 58 },
  { day: 9, desc: "Trader Joe's", cat: "groceries", amount: 116.4 },
  { day: 11, desc: "Phone bill", cat: "other", amount: 55 },
  { day: 13, desc: "Pharmacy", cat: "other", amount: 21.4 },
  { day: 15, desc: "Ramen, Ippudo", cat: "dining", amount: 41 },
  { day: 17, desc: "Haircut", cat: "other", amount: 45 },
  { day: 20, desc: "Rideshare, airport", cat: "transit", amount: 47 },
  { day: 22, desc: "Costco run", cat: "groceries", amount: 168 },
  { day: 24, desc: "Spotify + NYT", cat: "subs", amount: 36.99 },
  { day: 26, desc: "Dinner, Cosme", cat: "dining", amount: 149.5 },
];

const money = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---- derived, computed once at module load ----
let running = OPENING;
const ENTRIES = RAW.map((e) => {
  running -= e.amount;
  return { ...e, date: `Mar ${e.day}`, balance: running };
});
const CLOSING = running;
const SPENT = OPENING - CLOSING;

const totalsByCat = {};
const countsByCat = {};
for (const e of RAW) {
  totalsByCat[e.cat] = (totalsByCat[e.cat] ?? 0) + e.amount;
  countsByCat[e.cat] = (countsByCat[e.cat] ?? 0) + 1;
}
const BREAKDOWN = Object.keys(CATEGORIES)
  .map((key) => ({ key, amount: totalsByCat[key] ?? 0 }))
  .sort((a, b) => b.amount - a.amount);

const LARGEST = RAW.reduce((max, e) => (e.amount > max.amount ? e : max));
const MOST_FREQUENT = Object.entries(countsByCat).sort((a, b) => b[1] - a[1])[0];
const AVG_PER_DAY = SPENT / DAYS_IN_MONTH;
const DAYS_LOGGED = new Set(RAW.map((e) => e.day)).size;

const GLANCE = [
  { label: "Largest entry", value: `${CATEGORIES[LARGEST.cat].label}, $${money(LARGEST.amount)}` },
  {
    label: "Most entries",
    value: `${CATEGORIES[MOST_FREQUENT[0]].label} (${MOST_FREQUENT[1]})`,
  },
  { label: "Average per day", value: `$${money(AVG_PER_DAY)}` },
  { label: "Days with an entry", value: `${DAYS_LOGGED} of ${DAYS_IN_MONTH}` },
];

const SUMMARY = [
  { label: "Opening balance", value: `$${money(OPENING)}` },
  { label: `Spent in ${MONTH_LABEL.split(" ")[0]}`, value: `−$${money(SPENT)}`, muted: true },
  { label: "Closing balance", value: `$${money(CLOSING)}` },
  { label: "Entries", value: String(RAW.length) },
];

function Dot({ color }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export default function DashboardView() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="text-[13px] text-ink-soft">Your ledger</p>
          <h1 className="mt-1 font-editorial text-[clamp(1.9rem,4vw,2.9rem)] leading-tight italic">
            {MONTH_LABEL}
          </h1>
        </div>
        <p className="text-[13px] text-ink-soft">
          {RAW.length} entries, last added {ENTRIES[ENTRIES.length - 1].date}
        </p>
      </div>

      {/* Reconciled summary */}
      <dl className="mt-6 grid grid-cols-2 border border-t-2 border-rule-strong border-t-ink sm:grid-cols-4">
        {SUMMARY.map((item, i) => (
          <div
            key={item.label}
            className={
              "border-rule px-5 py-5 " +
              (i % 2 === 1 ? "border-l " : "") +
              (i >= 2 ? "border-t sm:border-t-0 " : "") +
              (i >= 1 ? "sm:border-l" : "")
            }
          >
            <dt className="text-[12px] text-ink-soft">{item.label}</dt>
            <dd
              className={
                "figure mt-1 text-[20px] font-semibold " +
                (item.muted ? "text-margin" : "text-ink")
              }
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Main column */}
        <div>
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="font-editorial text-[clamp(1.4rem,3vw,1.9rem)] leading-tight italic">
                Where the month went
              </h2>
              <span className="figure text-[14px] text-ink-soft">
                ${money(SPENT)} in all
              </span>
            </div>

            <div className="mt-5 flex h-10 w-full overflow-hidden rounded-[3px] border border-rule-strong">
              {BREAKDOWN.map((seg, i) => (
                <div
                  key={seg.key}
                  title={`${CATEGORIES[seg.key].label}, $${money(seg.amount)}`}
                  className="basis-0"
                  style={{
                    flexGrow: seg.amount,
                    minWidth: 6,
                    backgroundColor: CATEGORIES[seg.key].color,
                    borderLeft: i === 0 ? undefined : "2px solid var(--color-paper)",
                  }}
                />
              ))}
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {BREAKDOWN.map((seg) => {
                const pct = Math.round((seg.amount / SPENT) * 100);
                return (
                  <div
                    key={seg.key}
                    className="flex items-baseline justify-between gap-3 border-b border-rule py-2.5"
                  >
                    <dt className="flex items-center gap-2 text-[14px]">
                      <Dot color={CATEGORIES[seg.key].color} />
                      {CATEGORIES[seg.key].label}
                    </dt>
                    <dd className="figure text-[14px] text-ink-soft">
                      ${money(seg.amount)}
                      <span className="ml-2 text-ink-soft/60">{pct}%</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <section className="mt-10">
            <h2 className="font-editorial text-[clamp(1.4rem,3vw,1.9rem)] leading-tight italic">
              Every entry
            </h2>

            <div className="mt-4 border border-t-2 border-l-2 border-rule-strong border-t-ink border-l-margin">
              <div className="overflow-x-auto">
                <div className="relative sm:min-w-155">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-12 w-px bg-margin/55 sm:left-14"
                  />
                  <table className="w-full border-collapse text-left text-[13.5px]">
                    <caption className="sr-only">
                      Every expense logged in {MONTH_LABEL}, with a running
                      balance in the final column.
                    </caption>
                    <thead>
                      <tr className="border-b border-rule text-[11.5px] font-semibold text-ink-soft">
                        <th scope="col" className="py-2.5 pr-3 pl-0 font-semibold">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-2.5 font-semibold">
                          Description
                        </th>
                        <th
                          scope="col"
                          className="hidden px-3 py-2.5 font-semibold sm:table-cell"
                        >
                          Category
                        </th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="py-2.5 pr-4 pl-3 text-right font-semibold"
                        >
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ENTRIES.map((e, i) => {
                        const cat = CATEGORIES[e.cat];
                        return (
                          <tr
                            key={e.date + e.desc}
                            className={
                              "border-b border-rule last:border-b-0 " +
                              (i % 2 === 1 ? "bg-field/60" : "")
                            }
                          >
                            <th
                              scope="row"
                              className="py-2.5 pr-3 pl-0 align-top font-normal whitespace-nowrap text-ink-soft"
                            >
                              {e.date}
                            </th>
                            <td className="px-3 py-2.5 align-top">{e.desc}</td>
                            <td className="hidden px-3 py-2.5 align-top whitespace-nowrap text-ink-soft sm:table-cell">
                              <span className="inline-flex items-center gap-2">
                                <Dot color={cat.color} />
                                {cat.label}
                              </span>
                            </td>
                            <td className="figure px-3 py-2.5 text-right align-top whitespace-nowrap">
                              &minus;{money(e.amount)}
                            </td>
                            <td className="figure py-2.5 pr-4 pl-3 text-right align-top font-semibold whitespace-nowrap">
                              {money(e.balance)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-strong px-4 py-3 text-[13px] text-ink-soft">
                <span>{RAW.length} entries this month</span>
                <span className="figure">
                  Spent{" "}
                  <span className="font-semibold text-ink">${money(SPENT)}</span>
                  <span className="mx-2 text-rule-strong">|</span>
                  Balance{" "}
                  <span className="font-semibold text-ink">${money(CLOSING)}</span>
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-9 lg:sticky lg:top-20 lg:self-start">
          <section>
            <h2 className="font-editorial text-[1.25rem] leading-tight italic">
              At a glance
            </h2>
            <dl className="mt-3 border-t-2 border-t-ink">
              {GLANCE.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-3 border-b border-rule py-2.5"
                >
                  <dt className="text-[13px] text-ink-soft">{row.label}</dt>
                  <dd className="figure text-right text-[13px] text-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-editorial text-[1.25rem] leading-tight italic">
              Budgets
            </h2>
            <ul className="mt-3 space-y-3.5">
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const spent = totalsByCat[key] ?? 0;
                const pct = (spent / cat.limit) * 100;
                const over = spent > cat.limit;
                return (
                  <li key={key}>
                    <div className="flex items-baseline justify-between gap-2 text-[13px]">
                      <span className="flex items-center gap-2">
                        <Dot color={cat.color} />
                        {cat.label}
                      </span>
                      <span className="figure text-ink-soft">
                        ${money(spent)}
                        <span className="text-ink-soft/60"> / ${money(cat.limit)}</span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-rule">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, pct)}%`,
                          backgroundColor: over ? "var(--color-margin)" : cat.color,
                        }}
                      />
                    </div>
                    {over ? (
                      <p className="mt-1 text-[12px] text-margin">
                        ${money(spent - cat.limit)} over
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>

      <footer className="mt-12 border-t border-rule pt-5 text-[12px] text-ink-soft">
        Tally keeps your records; it doesn&rsquo;t move your money. Figures on this
        page are a sample month.
      </footer>
    </main>
  );
}
