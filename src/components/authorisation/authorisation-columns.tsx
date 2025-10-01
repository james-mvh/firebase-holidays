'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { HolidayRequest, User } from '@/lib/types';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { AuthorisationTableActions } from './authorisation-table-actions';
import { Badge } from '@/components/ui/badge';

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
}

export const createAuthorisationColumns = (): ColumnDef<HolidayRequest & { user?: User }>[] => [
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => {
        const user = row.original.user;
        if (!user) return 'Unknown User';
        return (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Start Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(row.original.startDate, 'dd/MM/yyyy')
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => format(row.original.endDate, 'dd/MM/yyyy')
  },
  {
    accessorKey: 'daysCount',
    header: 'Days',
  },
   {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Requested On
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(row.original.createdAt, 'dd MMM yyyy')
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge className="capitalize">{row.original.status}</Badge>
  },
  {
    id: 'actions',
    cell: ({ row }) => <AuthorisationTableActions request={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
