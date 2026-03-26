"use client";

import { useActionState } from "react";

import {
  updateUserPasswordAction,
  updateUserProfileAction,
  type UserActionState,
} from "@/app/(protected)/users/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type UserSettingsFormsProps = {
  initialName: string;
  initialEmail: string;
};

const initialState: UserActionState = {};

export function UserSettingsForms({
  initialName,
  initialEmail,
}: UserSettingsFormsProps) {
  const [profileState, profileFormAction, profilePending] = useActionState(
    updateUserProfileAction,
    initialState,
  );

  const [passwordState, passwordFormAction, passwordPending] = useActionState(
    updateUserPasswordAction,
    initialState,
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b bg-slate-50/70 pb-4">
          <CardTitle className="text-base font-semibold">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <form action={profileFormAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="user-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="user-name"
                name="name"
                defaultValue={initialName}
                autoComplete="name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="user-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="user-email"
                name="email"
                type="email"
                defaultValue={initialEmail}
                autoComplete="email"
                required
              />
            </div>

            {profileState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {profileState.error}
              </p>
            ) : null}

            {profileState.success ? (
              <p className="text-sm text-emerald-700">{profileState.success}</p>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={profilePending}>
                {profilePending ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b bg-slate-50/70 pb-4">
          <CardTitle className="text-base font-semibold">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <form action={passwordFormAction} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="user-current-password"
                className="text-sm font-medium"
              >
                Current Password
              </label>
              <Input
                id="user-current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="user-new-password"
                className="text-sm font-medium"
              >
                New Password
              </label>
              <Input
                id="user-new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="user-confirm-password"
                className="text-sm font-medium"
              >
                Confirm New Password
              </label>
              <Input
                id="user-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            {passwordState.error ? (
              <p role="alert" className="text-sm text-destructive">
                {passwordState.error}
              </p>
            ) : null}

            {passwordState.success ? (
              <p className="text-sm text-emerald-700">
                {passwordState.success}
              </p>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={passwordPending}>
                {passwordPending ? "Updating..." : "Change Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
