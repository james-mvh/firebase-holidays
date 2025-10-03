'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { HolidayRequestStatus } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthorisationStatusFilterProps {
  currentStatus: HolidayRequestStatus | 'all';
}

const statuses: (HolidayRequestStatus | 'all')[] = ['pending', 'approved', 'denied', 'all'];

export function AuthorisationStatusFilter({ currentStatus }: AuthorisationStatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(window.location.search);
    if (status === 'pending') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs value={currentStatus} onValueChange={handleStatusChange}>
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
