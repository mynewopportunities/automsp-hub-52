import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Zap, Shield, Clock } from 'lucide-react';

const reasons = [
  {
    icon: Zap,
    title: 'Built for MSPs, By MSPs',
    description: 'Unlike generic automation tools, AutoMSP was designed specifically for Managed Service Providers. We understand your workflows, your challenges, and your clients.',
  },
  {
    icon: Shield,
    title: 'Native ServiceNow Integration',
    description: "We're not a bolt-on solution. AutoMSP integrates deeply with ServiceNow, leveraging its full capabilities while adding AI-powered automation.",
  },
  {
    icon: Clock,
    title: 'Fast Time to Value',
    description: 'Get up and running in days, not months. Our guided setup and pre-built templates mean you start seeing ROI from week one.',
  },
];

const comparisons = [
  { feature: 'Purpose-built for MSPs', automsp: true, others: false },
  { feature: 'Native ServiceNow integration', automsp: true, others: false },
  { feature: 'AI ticket classification', automsp: true, others: true },
  { feature: 'Skills-based routing', automsp: true, others: false },
  { feature: 'Churn prevention analytics', automsp: true, others: false },
  { feature: 'No-code workflow builder', automsp: true, others: true },
  { feature: 'SOC 2 compliance', automsp: true, others: false },
  { feature: 'Dedicated MSP support', automsp: true, others: false },
];

const WhyAutoMSP = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Why AutoMSP</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                The Smart Choice for MSP Automation
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                See why leading MSPs choose AutoMSP over generic automation tools and expensive consultants.
              </p>
              <Button variant="cta" size="lg">
                See It In Action
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Key Reasons */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {reasons.map((reason) => (
                <div key={reason.title} className="glass-card p-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <reason.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-heading">{reason.title}</h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                  AutoMSP vs. The Competition
                </h2>
                <p className="text-muted-foreground">
                  See how we stack up against generic automation tools
                </p>
              </div>

              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-heading text-foreground">Feature</th>
                      <th className="p-4 text-center font-heading text-primary">AutoMSP</th>
                      <th className="p-4 text-center font-heading text-muted-foreground">Others</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((row) => (
                      <tr key={row.feature} className="border-b border-border last:border-0">
                        <td className="p-4 text-foreground">{row.feature}</td>
                        <td className="p-4 text-center">
                          {row.automsp ? (
                            <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {row.others ? (
                            <CheckCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WhyAutoMSP;
