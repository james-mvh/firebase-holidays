'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/context/app-provider';

export function FinancialYearSwitcher() {
  const { financialYears, selectedFinancialYear, selectFinancialYear } = useApp();

  if (!selectedFinancialYear) return null;

  return (
    <Select
      value={selectedFinancialYear.id}
      onValueChange={selectFinancialYear}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select Year" />
      </SelectTrigger>
      <SelectContent>
        {financialYears.map((fy) => (
          <SelectItem key={fy.id} value={fy.id}>
            FY {fy.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
