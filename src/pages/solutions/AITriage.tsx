import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Bot, Zap, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Bot,
    title: 'Natural Language Processing',
    description: 'Our AI understands the context and intent behind every ticket, not just keywords.',
  },
  {
    icon: Zap,
    title: 'Instant Classification',
    description: 'Tickets are categorized and prioritized in milliseconds, not minutes.',
  },
  {
    icon: Target,
    title: 'Smart Routing',
    description: 'Automatically route to the right technician based on skills and availability.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Learning',
    description: 'The AI improves over time by learning from your team\'s resolutions.',
  },
];

const benefits = [
  '60% reduction in first-response time',
  '95% accuracy in ticket classification',
  'Automatic priority assignment',
  'Reduced manual triage workload',
  'Consistent categorization across all tickets',
  'Integration with ServiceNow workflows',
];

const AITriage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">AI Ticket Triage</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Automate Ticket Classification with AI
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Stop wasting time manually reading and routing tickets. Our AI-powered triage system classifies, prioritizes, and routes incoming tickets in seconds.
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

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                How AI Triage Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our machine learning models are trained specifically on MSP data to understand your unique workflows.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={feature.title} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{index + 1}</div>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-heading">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6 font-heading">
                  Benefits of AI-Powered Triage
                </h2>
                <p className="text-muted-foreground mb-8">
                  MSPs using AutoMSP's AI Triage see immediate improvements in their service desk efficiency and client satisfaction.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center">
                <Bot className="w-32 h-32 text-primary/30" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="glass-card p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Ready to Automate Your Ticket Triage?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join hundreds of MSPs who have transformed their service desk with AI-powered automation.
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

export default AITriage;
