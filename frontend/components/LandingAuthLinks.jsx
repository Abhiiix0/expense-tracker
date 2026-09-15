"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const buttonClass =
  "inline-flex items-center justify-center rounded-[3px] bg-margin px-3.5 py-2 text-[14px] font-bold whitespace-nowrap text-white transition-colors hover:bg-margin-deep focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none";

export default function LandingAuthLinks() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <Link href="/dashboard" className={buttonClass}>
        Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className="text-ink-soft hover:text-ink">
        Log in
      </Link>
      <Link href="/signup" className={buttonClass}>
        Sign up
      </Link>
    </>
  );
}
