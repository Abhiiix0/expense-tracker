"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import TallyMark from "./ui/TallyMark";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import GoogleButton from "./ui/GoogleButton";

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

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const route = useRouter();
  const onSubmit = async (formData) => {
    // console.log(formData);
    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      // console.log("res", data);
      toast.success("Account created successfully");
      route.push("/");
      reset();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-margin/70">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <TallyMark />
            <span className="text-[17px] font-bold tracking-[-0.01em]">
              Tally
            </span>
          </Link>
          <Link
            href="/login"
            className="text-[14px] text-ink-soft hover:text-ink"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-14">
        <div className="w-full max-w-md">
          <p className="text-[13px] text-ink-soft">A personal expense ledger</p>
          <h1 className="mt-2 font-editorial text-[clamp(2rem,5vw,2.75rem)] leading-[1.1] italic">
            Open your ledger
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-soft">
            One account, one running balance. It takes about a minute.
          </p>

          <div className="mt-8 border border-t-2 border-l-2 border-rule-strong border-t-ink border-l-margin">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Field label="Name">
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  className={inputClass}
                  {...register("name", { required: "Please enter your name" })}
                />
                {errors.name && (
                  <span className=" text-xs text-red-400">
                    {errors.name.message}
                  </span>
                )}
              </Field>

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
                  <span className=" text-xs text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </Field>

              <Field
                label="Password"
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
                    required: "Please enter your password",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <span className=" text-xs text-red-400">
                    {errors.password.message}
                  </span>
                )}
              </Field>

              <div className="p-4 pb-0">
                <button
                  type="submit"
                  className="w-full rounded-[3px] bg-margin px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-margin-deep focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
                >
                  Open your ledger
                </button>

                <div className="my-4 flex items-center gap-3 text-[12px] text-ink-soft">
                  <span className="h-px flex-1 bg-rule-strong" />
                  or
                  <span className="h-px flex-1 bg-rule-strong" />
                </div>
              </div>
            </form>
            <div className="px-4 pb-4">
              <GoogleButton />
            </div>
          </div>

          <p className="mt-5 text-[14px] text-ink-soft">
            Already keeping one?{" "}
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
