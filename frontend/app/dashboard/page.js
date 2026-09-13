import DashboardHeader from "@/components/DashboardHeader";
import DashboardView from "@/components/DashboardView";
import ProtectedRoute from "../../components/ProtectedRoute";

export const metadata = {
  title: "Ledger — Tally",
};

export default function DashboardPage() {
  return (
          <ProtectedRoute>
    <div className="flex min-h-screen flex-col bg-paper text-ink">

      <DashboardHeader />
      <DashboardView />
    </div>
    </ProtectedRoute>
  );
}
