import { deleteUtangAction } from "@/app/(protected)/utang/actions";
import { CreateUtangDialog } from "@/components/utang/create-utang-dialog";
import { EditUtangDialog } from "@/components/utang/edit-utang-dialog";
import { UtangFilters } from "@/components/utang/utang-filters";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ConfirmDeleteForm } from "@/components/ui/confirm-delete-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

function formatCurrency(amount: { toString(): string }) {
  const value = Number.parseFloat(amount.toString());

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function UtangPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();
  const searchParams = await props.searchParams;

  const search =
    typeof searchParams?.s === "string" ? searchParams.s : undefined;
  const statusFilter =
    typeof searchParams?.status === "string" ? searchParams.status : undefined;

  const whereClause: Prisma.UtangWhereInput = {
    userId: user.id,
  };

  if (search) {
    whereClause.OR = [
      { customerName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (statusFilter && (statusFilter === "PAID" || statusFilter === "UNPAID")) {
    whereClause.status = statusFilter;
  }

  const utangs = await prisma.utang.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerName: true,
      description: true,
      totalAmount: true,
      paidAmount: true,
      balance: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Utang Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Record credits and update payments with ease.
          </p>
        </div>
        <CreateUtangDialog />
      </div>

      <div className="animate-gemini-border rounded-xl">
        <Card className="overflow-hidden bg-white/95 backdrop-blur shadow-sm m-[1px] border-none rounded-xl relative z-10">
          <CardHeader className="border-b bg-slate-50/50 pb-4 px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Utang Ledger
                </CardTitle>
                <CardDescription>
                  Manage and track all customer credits.
                </CardDescription>
              </div>
              <UtangFilters />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {utangs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">
                  No records found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {search || statusFilter
                    ? "Try adjusting your filters or search query to find what you're looking for."
                    : "You don't have any utang records yet. Add your first credit record above."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[120px] pl-6">Date</TableHead>
                    <TableHead className="font-semibold text-slate-700">
                      Customer
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right hidden md:table-cell">
                      Paid
                    </TableHead>
                    <TableHead className="text-right font-medium">
                      Balance
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right pr-6 w-[120px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utangs.map((utang) => (
                    <TableRow
                      key={utang.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="pl-6 text-muted-foreground text-sm font-medium">
                        {formatDate(utang.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">
                          {utang.customerName}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden mt-0.5 line-clamp-1">
                          {utang.description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {utang.description}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatCurrency(utang.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                        {formatCurrency(utang.paidAmount)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(utang.balance)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 min-w-[70px] justify-center rounded-full text-xs font-semibold shadow-sm border ${
                            utang.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              utang.status === "PAID"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          ></span>
                          {utang.status}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <EditUtangDialog
                            utang={{
                              id: utang.id,
                              customerName: utang.customerName,
                              description: utang.description,
                              totalAmount: utang.totalAmount.toString(),
                              paidAmount: utang.paidAmount.toString(),
                            }}
                          />
                          <ConfirmDeleteForm
                            action={deleteUtangAction}
                            id={utang.id}
                            itemLabel={`utang record for ${utang.customerName}`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
