import Dot from "./Dot";
import { CATEGORIES, money } from "./constants";

export default function CategoryBreakdown({ breakdown, totalSpent }) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="font-editorial text-[clamp(1.3rem,4vw,1.9rem)] leading-tight italic">
          Where it went
        </h2>
        <span className="figure text-[14px] text-ink-soft">${money(totalSpent)} in all</span>
      </div>

      {breakdown.length > 0 ? (
        <>
          <div className="mt-5 flex h-10 w-full overflow-hidden rounded-[3px] border border-rule-strong">
            {breakdown.map((seg, i) => (
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
            {breakdown.map((seg) => {
              const pct = totalSpent ? Math.round((seg.amount / totalSpent) * 100) : 0;
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
        </>
      ) : (
        <p className="mt-4 text-[13px] text-ink-soft">No spending logged yet.</p>
      )}
    </section>
  );
}
