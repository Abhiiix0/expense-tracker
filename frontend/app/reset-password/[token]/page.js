import ResetPasswordForm from "../../../components/ResetPasswordForm";

export const metadata = {
  title: "Choose a new password — Tally",
};

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;
  return <ResetPasswordForm token={token} />;
}
