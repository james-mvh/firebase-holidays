'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import type { HolidayRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { reviewRequest } from '@/lib/actions';
import { useApp } from '@/context/app-provider';

interface AuthorisationTableActionsProps {
  request: HolidayRequest;
}

export function AuthorisationTableActions({ request }: AuthorisationTableActionsProps) {
  const { toast } = useToast();
  const { currentUser } = useApp();

  const handleReview = async (status: 'approved' | 'denied') => {
    if (!currentUser) {
        toast({ title: 'Error', description: 'You must be logged in to perform this action.', variant: 'destructive'});
        return;
    }
    const result = await reviewRequest(request.id, status, currentUser.id);
     if (result.message) {
        toast({ title: result.message.includes('error') ? "Error" : "Success", description: result.message, variant: result.message.includes('error') ? 'destructive' : 'default' });
    }
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleReview('approved')}>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleReview('denied')} className="text-destructive">
            Deny
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
