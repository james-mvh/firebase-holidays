import type { LucideIcon } from "lucide-react";
import {
  Users,
  Building,
  Settings,
  ShieldCheck,
  Calendar,
  CalendarDays,
  User,
  Send,
  Code,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
  group?: string;
}

export const navLinks: NavLink[] = [
  {
    href: "/my-holidays",
    label: "My Holidays",
    icon: Calendar,
    roles: ["user", "manager", "admin"],
    group: "My Space",
  },
  {
    href: "/team-holidays",
    label: "Team Holidays",
    icon: CalendarDays,
    roles: ["user", "manager", "admin"],
    group: "My Space",
  },
  {
    href: "/my-profile",
    label: "My Profile",
    icon: User,
    roles: ["user", "manager", "admin"],
    group: "My Space",
  },
  {
    href: "/requests",
    label: "Requests",
    icon: Send,
    roles: ["user", "manager", "admin"],
    group: "My Space",
  },
  {
    href: "/authorisation",
    label: "Authorisation",
    icon: ShieldCheck,
    roles: ["manager", "admin"],
    group: "Management",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    roles: ["admin"],
    group: "Admin",
  },
  {
    href: "/admin/departments",
    label: "Departments",
    icon: Building,
    roles: ["admin"],
    group: "Admin",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    roles: ["admin"],
    group: "Admin",
  },
  {
    href: "/dev/settings",
    label: "Settings",
    icon: Code,
    roles: ["user", "manager", "admin"],
    group: "Dev",
  },
];
