import { getUsers, getDepartments, getFinancialYears, getUserAllowance } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersDataTable } from '@/components/admin/users/users-data-table';
import { AddUserDialog } from '@/components/admin/users/add-user-dialog';
import type { User, UserWithAllowance } from '@/lib/types';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allUsers = await getUsers();
  const users = allUsers.filter((u: User) => !u.archived);
  const departments = await getDepartments();

  const financialYears = await getFinancialYears();
  const fyParam = searchParams?.fy as string | undefined;
  const selectedFinancialYear = financialYears.find(fy => fy.id === fyParam) ?? financialYears[financialYears.length - 1] ?? null;

  let usersWithAllowance: UserWithAllowance[] = [];
  if (selectedFinancialYear) {
    usersWithAllowance = await Promise.all(
      users.map(async (user) => {
        const allowance = await getUserAllowance(user.id, selectedFinancialYear.id);
        return {
          ...user,
          totalAllowance: allowance.totalAllowance,
          remainingDays: allowance.totalAllowance - allowance.holidaysTaken,
        };
      })
    );
  } else {
    // If no financial year, just use users without allowance info
    usersWithAllowance = users.map(user => ({ ...user, totalAllowance: 0, remainingDays: 0 }));
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline">Manage Users</h1>
        <AddUserDialog departments={departments} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersDataTable data={usersWithAllowance} departments={departments} />
        </CardContent>
      </Card>
    </div>
  );
}
