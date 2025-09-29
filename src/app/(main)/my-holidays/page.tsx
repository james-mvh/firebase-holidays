import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyHolidaysPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">My Holidays</h1>
      <Card>
        <CardHeader>
          <CardTitle>Holiday Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The holiday calendar will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
