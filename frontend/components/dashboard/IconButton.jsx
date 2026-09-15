export default function IconButton({ label, onClick, hoverClass, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={
        "flex h-6 w-6 items-center justify-center rounded-[3px] text-ink-soft hover:bg-field/60 " +
        hoverClass
      }
    >
      {children}
    </button>
  );
}
