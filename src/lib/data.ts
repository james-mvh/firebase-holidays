import type { User, Department, FinancialYear, HolidayRequest, UserRole } from './types';

// Mock Data
const users: User[] = [
  {
    id: 'usr_admin',
    name: 'Admin User',
    email: 'admin@finyearly.com',
    role: 'admin',
    departmentId: 'dpt_mgmt',
    createdAt: new Date('2023-01-10T10:00:00Z'),
    avatarUrl: '/avatars/1.jpg',
  },
  {
    id: 'usr_manager',
    name: 'Manager User',
    email: 'manager@finyearly.com',
    role: 'manager',
    departmentId: 'dpt_eng',
    createdAt: new Date('2023-01-15T11:00:00Z'),
    avatarUrl: '/avatars/2.jpg',
  },
  {
    id: 'usr_dev1',
    name: 'Dev One',
    email: 'dev1@finyearly.com',
    role: 'user',
    departmentId: 'dpt_eng',
    createdAt: new Date('2023-02-01T09:00:00Z'),
    avatarUrl: '/avatars/3.jpg',
  },
  {
    id: 'usr_sales1',
    name: 'Sales Person',
    email: 'sales1@finyearly.com',
    role: 'user',
    departmentId: 'dpt_sales',
    createdAt: new Date('2023-02-05T14:00:00Z'),
    avatarUrl: '/avatars/4.jpg',
  },
];

const departments: Department[] = [
  {
    id: 'dpt_mgmt',
    name: 'Management',
  },
  {
    id: 'dpt_eng',
    name: 'Engineering',
  },
  {
    id: 'dpt_sales',
    name: 'Sales',
  },
];

const financialYears: FinancialYear[] = [
    {
        id: 'fy_2425',
        name: '24/25',
        startDate: new Date('2024-04-01T00:00:00Z'),
        endDate: new Date('2025-03-31T23:59:59Z'),
    },
    {
        id: 'fy_2526',
        name: '25/26',
        startDate: new Date('2025-04-01T00:00:00Z'),
        endDate: new Date('2026-03-31T23:59:59Z'),
    },
];

const userAllowances: Record<string, Record<string, { totalAllowance: number }>> = {
    'fy_2425': {
        'usr_admin': { totalAllowance: 30 },
        'usr_manager': { totalAllowance: 28 },
        'usr_dev1': { totalAllowance: 25 },
        'usr_sales1': { totalAllowance: 25 },
    },
    'fy_2526': {
        'usr_admin': { totalAllowance: 30 },
        'usr_manager': { totalAllowance: 28 },
        'usr_dev1': { totalAllowance: 25 },
        'usr_sales1': { totalAllowance: 25 },
    },
}

const holidayRequests: HolidayRequest[] = [
    {
        id: 'req_1',
        userId: 'usr_dev1',
        financialYearId: 'fy_2526',
        startDate: new Date('2025-07-14T00:00:00Z'),
        startType: 'full',
        endDate: new Date('2025-07-18T00:00:00Z'),
        endType: 'full',
        daysCount: 5,
        status: 'approved',
        createdAt: new Date('2025-02-10T10:00:00Z')
    },
    {
        id: 'req_2',
        userId: 'usr_sales1',
        financialYearId: 'fy_2526',
        startDate: new Date('2025-08-04T00:00:00Z'),
        startType: 'full',
        endDate: new Date('2025-08-04T00:00:00Z'),
        endType: 'full',
        daysCount: 1,
        status: 'pending',
        createdAt: new Date('2025-06-20T11:00:00Z')
    },
    {
        id: 'req_3',
        userId: 'usr_dev1',
        financialYearId: 'fy_2526',
        startDate: new Date('2025-12-22T00:00:00Z'),
        startType: 'full',
        endDate: new Date('2026-01-02T00:00:00Z'),
        endType: 'full',
        daysCount: 8,
        status: 'pending',
        createdAt: new Date('2025-07-01T09:30:00Z')
    }
]

// Mock API Functions
export async function getUsers(): Promise<User[]> {
  return Promise.resolve(users);
}

export async function getUserById(id: string): Promise<User | undefined> {
  return Promise.resolve(users.find((u) => u.id === id));
}

export async function getDepartments(): Promise<Department[]> {
    return Promise.resolve(departments);
}

export async function getDepartmentById(id: string): Promise<Department | undefined> {
    return Promise.resolve(departments.find((d) => d.id === id));
}

export async function getFinancialYears(): Promise<FinancialYear[]> {
    return Promise.resolve(financialYears);
}

export async function getUserAllowance(userId: string, financialYearId: string): Promise<{ totalAllowance: number, holidaysTaken: number }> {
    const allowance = userAllowances[financialYearId]?.[userId] ?? { totalAllowance: 25 };
    const taken = holidayRequests
        .filter(r => r.userId === userId && r.financialYearId === financialYearId && r.status === 'approved')
        .reduce((sum, r) => sum + r.daysCount, 0);

    return Promise.resolve({
        totalAllowance: allowance.totalAllowance,
        holidaysTaken: taken,
    })
}
