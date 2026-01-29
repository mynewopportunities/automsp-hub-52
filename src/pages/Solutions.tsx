import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Bot, Users, Shield, BarChart3 } from 'lucide-react';

const solutions = [
  {
    icon: Bot,
    title: 'AI Ticket Triage',
    description: 'Automatically classify, prioritize, and route incoming tickets using machine learning trained on MSP-specific data. Reduce first-response time by 60% while improving accuracy.',
    features: [
      'Natural language understanding for ticket content',
      'Automatic priority assignment based on urgency',
      'Intelligent categorization and tagging',
      'Learning from historical resolution patterns',
    ],
  },
  {
    icon: Users,
    title: 'Smart Technician Routing',
    description: 'Match tickets to the right technician based on skills, availability, and workload. Ensure first-time resolution and balanced team utilization.',
    features: [
      'Skills-based matching algorithm',
      'Real-time workload balancing',
      'Availability and schedule awareness',
      'Escalation path optimization',
    ],
  },
  {
    icon: Shield,
    title: 'SLA Management & Compliance',
    description: 'Real-time SLA tracking with predictive alerts. Never miss a deadline with automated escalations and compliance reporting.',
    features: [
      'Real-time SLA countdown dashboards',
      'Predictive breach alerts',
      'Automated escalation workflows',
      'Compliance audit trails',
    ],
  },
  {
    icon: BarChart3,
    title: 'Churn Prevention Analytics',
    description: 'Identify at-risk clients before they leave. Our AI analyzes engagement patterns, sentiment, and ticket trends to flag clients needing attention.',
    features: [
      'Client health scoring',
      'Sentiment analysis on communications',
      'Engagement trend monitoring',
      'Proactive alert system',
    ],
  },
];

const Solutions = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Solutions</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                AI-Powered Solutions for Modern MSPs
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Transform your service desk with intelligent automation that learns and improves over time. Built specifically for ServiceNow.
              </p>
              <Button variant="cta" size="lg">
                Schedule a Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Solutions List */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="space-y-24">
              {solutions.map((solution, index) => (
                <div
                  key={solution.title}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <solution.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">{solution.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{solution.description}</p>
                    <ul className="space-y-3">
                      {solution.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center">
                      <solution.icon className="w-24 h-24 text-primary/30" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Solutions;
