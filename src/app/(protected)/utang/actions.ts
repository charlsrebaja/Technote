"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export type UtangActionState = {
  error?: string;
  success?: boolean;
};

const createUtangSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required."),
  description: z.string().trim().min(2, "Description is required."),
  totalAmount: z.coerce
    .number()
    .positive("Total amount must be greater than 0."),
  paidAmount: z.coerce.number().min(0, "Paid amount must be 0 or higher."),
});

const updateUtangSchema = createUtangSchema.extend({
  id: z.string().min(1, "Utang id is required."),
});

function computeBalanceAndStatus(totalAmount: number, paidAmount: number) {
  if (paidAmount > totalAmount) {
    return null;
  }

  const balance = totalAmount - paidAmount;
  const status = balance === 0 ? ("PAID" as const) : ("UNPAID" as const);

  return { balance, status };
}

export async function createUtangAction(
  _previousState: UtangActionState,
  formData: FormData,
): Promise<UtangActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized action." };
  }

  const parsedData = createUtangSchema.safeParse({
    customerName: String(formData.get("customerName") ?? ""),
    description: String(formData.get("description") ?? ""),
    totalAmount: formData.get("totalAmount"),
    paidAmount: formData.get("paidAmount"),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  const computed = computeBalanceAndStatus(
    parsedData.data.totalAmount,
    parsedData.data.paidAmount,
  );

  if (!computed) {
    return { error: "Paid amount cannot be greater than total amount." };
  }

  await prisma.utang.create({
    data: {
      userId: user.id,
      customerName: parsedData.data.customerName,
      description: parsedData.data.description,
      totalAmount: parsedData.data.totalAmount,
      paidAmount: parsedData.data.paidAmount,
      balance: computed.balance,
      status: computed.status,
    },
  });

  revalidatePath("/utang");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateUtangAction(
  _previousState: UtangActionState,
  formData: FormData,
): Promise<UtangActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized action." };
  }

  const parsedData = updateUtangSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    description: String(formData.get("description") ?? ""),
    totalAmount: formData.get("totalAmount"),
    paidAmount: formData.get("paidAmount"),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  const computed = computeBalanceAndStatus(
    parsedData.data.totalAmount,
    parsedData.data.paidAmount,
  );

  if (!computed) {
    return { error: "Paid amount cannot be greater than total amount." };
  }

  const result = await prisma.utang.updateMany({
    where: {
      id: parsedData.data.id,
      userId: user.id,
    },
    data: {
      customerName: parsedData.data.customerName,
      description: parsedData.data.description,
      totalAmount: parsedData.data.totalAmount,
      paidAmount: parsedData.data.paidAmount,
      balance: computed.balance,
      status: computed.status,
    },
  });

  if (result.count === 0) {
    return { error: "Utang record not found." };
  }

  revalidatePath("/utang");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteUtangAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const utangId = String(formData.get("id") ?? "");

  if (!utangId) {
    return;
  }

  await prisma.utang.deleteMany({
    where: {
      id: utangId,
      userId: user.id,
    },
  });

  revalidatePath("/utang");
  revalidatePath("/dashboard");
}
