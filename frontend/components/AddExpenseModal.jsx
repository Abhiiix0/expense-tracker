"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const TRANSITION_MS = 200;

const CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Other",
];

function Field({ label, children }) {
  return (
    <label className="block border-b border-rule px-4 py-3 focus-within:border-ink focus-within:bg-field/50">
      <span className="mb-1 block text-[12px] text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft/50";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AddExpenseModal({ open, onClose, onSave = () => {}, expense = null }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const isEdit = Boolean(expense);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "expense",
      category: "Food",
      date: todayISO(),
    },
  });

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- mount/unmount transition, no simpler equivalent
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (expense) {
      reset({
        type: expense.type ?? "expense",
        amount: expense.amount ?? "",
        category: expense.category ?? "Food",
        date: expense.date ?? todayISO(),
        note: expense.note ?? "",
      });
    } else {
      reset({ type: "expense", category: "Food", date: todayISO(), amount: "", note: "" });
    }
  }, [open, expense, reset]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, onClose]);

  if (!mounted) return null;

  const onSubmit = (formData) => {
    onSave(formData, expense);
    onClose();
  };

  return (
    <div
      className={
        "fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-4 transition-opacity duration-200 ease-out " +
        (visible ? "opacity-100" : "opacity-0")
      }
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={
          "w-full max-w-md border border-t-2 border-rule-strong border-t-ink bg-paper transition-all duration-200 ease-out " +
          (visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.97] opacity-0")
        }
      >
        <div className="flex items-center justify-between border-b border-rule px-4 py-3">
          <h2 className="font-editorial text-[20px] italic">
            {isEdit ? "Edit expense" : "Add expense"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-[3px] text-ink-soft hover:bg-field/60 hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2">
            <Field label="Type">
              <select className={inputClass} {...register("type", { required: true })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </Field>

            <Field label="Amount">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={inputClass}
                {...register("amount", {
                  required: "Enter an amount",
                  min: { value: 0.01, message: "Must be more than 0" },
                })}
              />
            </Field>
          </div>
          {errors.amount && (
            <p className="px-4 pt-1 text-xs text-red-400">{errors.amount.message}</p>
          )}

          <Field label="Category">
            <select className={inputClass} {...register("category", { required: true })}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date">
            <input
              type="date"
              className={inputClass}
              {...register("date", { required: "Pick a date" })}
            />
            {errors.date && (
              <span className="text-xs text-red-400">{errors.date.message}</span>
            )}
          </Field>

          <Field label="Note (optional)">
            <input
              type="text"
              placeholder="Rye House coffee"
              className={inputClass}
              {...register("note")}
            />
          </Field>

          <div className="flex items-center justify-end gap-3 p-4">
            <button
              type="button"
              onClick={onClose}
              className="text-[13px] text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[3px] bg-margin px-4 py-2 text-[14px] font-bold text-white transition-colors hover:bg-margin-deep focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
            >
              {isEdit ? "Save changes" : "Add entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
