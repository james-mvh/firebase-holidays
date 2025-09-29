import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamHolidaysPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Team Holidays</h1>
      <Card>
        <CardHeader>
          <CardTitle>Team Holiday Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The team holiday calendar will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
