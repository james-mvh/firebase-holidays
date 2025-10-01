import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPendingRequestsForManager, getUsers } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { AuthorisationDataTable } from '@/components/authorisation/authorisation-data-table';

export default async function AuthorisationPage() {
  const manager = await getCurrentUser();
  if (!manager) {
    notFound();
  }
  const requests = await getPendingRequestsForManager(manager.id);
  const users = await getUsers();

  const usersMap = new Map(users.map(u => [u.id, u]));
  const requestsWithUsers = requests.map(req => ({
    ...req,
    user: usersMap.get(req.userId)
  }));


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Holiday Authorisation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
           <AuthorisationDataTable data={requestsWithUsers} />
        </CardContent>
      </Card>
    </div>
  );
}
