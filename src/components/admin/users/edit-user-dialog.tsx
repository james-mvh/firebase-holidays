'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateUser } from '@/lib/actions';
import type { Department, User } from '@/lib/types';
import { UserFormFields } from './user-form-fields';
import { useApp } from '@/context/app-provider';

interface EditUserDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: User;
    departments: Department[];
}

export function EditUserDialog({ isOpen, setIsOpen, user, departments }: EditUserDialogProps) {
  const { toast } = useToast();
  const { currentUser } = useApp();
  const [state, dispatch] = useFormState(updateUser, { message: null, errors: {} });

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: state.message });
        setIsOpen(false);
      }
    }
  }, [state, toast, setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={dispatch}>
            <input type="hidden" name="id" value={user.id} />
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details.
            </DialogDescription>
          </DialogHeader>
          <UserFormFields user={user} departments={departments} errors={state.errors} currentUser={currentUser} />
          <DialogFooter className="mt-4">
             <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
