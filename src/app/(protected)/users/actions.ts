"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/current-user";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type UserActionState = {
  error?: string;
  success?: string;
};

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please provide a valid email."),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password do not match.",
    path: ["confirmPassword"],
  });

export async function updateUserProfileAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized action." };
  }

  const parsedData = updateProfileSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsedData.data.name,
        email: parsedData.data.email.toLowerCase(),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { error: "An account with this email already exists." };
    }

    return { error: "Unable to update profile right now." };
  }

  revalidatePath("/users");
  return { success: "Profile updated successfully." };
}

export async function updateUserPasswordAction(
  _previousState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized action." };
  }

  const parsedData = changePasswordSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  const userWithPassword = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      password: true,
    },
  });

  if (!userWithPassword) {
    return { error: "User not found." };
  }

  const isCurrentPasswordValid = await verifyPassword(
    parsedData.data.currentPassword,
    userWithPassword.password,
  );

  if (!isCurrentPasswordValid) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await hashPassword(parsedData.data.newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passwordHash,
    },
  });

  revalidatePath("/users");
  return { success: "Password updated successfully." };
}
