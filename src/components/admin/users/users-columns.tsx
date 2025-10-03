'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { User, Department, UserWithAllowance } from '@/lib/types';
import { UsersTableActions } from './users-table-actions';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
}

export const createUsersColumns = (departments: Department[]): ColumnDef<UserWithAllowance>[] => [
  {
    accessorKey: 'name',
    header: 'User',
    cell: ({ row }) => {
        const user = row.original;
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
    accessorKey: 'departmentId',
    header: 'Department',
    cell: ({ row }) => {
        const department = departments.find(d => d.id === row.getValue('departmentId'));
        return department ? department.name : 'N/A';
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return <Badge variant="secondary" className="capitalize">{role}</Badge>
    }
  },
  {
    accessorKey: 'totalAllowance',
    header: 'Allowance',
    cell: ({ row }) => `${row.original.totalAllowance} days`,
  },
  {
    accessorKey: 'remainingDays',
    header: 'Remaining',
    cell: ({ row }) => `${row.original.remainingDays} days`,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = row.getValue('createdAt') as Date;
        return <div>{format(date, 'dd MMM yyyy')}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;
      return <UsersTableActions user={user} departments={departments} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
