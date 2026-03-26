"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AuthActionState = {
  error?: string;
};

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email."),
  password: z.string().min(1, "Password is required."),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function parseFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawData = parseFormData(formData);
  const parsedData = registerSchema.safeParse(rawData);

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  const passwordHash = await hashPassword(parsedData.data.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: parsedData.data.name,
        email: parsedData.data.email.toLowerCase(),
        password: passwordHash,
      },
    });

    const sessionToken = await createSessionToken(user.id);
    await setSessionCookie(sessionToken);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "An account with this email already exists." };
    }

    return { error: "Unable to create account right now." };
  }

  redirect("/");
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawData = parseFormData(formData);
  const parsedData = loginSchema.safeParse(rawData);

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsedData.data.email.toLowerCase() },
  });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isPasswordValid = await verifyPassword(
    parsedData.data.password,
    user.password,
  );

  if (!isPasswordValid) {
    return { error: "Invalid email or password." };
  }

  const sessionToken = await createSessionToken(user.id);
  await setSessionCookie(sessionToken);

  redirect("/");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
