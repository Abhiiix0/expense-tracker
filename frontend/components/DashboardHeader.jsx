"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TallyMark from "./ui/TallyMark";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const NAV = [
  // { label: "Ledger", href: "/dashboard", active: true },
  // { label: "Reports", href: "#" },
  // { label: "Categories", href: "#" },
];

function MenuItem({ children }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => console.log(`${children} clicked`)}
      className="block w-full px-4 py-2.5 text-left text-ink hover:bg-field/60"
    >
      {children}
    </button>
  );
}

export default function DashboardHeader() {
  const route = useRouter()
  const { user, setUser } = useAuth()
  const logout = async () => {
    await api('/api/auth/logout')
    setUser(null)
    toast.success("Logout sucessfully")
    route.push("/")
  }
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-margin/70 bg-paper">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-5 py-3 sm:px-8">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <TallyMark />
          <span className="text-[16px] font-bold tracking-[-0.01em]">Tally</span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={
                "rounded-[3px] px-2.5 py-1.5 text-[14px] transition-colors " +
                (item.active
                  ? "bg-field font-semibold text-ink"
                  : "text-ink-soft hover:text-ink")
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => console.log("Add expense clicked")}
            className="inline-flex items-center gap-1.5 rounded-[3px] bg-margin px-3 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-margin-deep focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M6 1v10M1 6h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">Add expense</span>
            <span className="sm:hidden">Add</span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-rule-strong bg-field text-[12px] font-bold tracking-tight text-ink transition-colors hover:border-ink focus-visible:ring-2 focus-visible:ring-margin focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none"
            >
              AL
              <span className="sr-only">Open account menu</span>
            </button>

            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 z-30 mt-3 w-56 border border-t-2 border-rule-strong border-t-ink bg-paper text-[14px] shadow-[0_12px_32px_-16px_rgba(0,0,0,0.4)]"
              >
                <div className="border-b border-rule px-4 py-3">
                  <p className="font-semibold text-ink">{user.name}</p>
                  <p className="text-[12px] text-ink-soft">{user.email}</p>
                </div>
                <MenuItem>Account</MenuItem>
                {/* <MenuItem>Settings</MenuItem> */}
                <MenuItem>Export CSV</MenuItem>
                <div className="border-t w border-rule">
                  <button
                    onClick={logout}
                    role="menuitem"
                    className="block text-left px-4 py-2.5 font-medium text-margin w-full hover:bg-field/60"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
