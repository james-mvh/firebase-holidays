'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { HolidayRequest } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { RequestHistoryTableActions } from './request-history-table-actions';
import { ArrowUpDown } from 'lucide-react';

const columns: ColumnDef<HolidayRequest>[] = [
  {
    accessorKey: 'startDate',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => format(row.original.startDate, 'dd MMM yyyy')
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => format(row.original.endDate, 'dd MMM yyyy')
  },
  {
    accessorKey: 'daysCount',
    header: 'Days',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
      if (status === 'approved') variant = 'default';
      if (status === 'denied') variant = 'destructive';

      return <Badge variant={variant} className="capitalize">{status}</Badge>
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Requested On',
    cell: ({ row }) => format(row.original.createdAt, 'dd MMM yyyy')
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <RequestHistoryTableActions request={row.original} />;
    },
  }
];

interface RequestHistoryTableProps {
  data: HolidayRequest[];
}

export function RequestHistoryTable({ data }: RequestHistoryTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
     { id: 'startDate', desc: true }
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No holiday requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
