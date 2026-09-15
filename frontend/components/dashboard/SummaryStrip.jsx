export default function SummaryStrip({ items }) {
  return (
    <dl className="mt-6 grid grid-cols-2 border border-t-2 border-rule-strong border-t-ink sm:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={
            "border-rule px-4 py-4 sm:px-5 sm:py-5 " +
            (i % 2 === 1 ? "border-l " : "") +
            (i >= 2 ? "border-t sm:border-t-0 " : "") +
            (i >= 1 ? "sm:border-l" : "")
          }
        >
          <dt className="text-[12px] text-ink-soft">{item.label}</dt>
          <dd
            className={
              "figure mt-1 text-[17px] font-semibold sm:text-[20px] " +
              (item.muted ? "text-margin" : "text-ink")
            }
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
