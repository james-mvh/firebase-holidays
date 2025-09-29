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
    // If user from cookie is valid, return it
    if (user) {
      return user;
    }
  }

  // If no cookie or invalid user ID in cookie, check for any available users
  const users = await getUsers();
  if (users.length > 0) {
    const defaultUser = users[0];
    // This is not a server action, so we can't SET the cookie here.
    // In a real app, the cookie would be set upon login.
    // For this prototype, we'll just return the default user.
    // The `switchUser` action *can* set the cookie.
    return defaultUser;
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
