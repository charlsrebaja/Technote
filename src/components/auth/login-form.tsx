"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthActionState } from "@/app/(auth)/actions";

type LoginFormProps = {
  action: (
    previousState: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
};

const initialState: AuthActionState = {};

export function LoginForm({ action }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11 rounded-xl border-slate-300 bg-white/80 px-3"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-slate-700"
        >
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className="h-11 rounded-xl border-slate-300 bg-white/80 px-3"
          required
        />
      </div>

      {state.error ? (
        <p
          className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-slate-700 underline underline-offset-4 hover:text-slate-900"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
