import { getUsers, getDepartments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersDataTable } from '@/components/admin/users/users-data-table';
import { AddUserDialog } from '@/components/admin/users/add-user-dialog';
import { User } from '@/lib/types';

export default async function AdminUsersPage() {
  // Fetch non-archived users by default
  const allUsers = await getUsers();
  const users = allUsers.filter((u: User) => !u.archived);
  const departments = await getDepartments();

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
          <UsersDataTable data={users} departments={departments} />
        </CardContent>
      </Card>
    </div>
  );
}
