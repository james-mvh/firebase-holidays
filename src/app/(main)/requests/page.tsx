import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-headline">My Holiday Requests</h1>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            Request Holiday
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A table of holiday requests will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
