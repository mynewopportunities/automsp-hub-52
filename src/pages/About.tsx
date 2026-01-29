import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Target, Award, Globe } from 'lucide-react';

const stats = [
  { value: '50+', label: 'MSP Partners' },
  { value: '100K+', label: 'Tickets Processed' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9/5', label: 'Customer Rating' },
];

const values = [
  {
    icon: Target,
    title: 'Customer Obsession',
    description: 'Every decision we make starts with our customers. Your success is our success.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We never settle for good enough. Continuous improvement is in our DNA.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work together with our customers to build solutions that truly work.',
  },
  {
    icon: Globe,
    title: 'Innovation',
    description: 'We leverage cutting-edge AI to solve real problems for MSPs.',
  },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">About Us</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Building the Future of MSP Automation
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                AutoMSP was founded by MSP veterans who understood the pain of manual ticket handling. We're on a mission to give every MSP access to enterprise-grade automation.
              </p>
              <Button variant="cta" size="lg">
                Join Our Team
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-foreground">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-heading">
                    {stat.value}
                  </div>
                  <p className="text-primary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-title pl-10 mb-4 inline-block">Our Story</span>
                <h2 className="text-3xl font-bold text-foreground mb-6 font-heading">
                  From MSP Pain Points to AI Solutions
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    AutoMSP started in 2023 when our founders, both former MSP operators, realized that small and mid-sized MSPs were being left behind in the AI revolution.
                  </p>
                  <p>
                    While enterprise companies had access to sophisticated automation tools, most MSPs were still manually triaging tickets, routing work, and hoping they wouldn't miss an SLA.
                  </p>
                  <p>
                    We built AutoMSP to change that. Our platform brings enterprise-grade AI automation to MSPs of all sizes, specifically designed for ServiceNow environments.
                  </p>
                </div>
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-primary font-heading">A</span>
                  </div>
                  <p className="text-muted-foreground">AutoMSP HQ</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="section-title pl-10 mb-4 inline-block">Our Values</span>
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                What Drives Us
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-heading">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
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

export default About;
