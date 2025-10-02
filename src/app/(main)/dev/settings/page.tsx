import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getSettings } from "@/lib/actions";
import { getUsers } from "@/lib/data";
import { SettingsContent } from "@/components/admin/settings-content";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const allUsers = await getUsers();
  const currentUser = await getCurrentUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Development Settings</h1>

      <Card>
        {/* <CardHeader>
          <CardTitle>Development Settings</CardTitle>
          <CardDescription>
            Helpers for development and testing.
          </CardDescription>
        </CardHeader> */}
        <CardContent>
          <SettingsContent
            allUsers={allUsers}
            currentSettings={settings}
            currentUser={currentUser}
            mode="dev"
          />
        </CardContent>
      </Card>
    </div>
  );
}
