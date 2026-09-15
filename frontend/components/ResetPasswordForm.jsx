"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TallyMark from "./ui/TallyMark";
import { toast } from "react-toastify";
import { api } from "../lib/api";

function Field({ label, hint, children }) {
  return (
    <label className="block border-b border-rule px-4 py-3 focus-within:border-ink focus-within:bg-field/50">
      <span className="mb-1 flex items-baseline justify-between text-[12px] text-ink-soft">
        {label}
        {hint ?? null}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft/50";

export default function ResetPasswordForm({ token }) {
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [linkStatus, setLinkStatus] = useState("checking"); // "checking" | "valid" | "invalid"
  const [linkError, setLinkError] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkLink = async () => {
      try {
        await api("/api/auth/verify_link", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        setLinkStatus("valid");
      } catch (error) {
        setLinkError(error.message || "This reset link is invalid or has expired");
        setLinkStatus("invalid");
      }
    };
    checkLink();
  }, [token]);

  const onSubmit = async (formData) => {
    try {
      await api(`/api/auth/reset_password/${token}`, {
        method: "POST",
        body: JSON.stringify({ password: formData?.password }),
      });
      setDone(true);
    } catch (error) {
      // console.log("error", error);
      toast.error(error.message || "something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-margin/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <TallyMark />
            <span className="text-[17px] font-bold tracking-[-0.01em]">Tally</span>
          </Link>
          <Link href="/login" className="text-[14px] text-ink-soft hover:text-ink">
            Log in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-md">
          <p className="text-[13px] text-ink-soft">A personal expense ledger</p>
          <h1 className="mt-2 font-editorial text-[clamp(2rem,5vw,2.75rem)] leading-[1.1] italic">
            {linkStatus === "invalid" ? "Link expired" : "Choose a new password"}
          </h1>

          {linkStatus === "checking" && (
            <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
              Checking your link…
            </p>
          )}

          {linkStatus === "invalid" && (
            <>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
                {linkError}
              </p>
              <div className="mt-8 border border-t-2 border-l-2 border-rule-strong border-t-ink border-l-margin p-5">
                <p className="text-[15px] text-ink">Request a new link</p>
                <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
                  Reset links only work for 30 minutes and can only be used
                  once. Ask for a fresh one to keep going.
                </p>
                <Link
                  href="/forgot-password"
                  className="mt-4 inline-block rounded-[3px] bg-margin px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-margin-deep"
                >
                  Send a new link
                </Link>
              </div>
            </>
          )}

          {linkStatus === "valid" && (
            <>
              <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
                This link expires 30 minutes after it was sent and can only be
                used once.
              </p>

              {done ? (
                <div className="mt-8 border border-t-2 border-l-2 border-rule-strong border-t-ink border-l-margin p-5">
                  <p className="text-[15px] text-ink">Password reset</p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
                    Your password has been changed. Log in with your new password.
                  </p>
                  <Link
                    href="/login"
                    className="mt-4 inline-block rounded-[3px] bg-margin px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-margin-deep"
                  >
                    Log in
                  </Link>
                </div>
              ) : (
                <div className="mt-8 border border-t-2 border-l-2 border-rule-strong border-t-ink border-l-margin">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Field
                      label="New password"
                      hint={
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="text-[12px] text-ink-soft underline underline-offset-2 hover:text-ink"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      }
                    >
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        className={inputClass}
                        {...register("password", {
                          required: "Please enter a new password",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                      />
                      {errors.password && (
                        <span className="text-xs text-red-400">{errors.password.message}</span>
                      )}
                    </Field>

                    <Field label="Confirm password">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Type it again"
                        className={inputClass}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === getValues("password") || "Passwords don't match",
                        })}
                      />
                      {errors.confirmPassword && (
                        <span className="text-xs text-red-400">
                          {errors.confirmPassword.message}
                        </span>
                      )}
                    </Field>

                    <div className="p-4">
                      <button
                        type="submit"
                        className="w-full rounded-[3px] bg-margin px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-margin-deep focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
                      >
                        Reset password
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
