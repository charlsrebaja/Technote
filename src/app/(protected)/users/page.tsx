import { UserSettingsForms } from "@/components/users/user-settings-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const user = await requireUser();

  const [salesCount, repairsCount, utangCount] = await Promise.all([
    prisma.sale.count({ where: { userId: user.id } }),
    prisma.repair.count({ where: { userId: user.id } }),
    prisma.utang.count({ where: { userId: user.id } }),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details and secure your login credentials.
        </p>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b bg-slate-50/70 pb-4">
          <CardTitle className="text-base font-semibold">
            Account Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sales Logs
              </dt>
              <dd className="mt-1 text-sm font-medium">{salesCount}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Repair Logs
              </dt>
              <dd className="mt-1 text-sm font-medium">{repairsCount}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Utang Logs
              </dt>
              <dd className="mt-1 text-sm font-medium">{utangCount}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <UserSettingsForms initialName={user.name} initialEmail={user.email} />
    </section>
  );
}
