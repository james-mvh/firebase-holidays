'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequestsForManager, getUsers, getDepartments } from '@/lib/data';
import { useApp } from '@/context/app-provider';
import { AuthorisationDataTable } from '@/components/authorisation/authorisation-data-table';
import { AuthorisationStatusFilter } from '@/components/authorisation/authorisation-status-filter';
import type { HolidayRequestStatus, User, Department, HolidayRequest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type RequestWithDetails = HolidayRequest & { user?: User; department?: Department };

export default function AuthorisationPage() {
  const { currentUser } = useApp();
  const [status, setStatus] = useState<HolidayRequestStatus | 'all'>('pending');
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map());
  const [departmentsMap, setDepartmentsMap] = useState<Map<string, Department>>(new Map());

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setIsLoading(true);
      const [allRequests, users, departments] = await Promise.all([
        getRequestsForManager(currentUser.id),
        getUsers(),
        getDepartments(),
      ]);

      const loadedUsersMap = new Map(users.map((u) => [u.id, u]));
      const loadedDepartmentsMap = new Map(departments.map((d) => [d.id, d]));
      
      setUsersMap(loadedUsersMap);
      setDepartmentsMap(loadedDepartmentsMap);

      const requestsWithDetails = allRequests.map((req) => {
        const user = loadedUsersMap.get(req.userId);
        const department = user ? loadedDepartmentsMap.get(user.departmentId) : undefined;
        return {
          ...req,
          user,
          department,
        };
      });

      setRequests(requestsWithDetails);
      setIsLoading(false);
    };

    fetchData();
  }, [currentUser]);

  const filteredRequests = useMemo(() => {
    if (status === 'all') {
      return requests;
    }
    return requests.filter((req) => req.status === status);
  }, [requests, status]);


  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Holiday Authorisation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Holiday Requests</CardTitle>
          <div className="pt-4">
            <AuthorisationStatusFilter currentStatus={status} onStatusChange={setStatus} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <AuthorisationDataTable data={filteredRequests} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
