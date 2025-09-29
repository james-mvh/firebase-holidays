'use server';

import { cookies } from 'next/headers';
import { getUsers, getUserById } from './data';
import type { User } from './types';
import { revalidatePath } from 'next/cache';

const COOKIE_NAME = 'finyearly-user-id';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;

  if (userId) {
    const user = await getUserById(userId);
    if (user) {
      return user;
    }
  }

  // If no valid user found, return the first user as a default, 
  // but don't set the cookie here. The layout will handle ensuring the cookie is set.
  const users = await getUsers();
  if (users.length > 0) {
    return users[0];
  }

  return null;
}

export async function setCurrentUser(userId: string) {
  const user = await getUserById(userId);
  if (!user) {
    console.error(`Attempted to set non-existent user with id: ${userId}`);
    return;
  }
  cookies().set(COOKIE_NAME, userId);
  // Revalidate the entire site to reflect the new user's permissions and data
  revalidatePath('/', 'layout');
}

export async function ensureUserCookie() {
    const cookieStore = cookies();
    if (!cookieStore.has(COOKIE_NAME)) {
        const users = await getUsers();
        if (users.length > 0) {
            cookies().set(COOKIE_NAME, users[0].id);
            // Revalidate to ensure subsequent renders have the cookie
            revalidatePath('/', 'layout');
        }
    }
}