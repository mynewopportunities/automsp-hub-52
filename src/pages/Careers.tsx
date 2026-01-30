import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, MapPin, Clock, Heart, Zap, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance, mental health support, and wellness programs.',
  },
  {
    icon: Zap,
    title: 'Flexible Work',
    description: 'Remote-first culture with flexible hours and work-from-anywhere policy.',
  },
  {
    icon: GraduationCap,
    title: 'Learning & Growth',
    description: 'Annual learning budget, conference attendance, and career development programs.',
  },
  {
    icon: Users,
    title: 'Team Building',
    description: 'Regular team retreats, virtual events, and collaborative culture.',
  },
];

const openPositions = [
  {
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    description: 'Build and scale our AI-powered MSP automation platform.',
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote (US)',
    type: 'Full-time',
    description: 'Drive product strategy and roadmap for our ServiceNow integrations.',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote (US)',
    type: 'Full-time',
    description: 'Help MSPs achieve success with our platform through onboarding and ongoing support.',
  },
  {
    title: 'Machine Learning Engineer',
    department: 'Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    description: 'Develop and improve our AI models for ticket classification and churn prediction.',
  },
  {
    title: 'Sales Development Representative',
    department: 'Sales',
    location: 'Remote (US)',
    type: 'Full-time',
    description: 'Generate and qualify leads for our enterprise MSP sales team.',
  },
];

const values = [
  'Customer obsession over everything',
  'Move fast and iterate',
  'Default to transparency',
  'Embrace remote-first collaboration',
  'Celebrate diversity of thought',
];

const Careers = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Careers</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Join the Future of MSP Automation
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We're building the platform that helps MSPs work smarter, not harder. Come build with us.
              </p>
              <Button variant="cta" size="lg" asChild>
                <a href="#positions">
                  View Open Positions
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">Why Work at AutoMSP?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe in taking care of our team so they can take care of our customers.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="glass-card p-6 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 font-heading">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-foreground">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-background mb-6 font-heading">Our Values</h2>
                <p className="text-background/70 mb-8">
                  These principles guide everything we do, from product decisions to how we treat each other.
                </p>
                <ul className="space-y-4">
                  {values.map((value) => (
                    <li key={value} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-background">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="aspect-square rounded-2xl bg-background/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-primary-foreground font-heading">A</span>
                  </div>
                  <p className="text-background/70">Building together</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">Open Positions</h2>
              <p className="text-muted-foreground">Find your next role at AutoMSP</p>
            </div>
            <div className="space-y-4 max-w-4xl mx-auto">
              {openPositions.map((position) => (
                <div key={position.title} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground font-heading">{position.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{position.description}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{position.department}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{position.type}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="shrink-0">
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Don't See the Right Role?
              </h2>
              <p className="text-muted-foreground mb-8">
                We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Get in Touch
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

export default Careers;
