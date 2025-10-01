
'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addDepartment } from '@/lib/actions';
import { Plus } from 'lucide-react';
import { Department } from '@/lib/types';

export function AddDepartmentDialog() {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(addDepartment, { message: null, errors: {} });

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: state.message });
        // Optionally close dialog on success
        // This requires managing dialog open state here
      }
    }
  }, [state, toast]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={dispatch}>
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new department for your organisation.
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
                defaultValue=""
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
            <Button type="submit">Save Department</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
