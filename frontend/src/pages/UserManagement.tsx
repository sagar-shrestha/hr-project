import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Search,
    Trash2,
    Mail,
    ShieldCheck,
    MoreVertical,
    UserCircle,
    UserCog
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AddUserDialog } from '@/components/users/AddUserDialog';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import * as z from 'zod';

const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    roles: z.array(z.string()).min(1, 'Select at least one role'),
});

interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export default function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { toast } = useToast();

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserRoles = userData.roles || [];
    const isCurrentUserSuperAdmin = currentUserRoles.includes('ROLE_SUPER_ADMIN');
    const isCurrentUserAdmin = currentUserRoles.includes('ROLE_ADMIN');
    const isCurrentUserModerator = currentUserRoles.includes('ROLE_MODERATOR');

    const canManageUser = (targetRoles: string[]) => {
        if (isCurrentUserSuperAdmin) return true;
        if (isCurrentUserAdmin) {
            return !targetRoles.includes('ROLE_ADMIN') && !targetRoles.includes('ROLE_SUPER_ADMIN');
        }
        if (isCurrentUserModerator) {
            return targetRoles.every(role => role === 'ROLE_USER');
        }
        return false;
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to fetch users',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/users/${id}`);
            toast({
                title: 'Success',
                description: 'User deleted successfully',
            });
            fetchUsers();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete user',
            });
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <DashboardSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

            <motion.main
                initial={false}
                animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="pt-24 pb-8 px-6 lg:px-8"
            >
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold">User Management</h1>
                            <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
                        </div>
                        <AddUserDialog onUserAdded={fetchUsers} />
                    </div>

                    <Card className="border-border/50 shadow-soft overflow-hidden">
                        <CardHeader className="bg-card/50 border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>User</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                Loading users...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                                No users found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id} className="group transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-secondary/50 text-secondary-foreground">
                                                            <Users className="h-4 w-4" />
                                                        </div>
                                                        <span className="font-medium">{user.username}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Mail className="h-4 w-4" />
                                                        {user.email}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {user.roles.map((role) => (
                                                            <Badge
                                                                key={role}
                                                                variant={role === 'ROLE_SUPER_ADMIN' ? 'default' : 'secondary'}
                                                                className="text-[10px] py-0 h-5"
                                                            >
                                                                {role.replace('ROLE_', '')}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => navigate(`/dashboard/users/${user.id}`)}>
                                                                <UserCircle className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            {canManageUser(user.roles) && (
                                                                <>
                                                                    <DropdownMenuItem onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setEditDialogOpen(true);
                                                                    }}>
                                                                        <UserCog className="mr-2 h-4 w-4" />
                                                                        Edit Roles
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="text-destructive focus:text-destructive"
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Delete User
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </motion.main>

            <EditUserDialog
                user={selectedUser}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onUserUpdated={fetchUsers}
            />
        </div>
    );
}

// Removed local cn implementation to use the one from @/lib/utils
