'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cancelHolidayRequest } from '@/lib/actions';
import { HolidayRequest } from '@/lib/types';
import { useState } from 'react';

interface RequestHistoryTableActionsProps {
  request: HolidayRequest;
}

export function RequestHistoryTableActions({
  request,
}: RequestHistoryTableActionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    const result = await cancelHolidayRequest(request.id);
    if (result.message) {
      toast({
        title: result.message.includes('error') ? 'Error' : 'Success',
        description: result.message,
        variant: result.message.includes('error') ? 'destructive' : 'default',
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        disabled={request.status !== 'pending'}
      >
        Cancel
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your holiday request. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel}>
              Yes, Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
