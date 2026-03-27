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
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 p-4">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full max-w-sm rounded-[18px] p-[2px] animate-gemini-border shadow-md hover:shadow-xl transition-shadow duration-500">
        <Card className="rounded-2xl border-none bg-white p-2 sm:p-4 h-full w-full">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="mx-auto mb-2">
              <BrandLogo compact />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
              Create an Account
            </CardTitle>
            <p className="text-sm text-slate-500">
              Sign up to track your daily operations.
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
