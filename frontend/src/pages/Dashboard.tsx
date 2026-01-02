import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Briefcase, TrendingUp } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';

const stats = [
  {
    title: 'Total Employees',
    value: '2,847',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  },
  {
    title: 'On Leave Today',
    value: '24',
    change: '-5%',
    changeType: 'negative' as const,
    icon: Calendar,
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',
  },
  {
    title: 'Open Positions',
    value: '18',
    change: '+3',
    changeType: 'positive' as const,
    icon: Briefcase,
    gradient: 'bg-gradient-to-br from-violet-500 to-purple-500',
  },
  {
    title: 'Upcoming Reviews',
    value: '56',
    change: 'This week',
    changeType: 'neutral' as const,
    icon: TrendingUp,
    gradient: 'bg-gradient-to-br from-emerald-500 to-teal-500',
  },
];

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pt-24 pb-8 px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-display font-bold mb-2">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your team today.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={stat.title} {...stat} index={index} />
            ))}
          </div>

          {/* Chart and Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AttendanceChart />
            </div>
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <RecentActivity />
          </div>
        </div>
      </motion.main>
    </div>
  );
}
