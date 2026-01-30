import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Shield, Bell, FileCheck, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Shield,
    title: 'Real-Time SLA Tracking',
    description: 'Monitor all active SLAs with live countdown timers and status indicators.',
  },
  {
    icon: Bell,
    title: 'Predictive Alerts',
    description: 'Get notified before SLA breaches happen, not after.',
  },
  {
    icon: FileCheck,
    title: 'Compliance Reporting',
    description: 'Generate detailed compliance reports for audits and client reviews.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Track SLA performance trends and identify improvement opportunities.',
  },
];

const metrics = [
  { value: '99.5%', label: 'SLA Compliance Rate' },
  { value: '45min', label: 'Avg. Early Warning' },
  { value: '80%', label: 'Fewer Breaches' },
  { value: '100%', label: 'Audit Ready' },
];

const ComplianceSLA = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Compliance & SLA</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Never Miss an SLA Again
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Real-time SLA tracking with predictive alerts ensures you meet your commitments every time. Stay compliant and keep clients happy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="cta" size="lg" asChild>
                  <Link to="/contact">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="py-16 bg-foreground">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-heading">
                    {metric.value}
                  </div>
                  <p className="text-primary-foreground/70">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Complete SLA Management
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to track, manage, and report on your service level agreements.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="glass-card p-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 font-heading">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits List */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center">
                <Shield className="w-32 h-32 text-primary/30" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6 font-heading">
                  Stay Compliant, Build Trust
                </h2>
                <p className="text-muted-foreground mb-8">
                  SLA compliance is more than meeting deadlines—it's about building trust with your clients.
                </p>
                <ul className="space-y-4">
                  {[
                    'Automated SLA escalation workflows',
                    'Client-facing SLA dashboards',
                    'Historical performance tracking',
                    'Custom SLA policy configuration',
                    'Multi-tier SLA support',
                    'Integration with ServiceNow SLAs',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="glass-card p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Take Control of Your SLAs
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join MSPs who have eliminated SLA breaches with proactive monitoring.
              </p>
              <Button variant="cta" size="lg" asChild>
                <Link to="/contact">
                  Schedule a Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ComplianceSLA;
