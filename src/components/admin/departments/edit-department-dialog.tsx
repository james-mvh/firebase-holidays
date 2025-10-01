'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateDepartment } from '@/lib/actions';
import type { Department } from '@/lib/types';

interface EditDepartmentDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    department: Department;
}

export function EditDepartmentDialog({ isOpen, setIsOpen, department }: EditDepartmentDialogProps) {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(updateDepartment, { message: null, errors: {} });

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
            <input type="hidden" name="id" value={department.id} />
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the name of the department.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={department.name}
                className="col-span-3"
              />
               {state.errors?.name && (
                    <p className="col-span-4 text-sm font-medium text-destructive mt-1 text-right">{state.errors.name[0]}</p>
                )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
