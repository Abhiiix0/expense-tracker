import Dot from "./Dot";
import IconButton from "./IconButton";
import { CATEGORIES, money, shortDate } from "./constants";

export default function EntriesTable({ entries, totalSpent, closing, totalCount, onEdit, onDelete }) {
  return (
    <section className="mt-10">
      <h2 className="font-editorial text-[clamp(1.3rem,4vw,1.9rem)] leading-tight italic">
        Every entry
      </h2>

      <div className="mt-4 border border-t-2 border-l-2 border-rule-strong border-t-ink border-l-margin">
        <div className="overflow-x-auto">
          <div className="relative min-w-[560px] sm:min-w-155">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-14 w-px bg-margin/55 sm:left-16"
            />
            <table className="w-full border-collapse text-left text-[13.5px]">
              <caption className="sr-only">
                Every expense logged, with a running balance in the final column.
              </caption>
              <thead>
                <tr className="border-b border-rule text-[11.5px] font-semibold text-ink-soft">
                  <th scope="col" className="py-2.5 pr-3 pl-2 font-semibold">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-2.5 font-semibold">
                    Description
                  </th>
                  <th scope="col" className="hidden px-3 py-2.5 font-semibold sm:table-cell">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                    Amount
                  </th>
                  <th scope="col" className="py-2.5 pr-3 pl-3 text-right font-semibold">
                    Balance
                  </th>
                  <th scope="col" className="py-2.5 pr-4 pl-3 font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => {
                  const cat = CATEGORIES[e.category];
                  const desc = e.note || cat?.label || "Untitled";
                  const entry = {
                    id: e._id,
                    type: e.type,
                    amount: e.amount,
                    category: e.category,
                    date: e.date ? e.date.slice(0, 10) : "",
                    note: e.note,
                  };
                  return (
                    <tr
                      key={e._id}
                      className={
                        "group border-b border-rule last:border-b-0 " +
                        (i % 2 === 1 ? "bg-field/60" : "")
                      }
                    >
                      <th
                        scope="row"
                        className="py-2.5 pr-3 pl-2 align-top font-normal whitespace-nowrap text-ink-soft"
                      >
                        {shortDate(e.date)}
                      </th>
                      <td className="px-3 py-2.5 align-top">{desc}</td>
                      <td className="hidden px-3 py-2.5 align-top whitespace-nowrap text-ink-soft sm:table-cell">
                        <span className="inline-flex items-center gap-2">
                          <Dot color={cat?.color} />
                          {cat?.label ?? e.category}
                        </span>
                      </td>
                      <td
                        className={
                          "figure px-3 py-2.5 text-right align-top whitespace-nowrap " +
                          (e.type === "income" ? "text-[var(--color-credit)]" : "")
                        }
                      >
                        {e.type === "income" ? "+" : "−"}
                        {money(e.amount)}
                      </td>
                      <td className="figure py-2.5 pr-3 pl-3 text-right align-top font-semibold whitespace-nowrap">
                        {money(e.balance)}
                      </td>
                      <td className="py-2.5 pr-4 pl-3 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                          <IconButton
                            label={`Edit ${desc}`}
                            onClick={() => onEdit(entry)}
                            hoverClass="hover:text-ink"
                          >
                            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                              <path
                                d="M9.5 1.5l3 3-7 7-3.5 1 1-3.5 6.5-6.5z"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinejoin="round"
                                fill="none"
                              />
                            </svg>
                          </IconButton>
                          <IconButton
                            label={`Delete ${desc}`}
                            onClick={() => onDelete(entry)}
                            hoverClass="hover:text-margin"
                          >
                            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                              <path
                                d="M2.5 3.5h9M5 3.5V2h4v1.5M5.5 6.5v4M8.5 6.5v4M3.5 3.5l.5 8.5h6l.5-8.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              />
                            </svg>
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-strong px-4 py-3 text-[13px] text-ink-soft">
          <span>{totalCount} entries</span>
          <span className="figure">
            Spent <span className="font-semibold text-ink">${money(totalSpent)}</span>
            <span className="mx-2 text-rule-strong">|</span>
            Balance <span className="font-semibold text-ink">${money(closing)}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
