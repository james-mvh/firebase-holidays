import { getDepartments } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DepartmentsDataTable } from '@/components/admin/departments/departments-data-table';
import { AddDepartmentDialog } from '@/components/admin/departments/add-department-dialog';

export default async function AdminDepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline">Manage Departments</h1>
        <AddDepartmentDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentsDataTable data={departments} />
        </CardContent>
      </Card>
    </div>
  );
}
