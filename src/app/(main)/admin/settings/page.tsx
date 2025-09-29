import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getSettings } from '@/lib/actions';
import { getUsers } from '@/lib/data';
import { SettingsContent } from '@/components/admin/settings-content';
import { getCurrentUser } from '@/lib/auth';

export default async function AdminSettingsPage() {
    const settings = await getSettings();
    const allUsers = await getUsers();
    const currentUser = await getCurrentUser();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-headline">Admin Settings</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Application Settings</CardTitle>
                    <CardDescription>Manage global settings for the application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsContent
                        allUsers={allUsers}
                        currentSettings={settings}
                        currentUser={currentUser}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
