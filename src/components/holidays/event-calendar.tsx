
'use client';

import { useState, useMemo } from 'react';
import type { HolidayRequest, FinancialYear, User } from '@/lib/types';
import {
  eachDayOfInterval,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  format,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '../ui/badge';

interface EventCalendarProps {
  holidays: HolidayRequest[];
  financialYear: FinancialYear;
  users: User[];
  showUser: boolean;
}

const userColors = [
  'bg-blue-200 border-blue-400 text-blue-800',
  'bg-green-200 border-green-400 text-green-800',
  'bg-yellow-200 border-yellow-400 text-yellow-800',
  'bg-purple-200 border-purple-400 text-purple-800',
  'bg-pink-200 border-pink-400 text-pink-800',
  'bg-indigo-200 border-indigo-400 text-indigo-800',
  'bg-teal-200 border-teal-400 text-teal-800',
  'bg-orange-200 border-orange-400 text-orange-800',
];

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
}

export function EventCalendar({ holidays, financialYear, users, showUser }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const userColorMap = useMemo(() => {
    const map = new Map<string, string>();
    users.forEach((user, index) => {
      map.set(user.id, userColors[index % userColors.length]);
    });
    return map;
  }, [users]);
  
  const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    return eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });
  }, [currentMonth]);

  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const holidaysWithLayout = useMemo(() => {
    const weekStarts = weeks.map(w => startOfWeek(w, { weekStartsOn: 1 }));

    return holidays.map(holiday => {
      const holidayInterval = { start: holiday.startDate, end: holiday.endDate };
      let eventRow = 0;
      
      for(const weekStart of weekStarts) {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const weekInterval = { start: weekStart, end: weekEnd };
        
        if (isWithinInterval(holiday.startDate, weekInterval) || isWithinInterval(weekStart, holidayInterval)) {
          // Find the first available row for this holiday in this week
          const existingEventsInWeek = holidays
            .filter(h => h.id !== holiday.id)
            .filter(h => {
              const otherInterval = { start: h.startDate, end: h.endDate };
              return (isWithinInterval(h.startDate, weekInterval) || isWithinInterval(weekStart, otherInterval))
            })
            .map(h => holidaysWithLayout.find(hl => hl.id === h.id)?.eventRow ?? -1)
            .filter(row => row !== -1);
          
          while(existingEventsInWeek.includes(eventRow)) {
            eventRow++;
          }
          break; // Found the starting week, determine row and stop
        }
      }
      return { ...holiday, eventRow };
    });

  }, [holidays, weeks]);


  const renderHoliday = (holiday: HolidayRequest, weekStart: Date) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    const holidayStartInWeek = isWithinInterval(holiday.startDate, { start: weekStart, end: weekEnd });
    const holidayEndInWeek = isWithinInterval(holiday.endDate, { start: weekStart, end: weekEnd });
    const holidaySpansThroughWeek = isWithinInterval(weekStart, { start: holiday.startDate, end: holiday.endDate });
    
    if (!holidayStartInWeek && !holidayEndInWeek && !holidaySpansThroughWeek) {
      return null;
    }

    const start = holidayStartInWeek ? holiday.startDate : weekStart;
    const end = holidayEndInWeek ? holiday.endDate : weekEnd;

    const startDayIndex = differenceInCalendarDays(start, weekStart);
    const duration = differenceInCalendarDays(end, start) + 1;

    const user = usersMap.get(holiday.userId);
    const colorClass = userColorMap.get(holiday.userId) || userColors[0];
    const eventWithLayout = holidaysWithLayout.find(h => h.id === holiday.id);
    const topOffset = 30 + (eventWithLayout?.eventRow ?? 0) * 28;

    return (
       <Popover>
        <PopoverTrigger asChild>
          <div
            key={holiday.id}
            className={cn(
              'absolute rounded-md px-2 py-0.5 text-xs overflow-hidden border cursor-pointer hover:opacity-80',
              colorClass
            )}
            style={{
              top: `${topOffset}px`,
              left: `calc(${(startDayIndex / 7) * 100}% + 2px)`,
              width: `calc(${(duration / 7) * 100}% - 4px)`,
            }}
          >
            {showUser && user && <span className="font-semibold truncate">{user.name}</span>}
            {!showUser && <span className="font-semibold truncate">Holiday</span>}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                 {showUser && user && (
                    <h4 className="font-medium leading-none">{user.name}</h4>
                 )}
                <p className="text-sm text-muted-foreground">
                  {format(holiday.startDate, 'EEE, d MMM yyyy')} - {format(holiday.endDate, 'EEE, d MMM yyyy')}
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-semibold">Duration</span>
                    <span className='col-span-2'>{holiday.daysCount} {holiday.daysCount > 1 ? 'days' : 'day'}</span>
                </div>
                 <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-semibold">Status</span>
                     <Badge className="capitalize col-span-2">{holiday.status}</Badge>
                </div>
              </div>
            </div>
          </PopoverContent>
      </Popover>
    );
  };

  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth} disabled={!isWithinInterval(subMonths(currentMonth, 1), {start: financialYear.startDate, end: financialYear.endDate})}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth} disabled={!isWithinInterval(addMonths(currentMonth, 1), {start: financialYear.startDate, end: financialYear.endDate})}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0">
        <div className="grid grid-cols-7 border-b border-t">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1">
          {weeks.map((week, weekIndex) => {
            const daysInWeek = eachDayOfInterval({
              start: startOfWeek(week, { weekStartsOn: 1 }),
              end: endOfWeek(week, { weekStartsOn: 1 })
            });

            return daysInWeek.map((day, dayIndex) => (
              <div
                key={day.toString()}
                className={cn(
                  'border-r border-b relative p-2 min-h-[120px]',
                  !isSameMonth(day, currentMonth) && 'bg-muted/50',
                  (dayIndex + 1) % 7 === 0 && 'border-r-0' 
                )}
              >
                <span className={cn('font-medium', isToday(day) && 'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center')}>
                  {format(day, 'd')}
                </span>
                {dayIndex === 0 && holidaysWithLayout.map(holiday => renderHoliday(holiday, day))}
              </div>
            ));
          })}
        </div>
      </CardContent>
    </Card>
  );
}
