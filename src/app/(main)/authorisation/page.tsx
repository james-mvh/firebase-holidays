import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthorisationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Holiday Authorisation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p>A table of pending holiday requests for your team will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
