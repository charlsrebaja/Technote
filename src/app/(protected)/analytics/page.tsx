import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage() {
  const user = await requireUser();

  // Fetch strictly structured raw data for the client mapping
  const [rawSales, rawRepairs, rawUtangs] = await Promise.all([
    prisma.sale.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        date: true,
        amount: true,
        customerName: true,
        description: true,
      },
    }),
    prisma.repair.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        createdAt: true,
        serviceFee: true,
        customerName: true,
        device: true,
        issue: true,
        status: true,
      },
    }),
    prisma.utang.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        createdAt: true,
        totalAmount: true,
        paidAmount: true,
        balance: true,
        customerName: true,
        description: true,
        status: true,
      },
    }),
  ]);

  // Format the datasets unifying keys for chart analytics
  const sales = rawSales.map((s) => ({
    id: s.id,
    date: s.date.toISOString(),
    type: "SALE" as const,
    amount: Number(s.amount),
    customerName: s.customerName,
    description: s.description,
  }));

  const repairs = rawRepairs.map((r) => ({
    id: r.id,
    date: r.createdAt.toISOString(),
    type: "REPAIR" as const,
    amount: Number(r.serviceFee),
    customerName: r.customerName,
    description: `${r.device} - ${r.issue}`,
    status: r.status,
  }));

  const utangs = rawUtangs.map((u) => ({
    id: u.id,
    date: u.createdAt.toISOString(),
    type: "UTANG" as const,
    amount: Number(u.totalAmount),
    paid: Number(u.paidAmount),
    customerName: u.customerName,
    description: u.description,
    status: u.status,
  }));

  return <AnalyticsClient sales={sales} repairs={repairs} utangs={utangs} />;
}
