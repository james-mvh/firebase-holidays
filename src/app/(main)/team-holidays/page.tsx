import { HolidayCalendar } from '@/components/holidays/holiday-calendar';
import { getCurrentUser } from '@/lib/auth';
import { getFinancialYears, getHolidaysForDepartment, getUsersByDepartment } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function TeamHolidaysPage({
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
  
  const teamHolidays = await getHolidaysForDepartment(user.departmentId, selectedFinancialYear.id);
  const teamMembers = await getUsersByDepartment(user.departmentId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Team Holidays</h1>
      <HolidayCalendar 
        holidays={teamHolidays}
        financialYear={selectedFinancialYear}
        users={teamMembers}
        showUser
      />
    </div>
  );
}
