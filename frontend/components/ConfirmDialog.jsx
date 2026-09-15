"use client";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm border border-t-2 border-rule-strong border-t-ink bg-paper p-5">
        <h2 className="font-editorial text-[19px] italic">{title}</h2>
        {message && <p className="mt-2 text-[14px] leading-[1.5] text-ink-soft">{message}</p>}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="text-[13px] text-ink-soft hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[3px] bg-margin px-4 py-2 text-[14px] font-bold text-white transition-colors hover:bg-margin-deep focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
