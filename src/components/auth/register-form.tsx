"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthActionState } from "@/app/(auth)/actions";

type RegisterFormProps = {
  action: (
    previousState: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
};

const initialState: AuthActionState = {};

export function RegisterForm({ action }: RegisterFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
        <label
          htmlFor="name"
          className="text-[13px] font-semibold text-slate-700"
        >
          Name
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors peer-focus:text-blue-600" />
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Juan Dela Cruz"
            style={{ paddingLeft: "40px" }}
            className="peer h-11 w-full rounded-xl border-slate-200 bg-slate-50 pr-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-600"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
        <label
          htmlFor="email"
          className="text-[13px] font-semibold text-slate-700"
        >
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors peer-focus:text-blue-600" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            style={{ paddingLeft: "40px" }}
            className="peer h-11 w-full rounded-xl border-slate-200 bg-slate-50 pr-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-600"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
        <label
          htmlFor="password"
          className="text-[13px] font-semibold text-slate-700"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors peer-focus:text-blue-600" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            style={{ paddingLeft: "40px", paddingRight: "40px" }}
            className="peer h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-600"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:text-blue-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 transition-colors" />
            ) : (
              <Eye className="h-4 w-4 transition-colors" />
            )}
          </button>
        </div>
      </div>

      {state.error ? (
        <p
          className="rounded-lg bg-red-50 px-3 py-2.5 text-[13px] font-medium text-red-600"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-blue-600 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        disabled={pending}
      >
        {pending ? "Creating account..." : "Create account"}
      </Button>

      <p className="pt-2 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
