export type UserRole = "admin" | "manager" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  createdAt: Date;
  avatarUrl?: string;
  archived?: boolean;
}

export interface Department {
  id: string;
  name: string;
}

export interface FinancialYear {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export type HolidayRequestStatus = "pending" | "approved" | "denied";
export type DayHalf = "am" | "pm" | "full";

export interface HolidayRequest {
  id: string;
  userId: string;
  financialYearId: string;
  startDate: Date;
  startType: DayHalf;
  endDate: Date;
  endType: DayHalf;
  daysCount: number;
  status: HolidayRequestStatus;
  createdAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface AppSettings {
  defaultAllowance: number;
}

export interface Allowance {
  userId: string;
  financialYearId: string;
  totalAllowance: number;
}
