import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/current-user";
import { loginAction } from "@/app/(auth)/actions";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.14),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-2">
        <section className="hidden rounded-3xl border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur lg:block">
          <BrandLogo />
          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900">
            Track every sale, repair, and balance with confidence.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Stay organized with one clean dashboard for daily operations,
            service jobs, and customer balances.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-700">
            <p className="rounded-xl bg-slate-50 px-4 py-3">
              Quick daily logging
            </p>
            <p className="rounded-xl bg-slate-50 px-4 py-3">
              Simple customer tracking
            </p>
            <p className="rounded-xl bg-slate-50 px-4 py-3">
              Mobile-friendly workflow
            </p>
          </div>
        </section>

        <Card className="w-full border-white/80 bg-white/90 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-2 pb-6 text-center">
            <div className="mx-auto">
              <BrandLogo compact />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Welcome Back
            </p>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Sign in to Technote
            </CardTitle>
            <p className="text-sm text-slate-500">
              Enter your credentials to access your store logbook.
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm action={loginAction} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
