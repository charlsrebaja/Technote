import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/current-user";
import { HandCoins, WalletCards, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";

type ActivityItem = {
  id: string;
  type: "Sale" | "Repair" | "Utang";
  title: string;
  subtitle: string;
  occurredAt: Date;
};

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

function toNumber(value: { toString(): string } | number | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (!value) {
    return 0;
  }

  const parsed = Number.parseFloat(value.toString());
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export default async function DashboardPage() {
  const user = await requireUser();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [
    salesToday,
    repairsToday,
    repairSalesToday,
    utangBalance,
    recentSales,
    recentRepairs,
    recentUtangs,
  ] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.repair.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    }),
    prisma.repair.aggregate({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      _sum: {
        serviceFee: true,
      },
    }),
    prisma.utang.aggregate({
      where: {
        userId: user.id,
      },
      _sum: {
        balance: true,
      },
    }),
    prisma.sale.findMany({
      where: { userId: user.id },
      take: 7,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        description: true,
        amount: true,
        createdAt: true,
      },
    }),
    prisma.repair.findMany({
      where: { userId: user.id },
      take: 7,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        device: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.utang.findMany({
      where: { userId: user.id },
      take: 7,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        customerName: true,
        description: true,
        status: true,
        balance: true,
        createdAt: true,
      },
    }),
  ]);

  const recentActivity: ActivityItem[] = [
    ...recentSales.map((sale) => ({
      id: `sale-${sale.id}`,
      type: "Sale" as const,
      title: sale.description,
      subtitle: `${sale.customerName} • ${formatCurrency(toNumber(sale.amount))}`,
      occurredAt: sale.createdAt,
    })),
    ...recentRepairs.map((repair) => ({
      id: `repair-${repair.id}`,
      type: "Repair" as const,
      title: `${repair.device} (${repair.status})`,
      subtitle: repair.customerName,
      occurredAt: repair.createdAt,
    })),
    ...recentUtangs.map((utang) => ({
      id: `utang-${utang.id}`,
      type: "Utang" as const,
      title: `${utang.description} (${utang.status})`,
      subtitle: `${utang.customerName} • Balance ${formatCurrency(toNumber(utang.balance))}`,
      occurredAt: utang.createdAt,
    })),
  ]
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, 10);

  const statsCards = [
    {
      title: "Sales Today",
      value: formatCurrency(toNumber(salesToday._sum.amount)),
      hint: "Revenue logged today",
      icon: WalletCards,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100/50",
      hoverBorder: "hover:border-emerald-400/60",
      hoverShadow: "hover:shadow-emerald-500/10",
    },
    {
      title: "Repairs Today",
      value: repairsToday.toString(),
      hint: "Devices currently in service",
      icon: Wrench,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100/50",
      hoverBorder: "hover:border-blue-400/60",
      hoverShadow: "hover:shadow-blue-500/10",
    },
    {
      title: "Total Repairs Sale Today",
      value: formatCurrency(toNumber(repairSalesToday._sum.serviceFee)),
      hint: "Service fees logged today",
      icon: Wrench,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100/50",
      hoverBorder: "hover:border-cyan-400/60",
      hoverShadow: "hover:shadow-cyan-500/10",
    },
    {
      title: "Total Utang",
      value: formatCurrency(toNumber(utangBalance._sum.balance)),
      hint: "Outstanding customer balance",
      icon: HandCoins,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100/50",
      hoverBorder: "hover:border-amber-400/60",
      hoverShadow: "hover:shadow-amber-500/10",
    },
  ];

  return (
    <section className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Daily overview and latest logbook activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/sales"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 shadow-sm"
          >
            Add sale <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/repairs"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm"
          >
            Add repair <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className={`relative overflow-hidden border border-slate-200 bg-white transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-slate-50/50 hover:shadow-lg ${card.hoverBorder} ${card.hoverShadow}`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {card.title}
                </CardTitle>
                <div
                  className={`mt-0.5 flex size-8 items-center justify-center rounded-md ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.hint}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 xl:col-span-5 flex flex-col border border-slate-200 bg-white shadow-sm transition-all duration-500 ease-out hover:border-slate-300/80 hover:shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-dashed rounded-lg">
                <p className="text-sm font-medium text-slate-900">
                  No activity logged yet
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Check back later once you've made a transaction.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500">{item.subtitle}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.type === "Sale"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.type === "Repair"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.type}
                      </div>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(item.occurredAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 xl:col-span-2 border border-slate-200 bg-white shadow-sm transition-all duration-500 ease-out hover:border-slate-300/80 hover:shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Link
                href="/sales"
                className="group flex items-center gap-3 rounded-lg border border-transparent bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-300 p-4 text-emerald-900 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/10"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 transition-transform duration-500 group-hover:scale-110">
                  <WalletCards className="size-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">Record Sale</p>
                  <p className="text-xs text-emerald-700/80">
                    Log a new successful sale
                  </p>
                </div>
              </Link>

              <Link
                href="/repairs"
                className="group flex items-center gap-3 rounded-lg border border-transparent bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 p-4 text-blue-900 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/10"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-blue-100 text-blue-600 transition-transform duration-500 group-hover:scale-110">
                  <Wrench className="size-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">New Repair</p>
                  <p className="text-xs text-blue-700/80">
                    Start a new service repair
                  </p>
                </div>
              </Link>

              <Link
                href="/utang"
                className="group flex items-center gap-3 rounded-lg border border-transparent bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 p-4 text-amber-900 transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-amber-500/10"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-amber-100 text-amber-600 transition-transform duration-500 group-hover:scale-110">
                  <HandCoins className="size-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">Add Utang</p>
                  <p className="text-xs text-amber-700/80">
                    Record a new balance item
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
