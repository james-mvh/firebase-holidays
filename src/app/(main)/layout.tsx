import type { ReactNode } from 'react';
import { Sidebar, SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/layout/main-nav';
import { Header } from '@/components/layout/header';
import { getCurrentUser } from '@/lib/auth';
import { getFinancialYears } from '@/lib/data';
import { redirect } from 'next/navigation';
import { AppProvider } from '@/context/app-provider';

export default async function MainLayout({
  children,
  searchParams,
}: {
  children: ReactNode;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    // In a real app, you'd redirect to a sign-in page.
    // For now, we'll just show an error or a blank page as we should always have a default user.
    return (
      <div className="flex h-screen items-center justify-center">
        No users found. Please configure users.
      </div>
    );
  }

  const financialYears = await getFinancialYears();
  const fyParam = searchParams?.fy as string | undefined;
  const selectedFinancialYear = financialYears.find(fy => fy.id === fyParam) ?? financialYears[financialYears.length - 1] ?? null;

  return (
    <AppProvider
      initialUser={currentUser}
      initialFinancialYears={financialYears}
      initialSelectedFinancialYear={selectedFinancialYear}
    >
      <SidebarProvider>
        <Sidebar>
          <MainNav />
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
