import {
  doc,
  writeBatch,
  getCountFromServer,
  CollectionReference,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  User,
  Department,
  FinancialYear,
  HolidayRequest,
  Allowance,
} from "./types";

// Mock Data for seeding
const mockUsers: Omit<User, "id">[] = [
  {
    name: "Admin User",
    email: "admin@finyearly.com",
    role: "admin",
    departmentId: "dpt_mgmt",
    createdAt: new Date("2023-01-10T10:00:00Z"),
    avatarUrl: "https://i.pravatar.cc/150?u=admin@finyearly.com",
  },
  {
    name: "Manager User",
    email: "manager@finyearly.com",
    role: "manager",
    departmentId: "dpt_eng",
    createdAt: new Date("2023-01-15T11:00:00Z"),
    avatarUrl: "https://i.pravatar.cc/150?u=manager@finyearly.com",
  },
  {
    name: "Dev One",
    email: "dev1@finyearly.com",
    role: "user",
    departmentId: "dpt_eng",
    createdAt: new Date("2023-02-01T09:00:00Z"),
    avatarUrl: "https://i.pravatar.cc/150?u=dev1@finyearly.com",
  },
  {
    name: "Sales Person",
    email: "sales1@finyearly.com",
    role: "user",
    departmentId: "dpt_sales",
    createdAt: new Date("2023-02-05T14:00:00Z"),
    avatarUrl: "https://i.pravatar.cc/150?u=sales1@finyearly.com",
  },
];

const mockDepartments: Omit<Department, "id">[] = [
  { name: "Management" },
  { name: "Engineering" },
  { name: "Sales" },
];

const mockFinancialYears: Omit<FinancialYear, "id">[] = [
  {
    name: "24/25",
    startDate: new Date("2024-04-01T00:00:00Z"),
    endDate: new Date("2025-03-31T23:59:59Z"),
  },
  {
    name: "25/26",
    startDate: new Date("2025-04-01T00:00:00Z"),
    endDate: new Date("2026-03-31T23:59:59Z"),
  },
];

const seededUserIds = ["usr_admin", "usr_manager", "usr_dev1", "usr_sales1"];
const seededDepartmentIds = ["dpt_mgmt", "dpt_eng", "dpt_sales"];
const seededFinancialYearIds = ["fy_2425", "fy_2526"];

const mockUserAllowances = {
  fy_2425: {
    usr_admin: { totalAllowance: 30 },
    usr_manager: { totalAllowance: 28 },
    usr_dev1: { totalAllowance: 25 },
    usr_sales1: { totalAllowance: 25 },
  },
  fy_2526: {
    usr_admin: { totalAllowance: 30 },
    usr_manager: { totalAllowance: 28 },
    usr_dev1: { totalAllowance: 25 },
    usr_sales1: { totalAllowance: 25 },
  },
};

const mockHolidayRequests: Omit<HolidayRequest, "id">[] = [
  {
    userId: "usr_dev1",
    financialYearId: "fy_2526",
    startDate: new Date("2025-07-14T00:00:00Z"),
    startType: "full",
    endDate: new Date("2025-07-18T00:00:00Z"),
    endType: "full",
    daysCount: 5,
    status: "approved",
    createdAt: new Date("2025-02-10T10:00:00Z"),
  },
  {
    userId: "usr_sales1",
    financialYearId: "fy_2526",
    startDate: new Date("2025-08-04T00:00:00Z"),
    startType: "full",
    endDate: new Date("2025-08-04T00:00:00Z"),
    endType: "full",
    daysCount: 1,
    status: "pending",
    createdAt: new Date("2025-06-20T11:00:00Z"),
  },
  {
    userId: "usr_dev1",
    financialYearId: "fy_2526",
    startDate: new Date("2025-12-22T00:00:00Z"),
    startType: "full",
    endDate: new Date("2026-01-02T00:00:00Z"),
    endType: "full",
    daysCount: 8,
    status: "pending",
    createdAt: new Date("2025-07-01T09:30:00Z"),
  },
];

async function seedDatabase(collections: {
  users: CollectionReference<User>;
  departments: CollectionReference<Department>;
  financialYears: CollectionReference<FinancialYear>;
  holidayRequests: CollectionReference<HolidayRequest>;
  allowances: CollectionReference<Allowance>;
}) {
  console.log("Checking if database is seeded...");

  const usersSnap = await getCountFromServer(collections.users);
  if (usersSnap.data().count > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  console.log("Seeding database...");
  const batch = writeBatch(db);

  mockUsers.forEach((user, index) => {
    const userRef = doc(collections.users, seededUserIds[index]);
    batch.set(userRef, user);
  });

  mockDepartments.forEach((department, index) => {
    const deptRef = doc(collections.departments, seededDepartmentIds[index]);
    batch.set(deptRef, department);
  });

  mockFinancialYears.forEach((fy, index) => {
    const fyRef = doc(
      collections.financialYears,
      seededFinancialYearIds[index]
    );
    batch.set(fyRef, fy);
  });

  mockHolidayRequests.forEach((req, index) => {
    const reqRef = doc(collections.holidayRequests, `req_${index + 1}`);
    batch.set(reqRef, req);
  });

  for (const [fyId, userAllowances] of Object.entries(mockUserAllowances)) {
    for (const [userId, allowance] of Object.entries(userAllowances)) {
      const allowanceRef = doc(collections.allowances, `${fyId}_${userId}`);
      batch.set(allowanceRef, { ...allowance, userId, financialYearId: fyId });
    }
  }

  await batch.commit();
  console.log("Database seeded successfully.");
}

export { seedDatabase };
