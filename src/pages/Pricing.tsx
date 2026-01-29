import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Star } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'For small MSPs getting started with automation',
    price: '$499',
    period: '/month',
    features: [
      'Up to 500 tickets/month',
      'AI ticket triage',
      'Basic routing',
      'Email support',
      'ServiceNow integration',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing MSPs who need advanced features',
    price: '$999',
    period: '/month',
    features: [
      'Up to 2,000 tickets/month',
      'Advanced AI triage',
      'Smart technician routing',
      'SLA management',
      'Client portal',
      'Priority support',
      'Custom workflows',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large MSPs with complex requirements',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited tickets',
      'All Professional features',
      'Churn prevention analytics',
      'Custom integrations',
      'Dedicated success manager',
      'SLA guarantee',
      'On-premise option',
      'SOC 2 compliance',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Pricing</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose the plan that fits your MSP. All plans include a 14-day free trial with no credit card required.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-8 ${
                    plan.popular
                      ? 'bg-foreground text-background border-2 border-primary shadow-glow-green'
                      : 'bg-card border border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                        <Star className="w-4 h-4" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <h3 className={`text-xl font-bold mb-2 font-heading ${plan.popular ? 'text-background' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-background/70' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className={`text-4xl font-bold font-heading ${plan.popular ? 'text-background' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    <span className={plan.popular ? 'text-background/70' : 'text-muted-foreground'}>
                      {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-primary' : 'text-primary'}`} />
                        <span className={plan.popular ? 'text-background/90' : 'text-foreground'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? 'cta' : 'outline'}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
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

export default Pricing;
