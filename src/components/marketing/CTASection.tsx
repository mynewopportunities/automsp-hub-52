import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-[hsl(109,30%,10%)]" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary-foreground/90 font-heading">
              Free 30-Minute Strategy Session
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 font-heading">
            Ready to Transform Your MSP Operations?
          </h2>

          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
            Join leading MSPs who have reduced ticket resolution time by 60% and eliminated SLA breaches with AutoMSP.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {['No commitment required', 'Custom ROI analysis', 'See live demo'].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-primary-foreground/80">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" className="shadow-glow-orange">
              Schedule Your Demo
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="lg">
              Talk to Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
