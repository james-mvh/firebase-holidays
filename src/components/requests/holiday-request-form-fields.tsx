'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import type { FinancialYear } from '@/lib/types';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface HolidayRequestFormFieldsProps {
    financialYear: FinancialYear;
    errors?: Record<string, any>;
}

export function HolidayRequestFormFields({ financialYear, errors }: HolidayRequestFormFieldsProps) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 4),
    });

    return (
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label>Date Range</Label>
                 <input type="hidden" name="dateRange.from" value={dateRange?.from?.toISOString()} />
                 <input type="hidden" name="dateRange.to" value={dateRange?.to?.toISOString()} />
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    fromMonth={financialYear.startDate}
                    toMonth={financialYear.endDate}
                    disabled={{ before: financialYear.startDate, after: financialYear.endDate }}
                    className="rounded-md border"
                    numberOfMonths={1}
                />
                 {errors?.dateRange && <p className="text-sm font-medium text-destructive">{errors.dateRange[0]}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>First Day</Label>
                    <RadioGroup name="startType" defaultValue="full" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="start-full" />
                            <Label htmlFor="start-full">Full</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="am" id="start-am" />
                            <Label htmlFor="start-am">AM</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pm" id="start-pm" />
                            <Label htmlFor="start-pm">PM</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="space-y-2">
                    <Label>Last Day</Label>
                    <RadioGroup name="endType" defaultValue="full" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="end-full" />
                            <Label htmlFor="end-full">Full</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="am" id="end-am" />
                            <Label htmlFor="end-am">AM</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pm" id="end-pm" />
                            <Label htmlFor="end-pm">PM</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

        </div>
    )
}
