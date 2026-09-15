import type { CSSProperties } from "react";
import LandingAuthLinks from "./LandingAuthLinks";

type CatKey =
  | "Food"
  | "Transport"
  | "Bills"
  | "Shopping"
  | "Health"
  | "Entertainment"
  | "Other";

const CATEGORIES: Record<CatKey, { label: string; color: string }> = {
  Food: { label: "Food", color: "var(--color-cat-food)" },
  Transport: { label: "Transport", color: "var(--color-cat-transport)" },
  Bills: { label: "Bills", color: "var(--color-cat-bills)" },
  Shopping: { label: "Shopping", color: "var(--color-cat-shopping)" },
  Health: { label: "Health", color: "var(--color-cat-health)" },
  Entertainment: {
    label: "Entertainment",
    color: "var(--color-cat-entertainment)",
  },
  Other: { label: "Other", color: "var(--color-cat-other)" },
};

type Entry = {
  date: string;
  desc: string;
  cat: CatKey | null;
  amount: number | null;
  balance: number;
};

const LEDGER: Entry[] = [
  {
    date: "Mar 1",
    desc: "Opening balance",
    cat: null,
    amount: null,
    balance: 3200,
  },
  {
    date: "Mar 2",
    desc: "Rye House coffee",
    cat: "Food",
    amount: 4.75,
    balance: 3195.25,
  },
  {
    date: "Mar 3",
    desc: "Greenmarket, week's groceries",
    cat: "Shopping",
    amount: 82.1,
    balance: 3113.15,
  },
  {
    date: "Mar 4",
    desc: "Transit card top-up",
    cat: "Transport",
    amount: 33,
    balance: 3080.15,
  },
  {
    date: "Mar 6",
    desc: "Figma, monthly",
    cat: "Entertainment",
    amount: 15,
    balance: 3065.15,
  },
  {
    date: "Mar 7",
    desc: "Pharmacy",
    cat: "Health",
    amount: 21.4,
    balance: 3043.75,
  },
  {
    date: "Mar 8",
    desc: "Dinner at Lupa",
    cat: "Food",
    amount: 58,
    balance: 2985.75,
  },
];

const BREAKDOWN: { key: CatKey; amount: number }[] = [
  { key: "Bills", amount: 1350 },
  { key: "Shopping", amount: 520 },
  { key: "Other", amount: 419 },
  { key: "Food", amount: 410 },
  { key: "Transport", amount: 145 },
  { key: "Entertainment", amount: 96 },
];
const MONTH_TOTAL = 2940;

const STEPS = [
  {
    n: 1,
    title: "Log it",
    body: "Type the amount and a word or two. Tally stamps the date and drops the entry at the top of the month.",
  },
  {
    n: 2,
    title: "Sort it",
    body: "Give it a category, or let the last one carry over. A new category takes one keystroke to make.",
  },
  {
    n: 3,
    title: "Read it back",
    body: "Open the month and the column adds itself up. Nothing to import, nothing to reconcile.",
  },
];

const INSIDE = [
  {
    term: "Running balance",
    def: "Every entry carries the balance forward in the next column, the way a paper checkbook register does.",
  },
  {
    term: "Income and expenses together",
    def: "Log what comes in alongside what goes out, so the balance reflects the whole picture, not just spending.",
  },
  {
    term: "Seven categories, ready to go",
    def: "Food, transport, bills, shopping, health, entertainment, other. File an entry in a keystroke, no setup first.",
  },
  {
    term: "Edit or delete anytime",
    def: "Fixed a typo or logged the wrong amount? Change or remove any entry, any time.",
  },
];

const SUMMARY: { label: string; value: string; muted?: boolean }[] = [
  { label: "Opening balance", value: "$3,200.00" },
  { label: "Spent in March", value: "−$214.25", muted: true },
  { label: "Closing balance", value: "$2,985.75" },
  { label: "Entries", value: "6" },
];

const money = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function TallyMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 20) / 26}
      viewBox="0 0 26 20"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="var(--color-margin)" strokeWidth="2" strokeLinecap="round">
        <path d="M3 3v14M8.5 3v14M14 3v14M19.5 3v14" />
        <path d="M1.5 16.5 21.5 3.5" />
      </g>
    </svg>
  );
}

function StartButton({
  label = "Start your ledger",
  href = "/signup",
  className = "",
}: {
  label?: string;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={
        "inline-flex items-center justify-center rounded-[3px] bg-margin px-4 py-2.5 text-[14px] font-bold whitespace-nowrap text-white transition-colors hover:bg-margin-deep focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none " +
        className
      }
    >
      {label}
    </a>
  );
}

