import {
  getUsers,
  getDepartments,
  getFinancialYears,
  getUserAllowance,
  getUsersByDepartment,
} from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersDataTable } from '@/components/admin/users/users-data-table';
import { AddUserDialog } from '@/components/admin/users/add-user-dialog';
import type { User, UserWithAllowance } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser || !['admin', 'manager'].includes(currentUser.role)) {
    notFound();
  }

  let usersToDisplay: User[];
  if (currentUser.role === 'admin') {
    usersToDisplay = await getUsers();
  } else {
    // Manager role
    usersToDisplay = await getUsersByDepartment(currentUser.departmentId, true);
  }

  const allUsers = usersToDisplay;
  const users = allUsers.filter((u: User) => !u.archived);
  const departments = await getDepartments();

  const financialYears = await getFinancialYears();
  const fyParam = searchParams?.fy as string | undefined;
  const selectedFinancialYear =
    financialYears.find((fy) => fy.id === fyParam) ??
    financialYears[financialYears.length - 1] ??
    null;

  let usersWithAllowance: UserWithAllowance[] = [];
  if (selectedFinancialYear) {
    usersWithAllowance = await Promise.all(
      users.map(async (user) => {
        const allowance = await getUserAllowance(
          user.id,
          selectedFinancialYear.id
        );
        return {
          ...user,
          totalAllowance: allowance.totalAllowance,
          remainingDays: allowance.totalAllowance - allowance.holidaysTaken,
        };
      })
    );
  } else {
    // If no financial year, just use users without allowance info
    usersWithAllowance = users.map((user) => ({
      ...user,
      totalAllowance: 0,
      remainingDays: 0,
    }));
  }

  const relevantDepartments =
    currentUser.role === 'admin'
      ? departments
      : departments.filter((d) => d.id === currentUser.departmentId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline">Manage Users</h1>
        {currentUser.role === 'admin' && (
          <AddUserDialog departments={departments} />
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersDataTable
            data={usersWithAllowance}
            departments={relevantDepartments}
            currentUser={currentUser}
          />
        </CardContent>
      </Card>
    </div>
  );
}
