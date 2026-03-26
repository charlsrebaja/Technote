"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export type RepairActionState = {
  error?: string;
  success?: boolean;
};

const repairStatusSchema = z.enum(["PENDING", "ONGOING", "DONE", "CLAIMED"]);

const createRepairSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required."),
  device: z.string().trim().min(2, "Device is required."),
  issue: z.string().trim().min(2, "Issue is required."),
  serviceFee: z.coerce.number().min(0, "Service fee must be 0 or higher."),
  status: repairStatusSchema,
});

const updateRepairSchema = createRepairSchema.extend({
  id: z.string().min(1, "Repair id is required."),
});

export async function createRepairAction(
  _previousState: RepairActionState,
  formData: FormData,
): Promise<RepairActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized action." };
  }

  const parsedData = createRepairSchema.safeParse({
    customerName: String(formData.get("customerName") ?? ""),
    device: String(formData.get("device") ?? ""),
    issue: String(formData.get("issue") ?? ""),
    serviceFee: formData.get("serviceFee"),
    status: String(formData.get("status") ?? "PENDING"),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.repair.create({
    data: {
      userId: user.id,
      customerName: parsedData.data.customerName,
      device: parsedData.data.device,
      issue: parsedData.data.issue,
      serviceFee: parsedData.data.serviceFee,
      status: parsedData.data.status,
    },
  });

  revalidatePath("/repairs");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateRepairAction(
  _previousState: RepairActionState,
  formData: FormData,
): Promise<RepairActionState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Unauthorized action." };
  }

  const parsedData = updateRepairSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    device: String(formData.get("device") ?? ""),
    issue: String(formData.get("issue") ?? ""),
    serviceFee: formData.get("serviceFee"),
    status: String(formData.get("status") ?? "PENDING"),
  });

  if (!parsedData.success) {
    return { error: parsedData.error.issues[0]?.message ?? "Invalid input." };
  }

  const result = await prisma.repair.updateMany({
    where: {
      id: parsedData.data.id,
      userId: user.id,
    },
    data: {
      customerName: parsedData.data.customerName,
      device: parsedData.data.device,
      issue: parsedData.data.issue,
      serviceFee: parsedData.data.serviceFee,
      status: parsedData.data.status,
    },
  });

  if (result.count === 0) {
    return { error: "Repair record not found." };
  }

  revalidatePath("/repairs");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteRepairAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  const repairId = String(formData.get("id") ?? "");

  if (!repairId) {
    return;
  }

  await prisma.repair.deleteMany({
    where: {
      id: repairId,
      userId: user.id,
    },
  });

  revalidatePath("/repairs");
  revalidatePath("/dashboard");
}
