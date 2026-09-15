"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TallyMark from "./ui/TallyMark";
import {api} from "../lib/api.js"
import { toast } from "react-toastify";
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

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    // console.log("Forgot password form submitted:", formData);
    try {
    await api("/api/auth/forgot_password", {
      method: "POST",
      body: JSON.stringify({email:formData?.email})
    })
    setSentTo(formData.email);
    setSent(true);
    } catch (error) {
      // console.log("error",error)
     toast.error(error.message || "something went wrong!")
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
            Reset your password
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
            Enter the email on your account and we&rsquo;ll send you a link to
            get back in.
          </p>

          {sent ? (
            <div className="mt-8 border border-t-2 border-l-2 border-rule-strong border-t-ink border-l-margin p-5">
              <p className="text-[15px] text-ink">Check your email</p>
              <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
                If an account exists for <span className="text-ink">{sentTo}</span>,
                we&rsquo;ve sent a link to reset your password. It&rsquo;s valid for
                30 minutes and can only be used once.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-[13px] text-ink-soft underline underline-offset-2 hover:text-ink"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div className="mt-8 border border-t-2 border-l-2 border-rule-strong border-t-ink border-l-margin">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Field label="Email">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    {...register("email", {
                      required: "Please enter your email",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400">{errors.email.message}</span>
                  )}
                </Field>

                <div className="p-4">
                  <button
                    type="submit"
                    className="w-full rounded-[3px] bg-margin px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-margin-deep focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
                  >
                    Send reset link
                  </button>
                </div>
              </form>
            </div>
          )}

          <p className="mt-5 text-[14px] text-ink-soft">
            Remembered it?{" "}
            <Link
              href="/login"
              className="text-ink underline underline-offset-4 hover:text-margin"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
