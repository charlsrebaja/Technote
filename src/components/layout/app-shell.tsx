"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  WalletCards,
  Wrench,
  HandCoins,
  UserRound,
  LogOut,
} from "lucide-react";

import { logoutAction } from "@/app/(auth)/actions";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";

type AppShellProps = {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sales", label: "Sales", icon: WalletCards },
  { href: "/repairs", label: "Repairs", icon: Wrench },
  { href: "/utang", label: "Utang", icon: HandCoins },
  { href: "/users", label: "Users", icon: UserRound },
];

export function AppShell({ userName, userEmail, children }: AppShellProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-white/85 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5">
          <div className="min-w-0">
            <BrandLogo compact />
            <p className="text-xs text-muted-foreground">{userName}</p>
          </div>
          <form action={logoutAction}>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="gap-1.5"
            >
              <LogOut className="size-3.5" />
              Exit
            </Button>
          </form>
        </div>
        <nav className="hide-scrollbar flex gap-2 overflow-x-auto border-t bg-slate-50/70 px-3 py-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "border-primary/25 bg-primary text-primary-foreground"
                    : "bg-white text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col border-r bg-white md:flex">
        <div className="border-b px-5 py-5">
          <BrandLogo />
        </div>

        <nav className="flex-1 space-y-1.5 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                    : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t bg-slate-50/60 p-4">
          <p className="text-sm font-medium">{userName}</p>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              className="w-full gap-2 bg-white"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <main className="px-4 py-5 pb-16 sm:px-6 sm:py-6 sm:pb-8 lg:px-8 md:ml-[252px]">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
