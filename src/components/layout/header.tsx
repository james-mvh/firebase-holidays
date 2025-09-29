import { SidebarTrigger } from '@/components/ui/sidebar';
import { FinancialYearSwitcher } from './financial-year-switcher';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-lg font-semibold md:text-xl font-headline hidden sm:block">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <FinancialYearSwitcher />
      </div>
    </header>
  );
}
