'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { UserNav } from './user-nav';
import { navLinks, type NavLink } from '@/config/nav-config';
import { useApp } from '@/context/app-provider';
import { Gem } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();
  const { currentUser } = useApp();

  if (!currentUser) return null;

  const userRole = currentUser.role;

  const accessibleLinks = navLinks.filter((link) => link.roles.includes(userRole));

  const linkGroups = accessibleLinks.reduce((acc, link) => {
    const group = link.group || 'General';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(link);
    return acc;
  }, {} as Record<string, NavLink[]>);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Gem className="size-6 text-primary" />
            <h1 className="text-xl font-bold font-headline">FinYearly</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {Object.entries(linkGroups).map(([groupName, links]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
            <SidebarMenu>
              {links.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === link.href}
                    tooltip={link.label}
                  >
                    <a href={link.href}>
                      <link.icon />
                      <span>{link.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Separator className="my-2" />
        <UserNav />
      </SidebarFooter>
    </>
  );
}
