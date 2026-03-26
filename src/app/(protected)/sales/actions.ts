"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export type SaleActionState = {
  error?: string;
  success?: boolean;
};

const createSaleSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required."),
  description: z.string().trim().min(2, "Description is required."),
  amount: z.coerce.number().positive("Amount must be greater than 0."),
  date: z.string().min(1, "Date is required."),
});

const updateSaleSchema = createSaleSchema.extend({
  id: z.string().min(1, "Sale id is required."),
});

function toDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export async function createSaleAction(
  _previousState: SaleActionState,
  formData: FormData,
): Promise<SaleActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized action." };
  }

  const parsedData = createSaleSchema.safeParse({
    customerName: String(formData.get("customerName") ?? ""),
    description: String(formData.get("description") ?? ""),
    amount: formData.get("amount"),
    date: String(formData.get("date") ?? ""),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.sale.create({
    data: {
      userId: user.id,
      customerName: parsedData.data.customerName,
      description: parsedData.data.description,
      amount: parsedData.data.amount,
      date: toDate(parsedData.data.date),
    },
  });

  revalidatePath("/sales");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateSaleAction(
  _previousState: SaleActionState,
  formData: FormData,
): Promise<SaleActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized action." };
  }

  const parsedData = updateSaleSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    description: String(formData.get("description") ?? ""),
    amount: formData.get("amount"),
    date: String(formData.get("date") ?? ""),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  const result = await prisma.sale.updateMany({
    where: {
      id: parsedData.data.id,
      userId: user.id,
    },
    data: {
      customerName: parsedData.data.customerName,
      description: parsedData.data.description,
      amount: parsedData.data.amount,
      date: toDate(parsedData.data.date),
    },
  });

  if (result.count === 0) {
    return { error: "Sale record not found." };
  }

  revalidatePath("/sales");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteSaleAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const saleId = String(formData.get("id") ?? "");

  if (!saleId) {
    return;
  }

  await prisma.sale.deleteMany({
    where: {
      id: saleId,
      userId: user.id,
    },
  });

  revalidatePath("/sales");
  revalidatePath("/dashboard");
}
