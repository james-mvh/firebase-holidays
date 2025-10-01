'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  addDepartment as dbAddDepartment,
  updateDepartment as dbUpdateDepartment,
  deleteDepartment as dbDeleteDepartment,
  addUser as dbAddUser,
  updateUser as dbUpdateUser,
  archiveUser as dbArchiveUser,
  createHolidayRequest as dbCreateHolidayRequest,
  deleteHolidayRequest as dbDeleteHolidayRequest,
  reviewHolidayRequest as dbReviewHolidayRequest,
} from './data';
import { getDaysBetween, getPublicHolidays } from './dates';

const settingsSchema = z.object({
  defaultAllowance: z.coerce.number().min(0, 'Allowance must be a positive number.'),
});

// This is a placeholder for where you would save to a database.
let appSettings = {
  defaultAllowance: 25,
};

export async function updateSettings(prevState: any, formData: FormData) {
  const validatedFields = settingsSchema.safeParse({
    defaultAllowance: formData.get('defaultAllowance'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update settings.',
    };
  }
  
  // In a real app, you would save this to your database.
  appSettings.defaultAllowance = validatedFields.data.defaultAllowance;
  console.log('Updated settings:', appSettings);
  
  revalidatePath('/admin/settings');
  return {
    message: 'Settings updated successfully.',
  };
}

// In a real app, you would fetch this from your database.
export async function getSettings() {
    return appSettings;
}


// Department Actions
const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Department name is required.'),
});

export async function addDepartment(prevState: any, formData: FormData) {
    const validatedFields = departmentSchema.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to add department.',
        };
    }

    try {
        await dbAddDepartment(validatedFields.data);
        revalidatePath('/admin/departments');
        return { message: 'Department added successfully.' };
    } catch (e) {
        return { message: 'Database error: Failed to add department.' };
    }
}

export async function updateDepartment(prevState: any, formData: FormData) {
    const validatedFields = departmentSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to update department.',
        };
    }
    
    if (!validatedFields.data.id) {
        return { message: 'Department ID is missing.' };
    }

    try {
        await dbUpdateDepartment(validatedFields.data.id, validatedFields.data);
        revalidatePath('/admin/departments');
        return { message: 'Department updated successfully.' };
    } catch (e) {
        return { message: 'Database error: Failed to update department.' };
    }
}

export async function deleteDepartment(id: string) {
    try {
        await dbDeleteDepartment(id);
        revalidatePath('/admin/departments');
        return { message: 'Department deleted successfully.' };
    } catch (e) {
        return { message: 'Database error: Failed to delete department.' };
    }
}


// User Actions
const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  role: z.enum(['user', 'manager', 'admin']),
  departmentId: z.string().min(1, "Department is required."),
});

export async function addUser(prevState: any, formData: FormData) {
    const validatedFields = userSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
    }

    try {
        await dbAddUser(validatedFields.data);
        revalidatePath('/admin/users');
        return { message: 'User added successfully.' };
    } catch (e) {
        return { message: 'Database error: Failed to add user.' };
    }
}

export async function updateUser(prevState: any, formData: FormData) {
    const validatedFields = userSchema.safeParse(Object.fromEntries(formData.entries()));
     if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
    }
    const id = formData.get('id') as string;
    if (!id) return { message: 'User ID is missing.' };


    try {
        await dbUpdateUser(id, validatedFields.data);
        revalidatePath('/admin/users');
        revalidatePath(`/my-profile`);
        return { message: 'User updated successfully.' };
    } catch (e) {
        return { message: 'Database error: Failed to update user.' };
    }
}

export async function archiveUser(id: string) {
     try {
        await dbArchiveUser(id, true);
        revalidatePath('/admin/users');
        return { message: 'User archived successfully.' };
    } catch (e) {
        return { message: 'Database error: Failed to archive user.' };
    }
}

// Holiday Request Actions
const holidayRequestSchema = z.object({
    userId: z.string(),
    financialYearId: z.string(),
    dateRange: z.object({
        from: z.date(),
        to: z.date().optional(),
    }),
    startType: z.enum(['full', 'am', 'pm']),
    endType: z.enum(['full', 'am', 'pm']),
});


export async function createHolidayRequest(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = holidayRequestSchema.safeParse({
        userId: rawData.userId,
        financialYearId: rawData.financialYearId,
        dateRange: {
            from: new Date(rawData['dateRange.from'] as string),
            to: rawData['dateRange.to'] ? new Date(rawData['dateRange.to'] as string) : undefined,
        },
        startType: rawData.startType,
        endType: rawData.endType,
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors, message: "Validation failed." };
    }

    const { userId, financialYearId, dateRange, startType, endType } = validatedFields.data;
    const startDate = dateRange.from;
    const endDate = dateRange.to || dateRange.from;
    
    // Basic validation
    if (endDate < startDate) {
        return { message: "End date cannot be before start date." };
    }

    const publicHolidays = await getPublicHolidays(startDate.getFullYear());
    const daysCount = getDaysBetween(startDate, endDate, publicHolidays, startType, endType);

    if (daysCount <= 0) {
        return { message: "The selected range contains no working days." };
    }
    
    const remainingDays = parseFloat(rawData.remainingDays as string);
    if (daysCount > remainingDays) {
      return { message: `You only have ${remainingDays} days remaining.` };
    }


    try {
        await dbCreateHolidayRequest({
            userId,
            financialYearId,
            startDate,
            endDate,
            startType,
            endType,
            daysCount,
            status: 'pending',
            createdAt: new Date(),
        });
        revalidatePath('/requests');
        revalidatePath('/my-holidays');
        revalidatePath('/my-profile');
        return { message: 'Holiday request created successfully.' };
    } catch (e) {
        return { message: `Database error: ${(e as Error).message}` };
    }
}

export async function cancelHolidayRequest(id: string) {
    try {
        await dbDeleteHolidayRequest(id);
        revalidatePath('/requests');
        revalidatePath('/my-holidays');
        revalidatePath('/my-profile');
        return { message: 'Request cancelled.' };
    } catch (e) {
        return { message: `Database error: ${(e as Error).message}` };
    }
}

export async function reviewRequest(requestId: string, newStatus: 'approved' | 'denied', managerId: string) {
    try {
        await dbReviewHolidayRequest(requestId, newStatus, managerId);
        revalidatePath('/authorisation');
        return { message: `Request ${newStatus}.` };
    } catch (e) {
        return { message: `Database error: ${(e as Error).message}` };
    }
}
