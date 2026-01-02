import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Users, 
  FileText, 
  Shield 
} from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Payroll Management',
    description: 'Automate salary calculations, tax deductions, and direct deposits with precision and compliance.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Clock,
    title: 'Attendance Tracking',
    description: 'Real-time attendance monitoring with biometric integration and flexible shift management.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Performance Reviews',
    description: 'Set goals, track progress, and conduct meaningful performance evaluations effortlessly.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Users,
    title: 'Employee Onboarding',
    description: 'Streamline the onboarding process with automated workflows and document management.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: FileText,
    title: 'Leave Management',
    description: 'Handle leave requests, approvals, and balance tracking with a self-service portal.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Compliance & Security',
    description: 'Stay compliant with labor laws and protect sensitive data with enterprise-grade security.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            Everything you need to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              manage your team
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to simplify HR operations and enhance employee experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass-card p-6 lg:p-8 h-full hover-lift cursor-pointer">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-display font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient border */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
