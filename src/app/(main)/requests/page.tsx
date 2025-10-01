import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HolidayRequestDialog } from '@/components/requests/holiday-request-dialog';
import { getCurrentUser } from '@/lib/auth';
import { getFinancialYears, getHolidayRequestsForUser, getUserAllowance } from '@/lib/data';
import { notFound } from 'next/navigation';
import { RequestHistoryTable } from '@/components/requests/request-history-table';

export default async function RequestsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await getCurrentUser();
  if (!user) notFound();

  const financialYears = await getFinancialYears();
  const fyParam = searchParams?.fy as string | undefined;
  const selectedFinancialYear = financialYears.find(fy => fy.id === fyParam) ?? financialYears[financialYears.length - 1] ?? null;

  if (!selectedFinancialYear) {
    return <div>Financial year not selected.</div>;
  }

  const requests = await getHolidayRequestsForUser(user.id, selectedFinancialYear.id);
  const allowance = await getUserAllowance(user.id, selectedFinancialYear.id);
  const remainingDays = allowance.totalAllowance - allowance.holidaysTaken;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline">My Holiday Requests</h1>
        <HolidayRequestDialog 
          user={user} 
          financialYear={selectedFinancialYear}
          remainingDays={remainingDays}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Request History for FY {selectedFinancialYear.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestHistoryTable data={requests} />
        </CardContent>
      </Card>
    </div>
  );
}
