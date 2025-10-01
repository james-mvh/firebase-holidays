import { collection, doc, getDoc, getDocs, setDoc, query, where, writeBatch, getCountFromServer, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { User, Department, FinancialYear, HolidayRequest, HolidayRequestStatus, UserRole } from './types';
import { getSettings } from './actions';

// Mock Data for seeding
const mockUsers: Omit<User, 'id'>[] = [
  {
    name: 'Admin User',
    email: 'admin@finyearly.com',
    role: 'admin',
    departmentId: 'dpt_mgmt',
    createdAt: new Date('2023-01-10T10:00:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=admin@finyearly.com',
  },
  {
    name: 'Manager User',
    email: 'manager@finyearly.com',
    role: 'manager',
    departmentId: 'dpt_eng',
    createdAt: new Date('2023-01-15T11:00:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=manager@finyearly.com',
  },
  {
    name: 'Dev One',
    email: 'dev1@finyearly.com',
    role: 'user',
    departmentId: 'dpt_eng',
    createdAt: new Date('2023-02-01T09:00:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=dev1@finyearly.com',
  },
  {
    name: 'Sales Person',
    email: 'sales1@finyearly.com',
    role: 'user',
    departmentId: 'dpt_sales',
    createdAt: new Date('2023-02-05T14:00:00Z'),
    avatarUrl: 'https://i.pravatar.cc/150?u=sales1@finyearly.com',
  },
];

const mockDepartments: Omit<Department, 'id'>[] = [
    { name: 'Management' },
    { name: 'Engineering' },
    { name: 'Sales' },
];

const mockFinancialYears: Omit<FinancialYear, 'id'>[] = [
    {
        name: '24/25',
        startDate: new Date('2024-04-01T00:00:00Z'),
        endDate: new Date('2025-03-31T23:59:59Z'),
    },
    {
        name: '25/26',
        startDate: new Date('2025-04-01T00:00:00Z'),
        endDate: new Date('2026-03-31T23:59:59Z'),
    },
];

const seededUserIds = ['usr_admin', 'usr_manager', 'usr_dev1', 'usr_sales1'];
const seededDepartmentIds = ['dpt_mgmt', 'dpt_eng', 'dpt_sales'];
const seededFinancialYearIds = ['fy_2425', 'fy_2526'];

const mockUserAllowances = {
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
};

const mockHolidayRequests: Omit<HolidayRequest, 'id'>[] = [
    {
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
];

const collections = {
    users: collection(db, 'users'),
    departments: collection(db, 'departments'),
    financialYears: collection(db, 'financialYears'),
    holidayRequests: collection(db, 'holidayRequests'),
    allowances: collection(db, 'allowances')
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
    }
});

const userConverter = createConverter<User>();
const departmentConverter = createConverter<Department>();
const financialYearConverter = createConverter<FinancialYear>();
const holidayRequestConverter = createConverter<HolidayRequest>();


async function seedDatabase() {
    console.log('Checking if database is seeded...');

    const usersSnap = await getCountFromServer(collections.users);
    if (usersSnap.data().count > 0) {
        console.log('Database already seeded. Skipping.');
        return;
    }

    console.log('Seeding database...');
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
        const fyRef = doc(collections.financialYears, seededFinancialYearIds[index]);
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
    console.log('Database seeded successfully.');
}

// Ensure database is seeded on first load
seedDatabase().catch(console.error);

// API Functions
export async function getUsers(): Promise<User[]> {
    const q = query(collections.users).withConverter(userConverter);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

export async function getUserById(id: string): Promise<User | undefined> {
    const docRef = doc(db, 'users', id).withConverter(userConverter);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : undefined;
}

export async function addUser(userData: Omit<User, 'id' | 'createdAt' | 'avatarUrl'>) {
    await addDoc(collections.users, {
        ...userData,
        createdAt: new Date(),
        avatarUrl: `https://i.pravatar.cc/150?u=${userData.email}`,
    });
}

export async function updateUser(id: string, userData: Partial<Omit<User, 'id'>>) {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, userData);
}

export async function archiveUser(id: string, archived: boolean) {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, { archived });
}

export async function getDepartments(): Promise<Department[]> {
    const q = query(collections.departments).withConverter(departmentConverter);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

export async function getDepartmentById(id: string): Promise<Department | undefined> {
    if (!id) return undefined;
    const docRef = doc(db, 'departments', id).withConverter(departmentConverter);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : undefined;
}

export async function addDepartment(deptData: Omit<Department, 'id'>) {
    await addDoc(collections.departments, deptData);
}

export async function updateDepartment(id: string, deptData: Partial<Omit<Department, 'id'>>) {
    const deptRef = doc(db, 'departments', id);
    await updateDoc(deptRef, deptData);
}

export async function deleteDepartment(id: string) {
    const deptRef = doc(db, 'departments', id);
    await deleteDoc(deptRef);
}


export async function getFinancialYears(): Promise<FinancialYear[]> {
    const q = query(collections.financialYears, orderBy('startDate', 'asc')).withConverter(financialYearConverter);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

export async function getUserAllowance(userId: string, financialYearId: string): Promise<{ totalAllowance: number, holidaysTaken: number }> {
    const settings = await getSettings();
    const allowanceRef = doc(db, 'allowances', `${financialYearId}_${userId}`);
    const allowanceSnap = await getDoc(allowanceRef);
    const totalAllowance = allowanceSnap.exists() ? allowanceSnap.data().totalAllowance : settings.defaultAllowance;

    const requestsQuery = query(
        collections.holidayRequests,
        where('userId', '==', userId),
        where('financialYearId', '==', financialYearId),
        where('status', '==', 'approved')
    );

    const requestsSnap = await getDocs(requestsQuery);
    const holidaysTaken = requestsSnap.docs.reduce((sum, doc) => sum + (doc.data().daysCount as number), 0);

    return {
        totalAllowance,
        holidaysTaken,
    };
}


export async function getHolidayRequestsForUser(userId: string, financialYearId: string): Promise<HolidayRequest[]> {
    const q = query(
        collections.holidayRequests,
        where('userId', '==', userId),
        where('financialYearId', '==', financialYearId),
        orderBy('createdAt', 'desc')
    ).withConverter(holidayRequestConverter);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

export async function createHolidayRequest(data: Omit<HolidayRequest, 'id'>) {
    await addDoc(collections.holidayRequests, data);
}

export async function deleteHolidayRequest(id: string) {
    await deleteDoc(doc(db, 'holidayRequests', id));
}

export async function reviewHolidayRequest(id: string, status: HolidayRequestStatus, reviewedBy: string) {
    const reqRef = doc(db, 'holidayRequests', id);
    await updateDoc(reqRef, {
        status,
        reviewedBy,
        reviewedAt: new Date()
    });
}

export async function getHolidaysForUser(userId: string, financialYearId: string): Promise<HolidayRequest[]> {
    const q = query(
        collections.holidayRequests,
        where('userId', '==', userId),
        where('financialYearId', '==', financialYearId),
        where('status', '==', 'approved')
    ).withConverter(holidayRequestConverter);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

export async function getUsersByDepartment(departmentId: string): Promise<User[]> {
    const q = query(
        collections.users,
        where('departmentId', '==', departmentId)
    ).withConverter(userConverter);
    const snapshot = await getDocs(q);
    // Filter for non-archived users in code
    return snapshot.docs.map(doc => doc.data()).filter(user => !user.archived);
}

export async function getHolidaysForDepartment(departmentId: string, financialYearId: string): Promise<HolidayRequest[]> {
     const usersInDept = await getUsersByDepartment(departmentId);
     if (usersInDept.length === 0) return [];
     
     const userIds = usersInDept.map(u => u.id);

     const q = query(
        collections.holidayRequests,
        where('userId', 'in', userIds),
        where('financialYearId', '==', financialYearId),
        where('status', '==', 'approved')
    ).withConverter(holidayRequestConverter);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}

export async function getPendingRequestsForManager(managerId: string): Promise<HolidayRequest[]> {
    const manager = await getUserById(managerId);
    if (!manager) return [];

    let usersToManage: User[] = [];

    // Admins can manage everyone
    if (manager.role === 'admin') {
        const allUsers = await getUsers();
        usersToManage = allUsers.filter(u => u.id !== managerId && !u.archived);
    } 
    // Managers can manage their department
    else if (manager.role === 'manager') {
        usersToManage = await getUsersByDepartment(manager.departmentId);
        usersToManage = usersToManage.filter(u => u.id !== managerId);
    }
    
    if (usersToManage.length === 0) return [];

    const userIdsToManage = usersToManage.map(u => u.id);

    const q = query(
        collections.holidayRequests,
        where('userId', 'in', userIdsToManage),
        where('status', '==', 'pending')
    ).withConverter(holidayRequestConverter);

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}
