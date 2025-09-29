'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
