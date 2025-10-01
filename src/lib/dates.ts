import { eachDayOfInterval, isSunday, isSaturday, isSameDay } from "date-fns";
import type { DayHalf } from "./types";

// This is a simplified list. In a real app, you'd use a library or API.
const PUBLIC_HOLIDAYS_2024 = [
    new Date('2024-01-01'), // New Year's Day
    new Date('2024-03-29'), // Good Friday
    new Date('2024-04-01'), // Easter Monday
    new Date('2024-05-06'), // Early May bank holiday
    new Date('2024-05-27'), // Spring bank holiday
    new Date('2024-08-26'), // Summer bank holiday
    new Date('2024-12-25'), // Christmas Day
    new Date('2024-12-26'), // Boxing Day
];
const PUBLIC_HOLIDAYS_2025 = [
    new Date('2025-01-01'),
    new Date('2025-04-18'),
    new Date('2025-04-21'),
    new Date('2025-05-05'),
    new Date('2025-05-26'),
    new Date('2025-08-25'),
    new Date('2025-12-25'),
    new Date('2025-12-26'),
];
const PUBLIC_HOLIDAYS_2026 = [
    new Date('2026-01-01'),
    new Date('2026-04-03'),
    new Date('2026-04-06'),
    new Date('2026-05-04'),
    new Date('2026-05-25'),
    new Date('2026-08-31'),
    new Date('2026-12-25'),
    new Date('2026-12-28'),
];


export function getPublicHolidays(year: number) {
    if (year === 2024) return PUBLIC_HOLIDAYS_2024;
    if (year === 2025) return PUBLIC_HOLIDAYS_2025;
    if (year === 2026) return PUBLIC_HOLIDAYS_2026;
    return [];
}


export function getDaysBetween(startDate: Date, endDate: Date, publicHolidays: Date[], startType: DayHalf, endType: DayHalf): number {
    if (isSameDay(startDate, endDate)) {
        if (startType === 'full' && endType === 'full') return 1;
        return 0.5;
    }
    
    const interval = eachDayOfInterval({ start: startDate, end: endDate });

    let workingDays = interval.filter(day => {
        const isWeekend = isSaturday(day) || isSunday(day);
        const isPublicHoliday = publicHolidays.some(h => isSameDay(day, h));
        return !isWeekend && !isPublicHoliday;
    });

    let daysCount = workingDays.length;

    // Adjust for half days on start and end dates
    const firstDayIsWorking = workingDays.some(d => isSameDay(d, startDate));
    if (firstDayIsWorking && (startType === 'am' || startType === 'pm')) {
        daysCount -= 0.5;
    }

    const lastDayIsWorking = workingDays.some(d => isSameDay(d, endDate));
     if (lastDayIsWorking && (endType === 'am' || endType === 'pm')) {
        // If the start and end dates are the same, this is already handled
        if (!isSameDay(startDate, endDate)) {
            daysCount -= 0.5;
        }
    }

    return daysCount;
}
