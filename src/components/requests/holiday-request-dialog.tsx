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
import { useToast } from '@/hooks/use-toast';
import { createHolidayRequest } from '@/lib/actions';
import { Plus } from 'lucide-react';
import type { FinancialYear, User } from '@/lib/types';
import { HolidayRequestFormFields } from './holiday-request-form-fields';

interface HolidayRequestDialogProps {
    user: User;
    financialYear: FinancialYear;
    remainingDays: number;
}

export function HolidayRequestDialog({ user, financialYear, remainingDays }: HolidayRequestDialogProps) {
  const { toast } = useToast();
  const [state, dispatch] = useFormState(createHolidayRequest, { message: null, errors: {} });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.message.includes('error') || state.errors) {
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
          Request Holiday
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form action={dispatch}>
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="financialYearId" value={financialYear.id} />
          <input type="hidden" name="remainingDays" value={remainingDays} />
          <DialogHeader>
            <DialogTitle>Request Holiday</DialogTitle>
            <DialogDescription>
              Select the dates for your holiday request. You have {remainingDays} days remaining.
            </DialogDescription>
          </DialogHeader>
          <HolidayRequestFormFields financialYear={financialYear} errors={state.errors} />
          <DialogFooter className="mt-4">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
