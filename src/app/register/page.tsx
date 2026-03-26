import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/auth/register-form";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/current-user";
import { registerAction } from "@/app/(auth)/actions";

export default async function RegisterPage() {
  try {
    const user = await getCurrentUser();
    if (user) {
      redirect("/");
    }
  } catch {
    // Database may not be available during build, allow page to render
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_42%),linear-gradient(180deg,#fffdf6_0%,#f0fdf4_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-2">
        <section className="hidden rounded-3xl border border-white/70 bg-white/75 p-8 shadow-xl backdrop-blur lg:block">
          <BrandLogo />
          <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900">
            Start your digital repair-and-sales notebook today.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Build a daily workflow for your shop with cleaner records and fewer
            manual steps.
          </p>
          <div className="mt-8 space-y-3 text-sm text-slate-700">
            <p className="rounded-xl bg-slate-50 px-4 py-3">
              Designed for mobile first
            </p>
            <p className="rounded-xl bg-slate-50 px-4 py-3">
              Faster day-end summaries
            </p>
            <p className="rounded-xl bg-slate-50 px-4 py-3">
              Reliable customer history
            </p>
          </div>
        </section>

        <Card className="w-full border-white/80 bg-white/90 shadow-2xl backdrop-blur">
          <CardHeader className="space-y-2 pb-6 text-center">
            <div className="mx-auto">
              <BrandLogo compact />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              New to Technote
            </p>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Create your account
            </CardTitle>
            <p className="text-sm text-slate-500">
              Sign up to track daily store operations in one place.
            </p>
          </CardHeader>
          <CardContent>
            <RegisterForm action={registerAction} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
