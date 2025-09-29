import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getFinancialYears, getUserAllowance, getDepartmentById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function MyProfilePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const user = await getCurrentUser();
  if (!user) {
    notFound();
  }
  
  const financialYears = await getFinancialYears();
  const fyParam = searchParams?.fy as string | undefined;
  const selectedFinancialYear = financialYears.find(fy => fy.id === fyParam) ?? financialYears[financialYears.length - 1] ?? null;

  if (!selectedFinancialYear) {
    return <div>Financial year not found.</div>
  }

  const allowance = await getUserAllowance(user.id, selectedFinancialYear.id);
  const department = await getDepartmentById(user.departmentId);

  const remaining = allowance.totalAllowance - allowance.holidaysTaken;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">My Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email} - {department?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg font-semibold mb-4">Holiday Allowance for FY {selectedFinancialYear.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl">{allowance.totalAllowance}</CardTitle>
                <CardDescription>Total Allowance</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl text-destructive">{allowance.holidaysTaken}</CardTitle>
                <CardDescription>Holidays Taken</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl text-green-600">{remaining}</CardTitle>
                <CardDescription>Holidays Remaining</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
