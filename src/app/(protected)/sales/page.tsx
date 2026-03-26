import { deleteSaleAction } from "@/app/(protected)/sales/actions";
import { CreateSaleDialog } from "@/components/sales/create-sale-dialog";
import { EditSaleDialog } from "@/components/sales/edit-sale-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function toDateInputValue(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function SalesPage() {
  const user = await requireUser();

  const sales = await prisma.sale.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    select: {
      id: true,
      customerName: true,
      description: true,
      amount: true,
      date: true,
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
          <p className="text-sm text-muted-foreground">
            Quick manual sales log, no cart and no checkout flow.
          </p>
        </div>
        <CreateSaleDialog />
      </div>

      <Card className="overflow-hidden bg-white shadow-sm">
        <CardHeader className="border-b bg-slate-50/70 pb-4">
          <CardTitle className="text-base font-semibold">
            Sales Logbook
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {sales.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No sales records yet. Add your first sale log.
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(sale.date)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sale.customerName}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium">{sale.description}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {formatDate(sale.date)} • {sale.customerName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(sale.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EditSaleDialog
                          sale={{
                            id: sale.id,
                            customerName: sale.customerName,
                            description: sale.description,
                            amount: sale.amount.toString(),
                            dateValue: toDateInputValue(sale.date),
                          }}
                        />
                        <form action={deleteSaleAction}>
                          <input type="hidden" name="id" value={sale.id} />
                          <Button type="submit" size="sm" variant="destructive">
                            Delete
                          </Button>
                        </form>
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
