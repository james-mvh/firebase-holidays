import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline">Manage Users</h1>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New User
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A data table for managing users will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
