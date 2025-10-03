'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { HolidayRequestStatus } from '@/lib/types';

interface AuthorisationStatusFilterProps {
  currentStatus: HolidayRequestStatus | 'all';
  onStatusChange: (status: HolidayRequestStatus | 'all') => void;
}

const statuses: (HolidayRequestStatus | 'all')[] = ['pending', 'approved', 'denied', 'all'];

export function AuthorisationStatusFilter({ currentStatus, onStatusChange }: AuthorisationStatusFilterProps) {
  return (
    <Tabs value={currentStatus} onValueChange={(value) => onStatusChange(value as any)}>
      <TabsList>
        {statuses.map((status) => (
          <TabsTrigger key={status} value={status} className="capitalize">
            {status}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
