import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Workflow, GitBranch, Clock, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Workflow,
    title: 'Visual Workflow Builder',
    description: 'Design complex automation workflows with our intuitive drag-and-drop interface.',
  },
  {
    icon: GitBranch,
    title: 'Conditional Logic',
    description: 'Create branching workflows that adapt based on ticket properties and context.',
  },
  {
    icon: Clock,
    title: 'Time-Based Triggers',
    description: 'Automate escalations and follow-ups based on SLA timelines.',
  },
  {
    icon: Repeat,
    title: 'Reusable Templates',
    description: 'Save and share workflow templates across your organization.',
  },
];

const useCases = [
  {
    title: 'Automatic Escalation',
    description: 'Escalate tickets to senior technicians when SLA is at risk.',
  },
  {
    title: 'Client Notifications',
    description: 'Send automated updates to clients at key resolution milestones.',
  },
  {
    title: 'Resource Allocation',
    description: 'Dynamically assign resources based on ticket complexity and priority.',
  },
  {
    title: 'Quality Assurance',
    description: 'Route resolved tickets for QA review based on configurable criteria.',
  },
];

const IntelligentWorkflows = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Intelligent Workflows</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Automate Your Service Desk Processes
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Build powerful automation workflows that handle routine tasks, enforce best practices, and keep your service desk running smoothly.
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

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Powerful Workflow Capabilities
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to automate your MSP operations from end to end.
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

        {/* Use Cases */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6 font-heading">
                  Common Use Cases
                </h2>
                <p className="text-muted-foreground mb-8">
                  See how MSPs are using Intelligent Workflows to streamline their operations.
                </p>
                <div className="space-y-6">
                  {useCases.map((useCase) => (
                    <div key={useCase.title} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{useCase.title}</h3>
                        <p className="text-muted-foreground text-sm">{useCase.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center">
                <Workflow className="w-32 h-32 text-primary/30" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="glass-card p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Start Building Intelligent Workflows
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Transform your service desk with automation that works 24/7.
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

export default IntelligentWorkflows;
