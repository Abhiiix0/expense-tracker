import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

export const sendResetPasswordEmail = async (email, resetLink) => {
  const { data, error } = await resend.emails.send({
    from: "Expense Tracker <onboarding@resend.dev>",
    to: [email],
    subject: "Reset your password",
    html: `
      <h2>Reset your password</h2>

      <p>We received a request to reset your password.</p>

      <p>
        <a href="${resetLink}">
          Reset Password
        </a>
      </p>

      <p>This link will expire in 30 minutes.</p>

      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });

  if (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send reset email");
  }

  return data;
};