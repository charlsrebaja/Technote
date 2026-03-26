import { deleteRepairAction } from "@/app/(protected)/repairs/actions";
import { CreateRepairDialog } from "@/components/repairs/create-repair-dialog";
import { EditRepairDialog } from "@/components/repairs/edit-repair-dialog";
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

export default async function RepairsPage() {
  const user = await requireUser();

  const repairs = await prisma.repair.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerName: true,
      device: true,
      issue: true,
      serviceFee: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Repairs</h1>
          <p className="text-sm text-muted-foreground">
            Track repair intake and status updates in one place.
          </p>
        </div>
        <CreateRepairDialog />
      </div>

      <Card className="overflow-hidden bg-white shadow-sm">
        <CardHeader className="border-b bg-slate-50/70 pb-4">
          <CardTitle className="text-base font-semibold">
            Repair Logbook
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {repairs.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No repair records yet. Add your first repair log.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Customer
                  </TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead className="hidden lg:table-cell">Issue</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Service Fee
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairs.map((repair) => (
                  <TableRow key={repair.id}>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(repair.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {repair.customerName}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-medium">{repair.device}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {repair.customerName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {repair.issue}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatCurrency(repair.serviceFee)}
                    </TableCell>
                    <TableCell>{repair.status}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EditRepairDialog
                          repair={{
                            id: repair.id,
                            customerName: repair.customerName,
                            device: repair.device,
                            issue: repair.issue,
                            serviceFee: repair.serviceFee.toString(),
                            status: repair.status,
                          }}
                        />
                        <ConfirmDeleteForm
                          action={deleteRepairAction}
                          id={repair.id}
                          itemLabel={`repair for ${repair.customerName}`}
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
