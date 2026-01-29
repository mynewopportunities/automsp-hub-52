import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Connect',
    description: 'Integrate AutoMSP with your ServiceNow instance in minutes. No complex setup required.',
  },
  {
    number: '02',
    title: 'Configure',
    description: 'Set your routing rules, SLA thresholds, and automation preferences with our intuitive wizard.',
  },
  {
    number: '03',
    title: 'Automate',
    description: 'Let AI handle ticket classification, routing, and priority assignment automatically.',
  },
  {
    number: '04',
    title: 'Optimize',
    description: 'Use analytics insights to continuously improve your MSP operations and client satisfaction.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-title pl-10 mb-4 inline-block">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-heading">
            Get Started in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground">
            From integration to automation in less than a day. Our team guides you every step of the way.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent z-0">
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary font-heading">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 font-heading">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
