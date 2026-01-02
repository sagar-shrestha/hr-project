import { motion } from 'framer-motion';
import { UserPlus, CheckCircle, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { name: 'Add Employee', icon: UserPlus, variant: 'default' as const },
  { name: 'Approve Leave', icon: CheckCircle, variant: 'secondary' as const },
  { name: 'Run Payroll', icon: FileText, variant: 'secondary' as const },
  { name: 'Schedule Review', icon: Calendar, variant: 'secondary' as const },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass-card p-6"
    >
      <h2 className="text-lg font-display font-semibold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
          >
            <Button
              variant={action.variant}
              className="w-full h-auto py-4 flex flex-col gap-2"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.name}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
