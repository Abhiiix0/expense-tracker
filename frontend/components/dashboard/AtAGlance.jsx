export default function AtAGlance({ items }) {
  return (
    <section>
      <h2 className="font-editorial text-[1.25rem] leading-tight italic">At a glance</h2>
      <dl className="mt-3 border-t-2 border-t-ink">
        {items.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 border-b border-rule py-2.5"
          >
            <dt className="text-[13px] text-ink-soft">{row.label}</dt>
            <dd className="figure text-right text-[13px] text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
