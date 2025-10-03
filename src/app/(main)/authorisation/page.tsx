import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPendingRequestsForManager, getUsers, getDepartments } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { AuthorisationDataTable } from '@/components/authorisation/authorisation-data-table';
import type { Department } from '@/lib/types';

export default async function AuthorisationPage() {
  const manager = await getCurrentUser();
  if (!manager) {
    notFound();
  }
  const requests = await getPendingRequestsForManager(manager.id);
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
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
           <AuthorisationDataTable data={requestsWithDetails} />
        </CardContent>
      </Card>
    </div>
  );
}
