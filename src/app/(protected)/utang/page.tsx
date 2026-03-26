import { deleteUtangAction } from "@/app/(protected)/utang/actions";
import { CreateUtangDialog } from "@/components/utang/create-utang-dialog";
import { EditUtangDialog } from "@/components/utang/edit-utang-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default async function UtangPage() {
  const user = await requireUser();

  const utangs = await prisma.utang.findMany({
    where: { userId: user.id },
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
          <h1 className="text-2xl font-bold tracking-tight">Utang</h1>
          <p className="text-sm text-muted-foreground">
            Record credits and update payments without leaving the ledger.
          </p>
        </div>
        <CreateUtangDialog />
      </div>

      <Card className="overflow-hidden bg-white shadow-sm">
        <CardHeader className="border-b bg-slate-50/70 pb-4">
          <CardTitle className="text-base font-semibold">
            Utang Ledger
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {utangs.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No utang records yet. Add your first credit record.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Customer
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utangs.map((utang) => (
                  <TableRow key={utang.id}>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(utang.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {utang.customerName}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium">{utang.description}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {utang.customerName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(utang.totalAmount)}</TableCell>
                    <TableCell>{formatCurrency(utang.paidAmount)}</TableCell>
                    <TableCell>{formatCurrency(utang.balance)}</TableCell>
                    <TableCell>{utang.status}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
    </section>
  );
}
