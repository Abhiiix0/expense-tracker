import DashboardShell from "../../components/DashboardShell";
import ProtectedRoute from "../../components/ProtectedRoute";

export const metadata = {
  title: "Ledger — Tally",
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardShell />
    </ProtectedRoute>
  );
}
