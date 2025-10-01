'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Department } from '@/lib/types';
import { DepartmentsTableActions } from './departments-table-actions';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const department = row.original;
      return <DepartmentsTableActions department={department} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
