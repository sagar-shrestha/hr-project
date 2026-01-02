import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient: string;
  index: number;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, gradient, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card p-6 hover-lift"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', gradient)}>
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        {change && (
          <span
            className={cn(
              'text-sm font-medium px-2 py-1 rounded-full',
              changeType === 'positive' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              changeType === 'negative' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
              changeType === 'neutral' && 'bg-secondary text-muted-foreground'
            )}
          >
            {change}
          </span>
        )}
      </div>
      <h3 className="text-3xl font-display font-bold mb-1">{value}</h3>
      <p className="text-muted-foreground text-sm">{title}</p>
    </motion.div>
  );
}
