'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';
import type { User, FinancialYear } from '@/lib/types';
import { setCurrentUser as setServerCurrentUser } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';

interface AppContextType {
  currentUser: User | null;
  financialYears: FinancialYear[];
  selectedFinancialYear: FinancialYear | null;
  selectFinancialYear: (yearId: string) => void;
  switchUser: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({
  children,
  initialUser,
  initialFinancialYears,
  initialSelectedFinancialYear,
}: {
  children: ReactNode;
  initialUser: User | null;
  initialFinancialYears: FinancialYear[];
  initialSelectedFinancialYear: FinancialYear | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<FinancialYear | null>(initialSelectedFinancialYear);

  const selectFinancialYear = (yearId: string) => {
    const year = initialFinancialYears.find((fy) => fy.id === yearId);
    if (year) {
      setSelectedFinancialYear(year);
      const params = new URLSearchParams(window.location.search);
      params.set('fy', year.id);
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  const switchUser = async (userId: string) => {
    await setServerCurrentUser(userId);
    // The server action revalidates and the layout will re-render with the new user.
    // For a smoother client-side update, we can optimisticly update here,
    // but a full reload is safer to ensure all server components get the new user.
    window.location.reload();
  };

  const contextValue = useMemo(
    () => ({
      currentUser,
      financialYears: initialFinancialYears,
      selectedFinancialYear,
      selectFinancialYear,
      switchUser,
    }),
    [currentUser, initialFinancialYears, selectedFinancialYear]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
