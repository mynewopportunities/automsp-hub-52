import { Bot, Zap, Shield, BarChart3, Users, Clock } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI Ticket Triage',
    description: 'Automatically classify and prioritize incoming tickets using advanced machine learning trained on MSP-specific data.',
  },
  {
    icon: Zap,
    title: 'Intelligent Routing',
    description: 'Route tickets to the right technician based on skills, workload, and availability - reducing resolution time by 60%.',
  },
  {
    icon: Shield,
    title: 'SLA Management',
    description: 'Real-time SLA tracking with predictive alerts to prevent breaches before they happen.',
  },
  {
    icon: BarChart3,
    title: 'Churn Prevention',
    description: 'Identify at-risk clients early with sentiment analysis and engagement scoring.',
  },
  {
    icon: Users,
    title: 'Client Portal',
    description: 'Give clients a modern self-service portal with real-time ticket status and knowledge base.',
  },
  {
    icon: Clock,
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and create custom workflows without coding.',
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-title pl-10 mb-4 inline-block">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
            Everything You Need to Scale Your MSP
          </h2>
          <p className="text-lg text-muted-foreground">
            Built specifically for Managed Service Providers on ServiceNow, AutoMSP delivers enterprise-grade automation without the complexity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:shadow-lg transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 font-heading">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
