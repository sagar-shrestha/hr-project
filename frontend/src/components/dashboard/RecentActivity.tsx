import { motion } from 'framer-motion';
import { Calendar, UserPlus, FileCheck, Clock } from 'lucide-react';

const activities = [
  {
    id: 1,
    icon: Calendar,
    iconBg: 'bg-blue-500/10 text-blue-500',
    title: 'John Doe requested leave',
    description: 'Annual leave - Dec 24 to Dec 31',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: UserPlus,
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    title: 'Sarah Smith completed onboarding',
    description: 'New hire - Marketing Department',
    time: '4 hours ago',
  },
  {
    id: 3,
    icon: FileCheck,
    iconBg: 'bg-violet-500/10 text-violet-500',
    title: 'Performance review submitted',
    description: 'Q4 review for Engineering team',
    time: '6 hours ago',
  },
  {
    id: 4,
    icon: Clock,
    iconBg: 'bg-amber-500/10 text-amber-500',
    title: 'Overtime request approved',
    description: 'Michael Johnson - 4 extra hours',
    time: '1 day ago',
  },
];

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="glass-card p-6"
    >
      <h2 className="text-lg font-display font-semibold mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.iconBg}`}>
              <activity.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{activity.title}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
