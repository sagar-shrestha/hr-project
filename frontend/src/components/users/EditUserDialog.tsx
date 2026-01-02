import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
    RadioGroup,
    RadioGroupItem
} from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

const formSchema = z.object({
    role: z.string().min(1, 'Select a role'),
});

interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

interface EditUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserUpdated: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userRoles = userData.roles || [];
    const isSuperAdmin = userRoles.includes('ROLE_SUPER_ADMIN');
    const isAdmin = userRoles.includes('ROLE_ADMIN');

    const availableRoles = [
        { id: 'ROLE_USER', label: 'User' },
        ...(isSuperAdmin || isAdmin ? [{ id: 'ROLE_MODERATOR', label: 'Moderator' }] : []),
        ...(isSuperAdmin ? [{ id: 'ROLE_ADMIN', label: 'Admin' }] : []),
    ];
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: 'ROLE_USER',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                role: user.roles[0] || 'ROLE_USER',
            });
        }
    }, [user, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) return;

        setLoading(true);
        try {
            await api.put(`/users/${user.id}/roles`, [values.role]);
            toast({
                title: 'Success',
                description: 'User roles updated successfully',
            });
            onUserUpdated();
            onOpenChange(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update roles',
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User Roles</DialogTitle>
                    <DialogDescription>
                        Update roles for {user?.username}. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            {availableRoles.map((role) => (
                                                <FormItem key={role.id} className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={role.id} />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        {role.label}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
