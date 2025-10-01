import { HolidayCalendar } from '@/components/holidays/holiday-calendar';
import { getCurrentUser } from '@/lib/auth';
import { getFinancialYears, getHolidaysForUser } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function MyHolidaysPage({
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
  
  const holidays = await getHolidaysForUser(user.id, selectedFinancialYear.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">My Holidays</h1>
      <HolidayCalendar 
        holidays={holidays} 
        financialYear={selectedFinancialYear}
        users={[user]}
        showUser={false}
      />
    </div>
  );
}
