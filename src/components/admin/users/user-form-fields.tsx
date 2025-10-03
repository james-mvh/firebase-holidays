import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Department, User, UserRole } from '@/lib/types';

interface UserFormFieldsProps {
    user?: User;
    departments: Department[];
    errors?: Record<string, string[] | undefined>;
    currentUser?: User | null;
}

const roles: UserRole[] = ['user', 'manager', 'admin'];

export function UserFormFields({ user, departments, errors, currentUser }: UserFormFieldsProps) {
    const isAdmin = currentUser?.role === 'admin';
    return (
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={user?.name} />
                {errors?.name && <p className="text-sm font-medium text-destructive">{errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email} />
                {errors?.email && <p className="text-sm font-medium text-destructive">{errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={user?.role} disabled={!isAdmin}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map(role => (
                            <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors?.role && <p className="text-sm font-medium text-destructive">{errors.role[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <Select name="departmentId" defaultValue={user?.departmentId} disabled={!isAdmin}>
                    <SelectTrigger id="departmentId">
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {errors?.departmentId && <p className="text-sm font-medium text-destructive">{errors.departmentId[0]}</p>}
            </div>
        </div>
    )
}
