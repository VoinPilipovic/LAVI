"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarX, Scissors, LogOut } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { signOutAdmin } from "@/actions/auth.actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Appointments", icon: LayoutDashboard },
  { href: "/admin/availability", label: "Availability", icon: CalendarX },
  { href: "/admin/services", label: "Services", icon: Scissors },
] as const;

interface AdminNavProps {
  adminName: string;
}

function SignOutButton() {
  return (
    <form action={signOutAdmin}>
      <button
        type="submit"
        className="flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-accent"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        Sign out
      </button>
    </form>
  );
}

/** Desktop sidebar — hidden below md. */
export function AdminSidebar({ adminName }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-border bg-ink-elevated md:flex">
      <div className="p-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                isActive ? "bg-accent/10 text-accent" : "text-ivory-dim hover:text-ivory",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-ink-border p-4">
        <p className="truncate text-xs text-ivory-dim">Signed in as {adminName}</p>
        <SignOutButton />
      </div>
    </aside>
  );
}

/** Mobile top nav — hidden md and up. */
export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between border-b border-ink-border bg-ink-elevated px-4 py-3 md:hidden">
      <Logo />
      <nav className="flex items-center gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn("p-1", isActive ? "text-accent" : "text-ivory-dim")}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          );
        })}
        <SignOutButton />
      </nav>
    </header>
  );
}
