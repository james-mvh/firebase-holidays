import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  writeBatch,
  getCountFromServer,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  User,
  Department,
  FinancialYear,
  HolidayRequest,
  HolidayRequestStatus,
  UserRole,
} from "./types";
import { getSettings } from "./actions";
import { seedDatabase } from "./seedDatabase";

const collections = {
  users: collection(db, "users"),
  departments: collection(db, "departments"),
  financialYears: collection(db, "financialYears"),
  holidayRequests: collection(db, "holidayRequests"),
  allowances: collection(db, "allowances"),
};

// Generic converter
const createConverter = <T>() => ({
  toFirestore: (data: Partial<T>) => data,
  fromFirestore: (snapshot: any, options: any): T => {
    const data = snapshot.data(options);
    // Convert Firestore Timestamps to JS Dates
    for (const key in data) {
      if (data[key]?.toDate instanceof Function) {
        data[key] = data[key].toDate();
      }
    }
    return { id: snapshot.id, ...data } as T;
  },
});

const userConverter = createConverter<User>();
const departmentConverter = createConverter<Department>();
const financialYearConverter = createConverter<FinancialYear>();
const holidayRequestConverter = createConverter<HolidayRequest>();

// Ensure database is seeded on first load
seedDatabase(collections).catch(console.error);

// API Functions
export async function getUsers(): Promise<User[]> {
  const q = query(collections.users).withConverter(userConverter);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getUserById(id: string): Promise<User | undefined> {
  const docRef = doc(db, "users", id).withConverter(userConverter);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : undefined;
}

export async function addUser(
  userData: Omit<User, "id" | "createdAt" | "avatarUrl">
) {
  await addDoc(collections.users, {
    ...userData,
    createdAt: new Date(),
    avatarUrl: `https://i.pravatar.cc/150?u=${userData.email}`,
  });
}

export async function updateUser(
  id: string,
  userData: Partial<Omit<User, "id">>
) {
  const userRef = doc(db, "users", id);
  await updateDoc(userRef, userData);
}

export async function archiveUser(id: string, archived: boolean) {
  const userRef = doc(db, "users", id);
  await updateDoc(userRef, { archived });
}

export async function getDepartments(): Promise<Department[]> {
  const q = query(collections.departments).withConverter(departmentConverter);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getDepartmentById(
  id: string
): Promise<Department | undefined> {
  if (!id) return undefined;
  const docRef = doc(db, "departments", id).withConverter(departmentConverter);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : undefined;
}

export async function addDepartment(deptData: Omit<Department, "id">) {
  await addDoc(collections.departments, deptData);
}

export async function updateDepartment(
  id: string,
  deptData: Partial<Omit<Department, "id">>
) {
  const deptRef = doc(db, "departments", id);
  await updateDoc(deptRef, deptData);
}

export async function deleteDepartment(id: string) {
  const deptRef = doc(db, "departments", id);
  await deleteDoc(deptRef);
}

export async function getFinancialYears(): Promise<FinancialYear[]> {
  const q = query(
    collections.financialYears,
    orderBy("startDate", "asc")
  ).withConverter(financialYearConverter);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getUserAllowance(
  userId: string,
  financialYearId: string
): Promise<{ totalAllowance: number; holidaysTaken: number }> {
  const settings = await getSettings();
  const allowanceRef = doc(db, "allowances", `${financialYearId}_${userId}`);
  const allowanceSnap = await getDoc(allowanceRef);
  const totalAllowance = allowanceSnap.exists()
    ? allowanceSnap.data().totalAllowance
    : settings.defaultAllowance;

  const requestsQuery = query(
    collections.holidayRequests,
    where("userId", "==", userId),
    where("financialYearId", "==", financialYearId),
    where("status", "==", "approved")
  );

  const requestsSnap = await getDocs(requestsQuery);
  const holidaysTaken = requestsSnap.docs.reduce(
    (sum, doc) => sum + (doc.data().daysCount as number),
    0
  );

  return {
    totalAllowance,
    holidaysTaken,
  };
}

export async function getHolidayRequestsForUser(
  userId: string,
  financialYearId: string
): Promise<HolidayRequest[]> {
  const q = query(
    collections.holidayRequests,
    where("userId", "==", userId),
    where("financialYearId", "==", financialYearId),
    orderBy("createdAt", "desc")
  ).withConverter(holidayRequestConverter);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function createHolidayRequest(data: Omit<HolidayRequest, "id">) {
  await addDoc(collections.holidayRequests, data);
}

export async function deleteHolidayRequest(id: string) {
  await deleteDoc(doc(db, "holidayRequests", id));
}

export async function reviewHolidayRequest(
  id: string,
  status: HolidayRequestStatus,
  reviewedBy: string
) {
  const reqRef = doc(db, "holidayRequests", id);
  await updateDoc(reqRef, {
    status,
    reviewedBy,
    reviewedAt: new Date(),
  });
}

export async function getHolidaysForUser(
  userId: string,
  financialYearId: string
): Promise<HolidayRequest[]> {
  const q = query(
    collections.holidayRequests,
    where("userId", "==", userId),
    where("financialYearId", "==", financialYearId),
    where("status", "==", "approved")
  ).withConverter(holidayRequestConverter);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getUsersByDepartment(
  departmentId: string,
  includeArchived = false
): Promise<User[]> {
  let q;
  if (includeArchived) {
    q = query(
      collections.users,
      where("departmentId", "==", departmentId)
    ).withConverter(userConverter);
  } else {
    q = query(
      collections.users,
      where("departmentId", "==", departmentId),
      where("archived", "!=", true)
    ).withConverter(userConverter);
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getHolidaysForDepartment(
  departmentId: string,
  financialYearId: string
): Promise<HolidayRequest[]> {
  const usersInDept = await getUsersByDepartment(departmentId);
  if (usersInDept.length === 0) return [];

  const userIds = usersInDept.map((u) => u.id);

  const q = query(
    collections.holidayRequests,
    where("userId", "in", userIds),
    where("financialYearId", "==", financialYearId),
    where("status", "==", "approved")
  ).withConverter(holidayRequestConverter);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function getPendingRequestsForManager(
  managerId: string
): Promise<HolidayRequest[]> {
  const manager = await getUserById(managerId);
  if (!manager) return [];

  let usersToManage: User[] = [];

  // Admins can manage everyone
  if (manager.role === "admin") {
    const allUsers = await getUsers();
    usersToManage = allUsers.filter(
      (u) =>
        // u.id !== managerId &&
        !u.archived
    );
  }
  // Managers can manage their department
  else if (manager.role === "manager") {
    usersToManage = await getUsersByDepartment(manager.departmentId);
    // usersToManage = usersToManage.filter((u) => u.id !== managerId);
  }

  if (usersToManage.length === 0) return [];

  const userIdsToManage = usersToManage.map((u) => u.id);

  const q = query(
    collections.holidayRequests,
    where("userId", "in", userIdsToManage),
    where("status", "==", "pending")
  ).withConverter(holidayRequestConverter);

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}
