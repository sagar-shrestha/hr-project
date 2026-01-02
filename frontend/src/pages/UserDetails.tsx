import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Shield,
    Calendar,
    User as UserIcon,
    History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // In a real app, we'd have a GET /users/{id} endpoint
                // For now, we'll fetch all and filter or just use the management page's data
                const response = await api.get('/users');
                const foundUser = response.data.find((u: User) => u.id === Number(id));
                if (foundUser) {
                    setUser(foundUser);
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'User not found',
                    });
                    navigate('/dashboard/users');
                }
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to fetch user details',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, navigate, toast]);

    if (loading) {
        return <div className="p-8 flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background flex">
            <DashboardSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <div className={cn(
                "flex-1 transition-all duration-300",
                sidebarCollapsed ? "pl-20" : "pl-[280px]"
            )}>
                <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

                <main className="p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <Button
                            variant="ghost"
                            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => navigate('/dashboard/users')}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Users
                        </Button>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <UserIcon className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-display font-bold">{user.username}</h1>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="md:col-span-2 border-border/50 shadow-soft">
                                <CardHeader>
                                    <CardTitle className="text-lg">Account Information</CardTitle>
                                    <CardDescription>Basic details about the user account</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Username</p>
                                            <p className="font-medium">{user.username}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">User ID</p>
                                            <p className="font-mono text-xs">#{user.id}</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-3">Assigned Roles</p>
                                        <div className="flex flex-wrap gap-2">
                                            {user.roles.map((role) => (
                                                <Badge
                                                    key={role}
                                                    variant={role === 'ROLE_SUPER_ADMIN' ? 'default' : 'secondary'}
                                                    className="px-3 py-1"
                                                >
                                                    <Shield className="h-3 w-3 mr-1.5" />
                                                    {role.replace('ROLE_', '')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 shadow-soft h-fit">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <History className="h-4 w-4 text-primary" />
                                        Recent Activity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                            <div>
                                                <p className="text-sm font-medium">Account created</p>
                                                <p className="text-xs text-muted-foreground">Initial registration</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground py-4 italic">
                                            Activity logging coming soon
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
