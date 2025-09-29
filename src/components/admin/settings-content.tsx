'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { updateSettings } from "@/lib/actions";
import type { AppSettings, User } from "@/lib/types";
import { useApp } from '@/context/app-provider';

interface SettingsContentProps {
  currentSettings: AppSettings;
  allUsers: User[];
  currentUser: User | null;
}

export function SettingsContent({ currentSettings, allUsers, currentUser }: SettingsContentProps) {
  const { toast } = useToast();
  const { switchUser } = useApp();

  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(updateSettings, initialState);

  useEffect(() => {
    if (state.message) {
      if(state.errors) {
        toast({ title: "Error", description: state.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: state.message });
      }
    }
  }, [state, toast]);

  return (
    <div className="space-y-8 max-w-md">
      <form action={dispatch} className="space-y-4">
        <div>
          <Label htmlFor="defaultAllowance">Default Annual Allowance (days)</Label>
          <Input
            id="defaultAllowance"
            name="defaultAllowance"
            type="number"
            defaultValue={currentSettings.defaultAllowance}
            className="mt-1"
          />
          {state.errors?.defaultAllowance && (
            <p className="text-sm font-medium text-destructive mt-1">{state.errors.defaultAllowance[0]}</p>
          )}
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
      
      <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Authentication Mocking</h3>
          <p className="text-sm text-muted-foreground">
              Select a user to act as the currently logged-in user for prototyping purposes.
          </p>
          <div>
            <Label htmlFor="user-switcher">Switch Active User</Label>
            <Select
                value={currentUser?.id}
                onValueChange={(userId) => {
                    if (userId) {
                        toast({ title: 'Switching User...', description: `Changing active user. The page will reload.` });
                        switchUser(userId);
                    }
                }}
            >
                <SelectTrigger id="user-switcher" className="mt-1">
                    <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                    {allUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
      </div>
    </div>
  );
}
