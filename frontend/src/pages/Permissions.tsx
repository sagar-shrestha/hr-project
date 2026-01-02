import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Search, Filter, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AddPermissionDialog } from '@/components/permissions/AddPermissionDialog';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Permission {
    id: number;
    name: string;
    code: string;
}

export default function Permissions() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPermissions = async () => {
        try {
            const response = await api.get('/permissions');
            setPermissions(response.data);
        } catch (error) {
            console.error('Failed to fetch permissions', error);
            toast.error('Failed to load permissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this permission?')) return;

        try {
            await api.delete(`/permissions/${id}`);
            setPermissions(permissions.filter(p => p.id !== id));
            toast.success('Permission deleted successfully');
        } catch (error) {
            console.error('Failed to delete permission', error);
            toast.error('Failed to delete permission');
        }
    };

    const filteredPermissions = permissions.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
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
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h1 className="text-3xl font-display font-bold mb-2 flex items-center gap-2">
                                <Shield className="h-8 w-8 text-primary" />
                                Permissions Management
                            </h1>
                            <p className="text-muted-foreground">
                                Manage system-wide access controls and permission codes.
                            </p>
                        </motion.div>

                        <AddPermissionDialog onSuccess={fetchPermissions} />
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-card border rounded-xl p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or code..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-card border rounded-xl overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Permission Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Loading permissions...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredPermissions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No permissions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPermissions.map((permission, index) => (
                                        <TableRow key={permission.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell>{permission.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-mono">
                                                    {permission.code}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="gap-2 cursor-pointer">
                                                            <Edit2 className="h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                                            onClick={() => handleDelete(permission.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </motion.main>
        </div>
    );
}
