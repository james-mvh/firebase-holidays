
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { HolidayRequest, FinancialYear, User } from '@/lib/types';
import { eachDayOfInterval, isSameDay } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface HolidayCalendarProps {
  holidays: HolidayRequest[];
  financialYear: FinancialYear;
  users: User[];
  showUser: boolean;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
}

export function HolidayCalendar({ holidays, financialYear, users, showUser }: HolidayCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  
  const usersMap = new Map(users.map(u => [u.id, u]));

  const allHolidayDays = holidays.flatMap(holiday =>
    eachDayOfInterval({ start: holiday.startDate, end: holiday.endDate }).map(date => ({
      date,
      holiday,
    }))
  );

  const holidaysOnSelectedDay = selectedDay
    ? allHolidayDays.filter(hd => isSameDay(hd.date, selectedDay))
    : [];

  const modifiers = {
    holiday: allHolidayDays.map(hd => hd.date),
  };

  const modifiersStyles = {
    holiday: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      opacity: 0.8,
    },
  };

  const handleDayClick = (day: Date, { holiday }: { holiday: boolean }) => {
    if (holiday) {
      setSelectedDay(day);
    } else {
        setSelectedDay(undefined);
    }
  };

  return (
    <Card>
      <CardContent className="p-2 md:p-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
             <Popover open={holidaysOnSelectedDay.length > 0} onOpenChange={(open) => !open && setSelectedDay(undefined)}>
                <PopoverTrigger asChild>
                    <Calendar
                        mode="single"
                        selected={selectedDay}
                        onDayClick={handleDayClick}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        className="rounded-md border"
                        fromMonth={financialYear.startDate}
                        toMonth={financialYear.endDate}
                    />
                </PopoverTrigger>
                 {holidaysOnSelectedDay.length > 0 && (
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">
                                    Holidays on {selectedDay?.toLocaleDateString()}
                                </h4>
                            </div>
                            <div className="grid gap-2">
                                {holidaysOnSelectedDay.map(({ holiday }) => {
                                    const user = usersMap.get(holiday.userId);
                                    return (
                                        <div key={holiday.id} className="grid grid-cols-3 items-center gap-4">
                                            {showUser && user && (
                                                <>
                                                    <Avatar className='col-span-1'>
                                                        <AvatarImage src={user.avatarUrl} />
                                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="col-span-2 font-medium">{user.name}</span>
                                                </>
                                            )}
                                            {!showUser && (
                                               <div className="col-span-3">
                                                 <Badge>{holiday.status}</Badge>
                                               </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </PopoverContent>
                 )}
            </Popover>
        </div>
        <div className="w-full md:w-64">
          <h3 className="text-lg font-semibold mb-4">Upcoming Holidays</h3>
          <div className="space-y-4">
            {holidays.filter(h => h.startDate >= new Date()).slice(0, 5).map(holiday => {
                 const user = usersMap.get(holiday.userId);
                 return (
                    <div key={holiday.id} className="flex items-center gap-4">
                        {showUser && user && (
                             <Avatar>
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                        )}
                        <div>
                            {showUser && user && <p className="font-semibold">{user.name}</p>}
                            <p className="text-sm text-muted-foreground">
                                {holiday.startDate.toLocaleDateString()} - {holiday.endDate.toLocaleDateString()}
                            </p>
                            <p className='text-sm font-medium'>{holiday.daysCount} {holiday.daysCount > 1 ? 'days' : 'day'}</p>
                        </div>
                    </div>
                 )
            })}
             {holidays.filter(h => h.startDate >= new Date()).length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming holidays.</p>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
