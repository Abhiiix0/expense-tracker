"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardView from "./DashboardView";
import AddExpenseModal from "./AddExpenseModal";
import ConfirmDialog from "./ConfirmDialog";
import { api } from "../lib/api";
import { toast } from "react-toastify";

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
const currentMonthKey = () => monthKey(new Date());

const shiftMonthKey = (key, delta) => {
  const [year, month] = key.split("-").map(Number);
  return monthKey(new Date(year, month - 1 + delta, 1));
};

export default function DashboardShell() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [month, setMonth] = useState(currentMonthKey);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchData = async (forMonth) => {
    try {
      const data = await api(`/api/expenses?month=${forMonth}`);
      setExpenses(data.expenses);
    } catch (error) {
      toast.error(error.message || "Could not load your ledger");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch ledger whenever the selected month changes
    setExpenses(null);
    fetchData(month);
  }, [month]);

  const goToPrevMonth = () => setMonth((m) => shiftMonthKey(m, -1));
  const goToNextMonth = () => setMonth((m) => shiftMonthKey(m, 1));
  const isCurrentMonth = month === currentMonthKey();

  const openAdd = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditingExpense(entry);
    setModalOpen(true);
  };

  const handleSave = async (formData, expense) => {
    try {
      if (expense) {
        await api(`/api/expense/${expense.id}`, {
          method: "PATCH",
          body: JSON.stringify(formData),
        });
        toast.success("Expense updated");
      } else {
        await api("/api/expenses", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        toast.success("Expense added");
      }
      fetchData(month);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const confirmDelete = async () => {
    const entry = deleteTarget;
    setDeleteTarget(null);
    try {
      await api(`/api/expense/${entry.id}`, { method: "DELETE" });
      toast.success("Expense deleted");
      fetchData(month);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <DashboardHeader onAddClick={openAdd} />
      <DashboardView
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        data={expenses}
        month={month}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        canGoNext={!isCurrentMonth}
      />

      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        expense={editingExpense}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this entry?"
        message={deleteTarget?.note ? `"${deleteTarget.note}" will be removed for good.` : "This entry will be removed for good."}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
