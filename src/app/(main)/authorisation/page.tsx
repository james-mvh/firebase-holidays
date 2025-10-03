import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequestsForManager, getUsers, getDepartments } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { AuthorisationDataTable } from '@/components/authorisation/authorisation-data-table';
import { AuthorisationStatusFilter } from '@/components/authorisation/authorisation-status-filter';
import type { HolidayRequestStatus } from '@/lib/types';

export default async function AuthorisationPage({
  searchParams,
}: {
  searchParams?: { status?: HolidayRequestStatus | 'all' };
}) {
  const manager = await getCurrentUser();
  if (!manager) {
    notFound();
  }

  const currentStatus = searchParams?.status || 'pending';

  const requests = await getRequestsForManager(manager.id, currentStatus === 'all' ? undefined : currentStatus);
  const users = await getUsers();
  const departments = await getDepartments();

  const usersMap = new Map(users.map(u => [u.id, u]));
  const departmentsMap = new Map(departments.map(d => [d.id, d]));

  const requestsWithDetails = requests.map(req => {
    const user = usersMap.get(req.userId);
    const department = user ? departmentsMap.get(user.departmentId) : undefined;
    return {
      ...req,
      user,
      department
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Holiday Authorisation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Holiday Requests</CardTitle>
          <div className="pt-4">
             <AuthorisationStatusFilter currentStatus={currentStatus} />
          </div>
        </CardHeader>
        <CardContent>
           <AuthorisationDataTable data={requestsWithDetails} />
        </CardContent>
      </Card>
    </div>
  );
}
