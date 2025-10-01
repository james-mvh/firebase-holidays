'use client';

import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addUser } from '@/lib/actions';
import { Plus } from 'lucide-react';
import type { Department } from '@/lib/types';
import { UserFormFields } from './user-form-fields';

interface AddUserDialogProps {
    departments: Department[];
}

export function AddUserDialog({ departments }: AddUserDialogProps) {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(addUser, { message: null, errors: {} });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: state.message });
        setIsOpen(false);
      }
    }
  }, [state, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={dispatch}>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          <UserFormFields departments={departments} errors={state.errors} />
          <DialogFooter className="mt-4">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