const LandingPage = () => {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-margin/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5">
            <TallyMark />
            <span className="text-[17px] font-bold tracking-[-0.01em]">
              Tally
            </span>
          </a>
          <nav className="flex items-center gap-4 text-[14px] sm:gap-6">
            <a
              href="#inside"
              className="hidden text-ink-soft hover:text-ink sm:inline"
            >
              What&rsquo;s inside
            </a>
            <LandingAuthLinks />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section
          id="top"
          className="mx-auto w-full max-w-5xl px-6 pt-16 pb-14 sm:pt-24 sm:pb-20"
        >
          <p className="text-[13px] text-ink-soft">A personal expense ledger</p>
          <h1 className="mt-4 max-w-[15ch] font-editorial text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.04] font-normal tracking-[-0.01em] italic">
            Keep an honest account of where your money goes.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-ink-soft">
            Tally is a plain expense ledger &mdash; no budgets to configure, no
            bank connection required. Write down what you spend in a few
            seconds, file it under a category, and read the month back like a
            statement.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <StartButton />
            <a
              href="#sample"
              className="text-[15px] underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
            >
              See a sample month
            </a>
          </div>
          <p className="mt-4 text-[13px] text-ink-soft">
            Free while in beta. No card, and no bank connection required.
          </p>

          {/* The centerpiece: a working sample ledger */}
          <figure id="sample" className="mt-14 scroll-mt-10 sm:mt-16">
            <figcaption className="flex items-baseline justify-between gap-4 pb-2 text-[13px] text-ink-soft">
              <span>Sample month, March 2026</span>
              <span className="hidden sm:inline">
                Balance carried in the last column
              </span>
            </figcaption>
            <div className="border border-t-2 border-rule-strong border-t-ink">
              <div className="overflow-x-auto">
                <div className="relative sm:min-w-165">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-12 w-px bg-margin/55 sm:left-14"
                  />
                  <table className="w-full border-collapse text-left text-[13.5px]">
                    <caption className="sr-only">
                      Seven entries for March 2026, each showing the date,
                      description, category, amount spent, and the balance
                      remaining afterward.
                    </caption>
                    <thead>
                      <tr className="border-b border-rule text-[11.5px] font-semibold text-ink-soft">
                        <th
                          scope="col"
                          className="py-2.5 pr-3 pl-0 font-semibold"
                        >
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
                        <th
                          scope="col"
                          className="px-3 py-2.5 text-right font-semibold"
                        >
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
                      {LEDGER.map((e, i) => {
                        const cat = e.cat ? CATEGORIES[e.cat] : null;
                        const last = i === LEDGER.length - 1;
                        return (
                          <tr
                            key={e.date + e.desc}
                            className={
                              "post-in border-b border-rule last:border-b-0 " +
                              (i % 2 === 1 ? "bg-field/60 " : "")
                            }
                            style={
                              {
                                animationDelay: `${0.15 + i * 0.07}s`,
                              } as CSSProperties
                            }
                          >
                            <th
                              scope="row"
                              className="py-3 pr-3 pl-0 align-top font-normal whitespace-nowrap text-ink-soft"
                            >
                              {e.date}
                            </th>
                            <td
                              className={
                                "px-3 py-3 align-top " +
                                (e.cat ? "" : "text-ink-soft italic")
                              }
                            >
                              {e.desc}
                            </td>
                            <td className="hidden px-3 py-3 align-top whitespace-nowrap text-ink-soft sm:table-cell">
                              {cat ? (
                                <span className="inline-flex items-center gap-2">
                                  <span
                                    aria-hidden="true"
                                    className="inline-block h-2 w-2 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                  />
                                  {cat.label}
                                </span>
                              ) : (
                                <span className="text-rule-strong">
                                  &mdash;
                                </span>
                              )}
                            </td>
                            <td className="figure px-3 py-3 text-right align-top whitespace-nowrap">
                              {e.amount === null ? (
                                <span className="text-rule-strong">
                                  &mdash;
                                </span>
                              ) : (
                                <>&minus;{money(e.amount)}</>
                              )}
                            </td>
                            <td className="figure py-3 pr-4 pl-3 text-right align-top font-semibold whitespace-nowrap">
                              {last ? (
                                <span className="balance-settle -mx-1 rounded-[2px] px-1">
                                  {money(e.balance)}
                                </span>
                              ) : (
                                money(e.balance)
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-rule-strong px-4 py-3 text-[13px] text-ink-soft">
                <span>7 entries so far</span>
                <span className="figure">
                  Closing balance{" "}
                  <span className="ml-2 text-[15px] font-semibold text-ink">
                    $2,985.75
                  </span>
                </span>
              </div>
            </div>
          </figure>
        </section>

        {/* Where the month went */}
        <section className="border-t border-rule">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="font-editorial text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight italic">
                Where the month went
              </h2>
              <span className="figure text-[15px] text-ink-soft">
                ${money(MONTH_TOTAL)} in all
              </span>
            </div>

            <div className="mt-7 flex h-11 w-full overflow-hidden rounded-[3px] border border-rule-strong">
              {BREAKDOWN.map((seg, i) => (
                <div
                  key={seg.key}
                  title={`${CATEGORIES[seg.key].label}, $${money(seg.amount)}`}
                  className="basis-0"
                  style={{
                    flexGrow: seg.amount,
                    minWidth: 6,
                    backgroundColor: CATEGORIES[seg.key].color,
                    borderLeft:
                      i === 0 ? undefined : "2px solid var(--color-paper)",
                  }}
                />
              ))}
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-3">
              {BREAKDOWN.map((seg) => (
                <div
                  key={seg.key}
                  className="flex items-baseline justify-between gap-3 border-b border-rule py-2.5"
                >
                  <dt className="flex items-center gap-2 text-[14px] whitespace-nowrap">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: CATEGORIES[seg.key].color }}
                    />
                    {CATEGORIES[seg.key].label}
                  </dt>
                  <dd className="figure text-[14px] text-ink-soft">
                    ${money(seg.amount)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Three steps */}
        <section className="border-t border-rule">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
            <h2 className="font-editorial text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight italic">
              Three steps, then it runs itself
            </h2>
            <ol className="mt-8 border-t-2 border-t-ink">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-1 border-b border-rule py-5 sm:grid-cols-[3.5rem_13rem_1fr] sm:gap-x-8"
                >
                  <span className="figure text-[15px] font-semibold text-margin">
                    {s.n}
                  </span>
                  <h3 className="text-[16px] font-semibold">{s.title}</h3>
                  <p className="col-span-2 max-w-[58ch] text-[15px] leading-[1.6] text-ink-soft sm:col-span-1">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What's in the ledger */}
        <section id="inside" className="scroll-mt-10 border-t border-rule">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
            <h2 className="font-editorial text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight italic">
              What&rsquo;s in the ledger
            </h2>
            <dl className="mt-8 border-t-2 border-t-ink">
              {INSIDE.map((e) => (
                <div
                  key={e.term}
                  className="grid gap-x-8 gap-y-1 border-b border-rule py-5 sm:grid-cols-[16rem_1fr]"
                >
                  <dt className="text-[16px] font-semibold">{e.term}</dt>
                  <dd className="max-w-[60ch] text-[15px] leading-[1.6] text-ink-soft">
                    {e.def}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Reconciled summary + closing call to action */}
        <section id="start" className="scroll-mt-10 border-t border-rule">
          <div className="mx-auto w-full max-w-5xl px-6 py-14 sm:py-20">
            <div className="border border-t-2 border-rule-strong border-t-ink">
              <p className="border-b border-rule px-5 py-3 text-[13px] text-ink-soft">
                The sample month, reconciled
              </p>
              <dl className="grid grid-cols-2 sm:grid-cols-4">
                {SUMMARY.map((s, i) => (
                  <div
                    key={s.label}
                    className={
                      "border-rule px-5 py-6 " +
                      (i % 2 === 1 ? "border-l " : "") +
                      (i >= 2 ? "border-t sm:border-t-0 " : "") +
                      (i >= 1 ? "sm:border-l" : "")
                    }
                  >
                    <dt className="text-[13px] text-ink-soft">{s.label}</dt>
                    <dd
                      className={
                        "figure mt-1.5 text-[22px] font-semibold " +
                        (s.muted ? "text-margin" : "")
                      }
                    >
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[20ch] font-editorial text-[clamp(1.5rem,3vw,2rem)] leading-tight italic">
                Ready to start your own?
              </p>
              <StartButton className="px-5 py-3 text-[15px]" />
            </div>
            <p className="mt-4 text-[13px] text-ink-soft">
              Free while in beta.
            </p>
          </div>
        </section>
      </main>

      {/* Footer — the tear-off stub at the bottom of a statement */}
      <footer className="border-t-2 border-margin/70">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <TallyMark size={22} />
              <span className="text-[15px] font-bold">Tally</span>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-soft">
              <a href="#" className="hover:text-ink">
                Privacy
              </a>
              <a href="#" className="hover:text-ink">
                Terms
              </a>
              <a href="#" className="hover:text-ink">
                Contact
              </a>
              <a href="#" className="hover:text-ink">
                Status
              </a>
            </nav>
          </div>
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-rule pt-4">
            <p className="max-w-[62ch] text-[12.5px] leading-[1.6] text-ink-soft">
              &copy; 2026 Tally. Tally keeps your records; it does not hold,
              move, or have access to your money, and it is not a bank.
            </p>
            <span className="figure text-[12px] text-ink-soft">
              Sheet 1 of 1
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
