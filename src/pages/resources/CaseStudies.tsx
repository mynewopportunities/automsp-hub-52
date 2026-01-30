import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, TrendingUp, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const caseStudies = [
  {
    company: 'TechOps MSP',
    industry: 'IT Services',
    size: '50 employees',
    challenge: 'Manual ticket triage was consuming 30% of technician time',
    solution: 'Implemented AI-powered ticket classification and routing',
    results: [
      '60% reduction in first-response time',
      '45% increase in tickets resolved on first contact',
      '$120K annual savings in operational costs',
    ],
    quote: 'AutoMSP transformed how we handle tickets. Our technicians now focus on solving problems, not sorting them.',
    author: 'John Smith, Operations Director',
  },
  {
    company: 'CloudFirst Solutions',
    industry: 'Cloud Services',
    size: '120 employees',
    challenge: 'Frequent SLA breaches affecting client satisfaction',
    solution: 'Deployed predictive SLA monitoring with automated escalations',
    results: [
      '99.5% SLA compliance rate',
      '80% fewer client complaints',
      'NPS score increased from 32 to 67',
    ],
    quote: 'The predictive alerts give us time to act before problems become crises. Our clients have noticed the difference.',
    author: 'Maria Garcia, VP of Client Success',
  },
  {
    company: 'SecureNet Partners',
    industry: 'Cybersecurity',
    size: '35 employees',
    challenge: 'High client churn due to lack of visibility into account health',
    solution: 'Implemented churn prevention analytics and health scoring',
    results: [
      '40% reduction in client churn',
      '25% increase in contract renewals',
      '$500K in saved recurring revenue',
    ],
    quote: 'We now see warning signs months before a client might leave. That visibility is invaluable.',
    author: 'Robert Chen, CEO',
  },
];

const CaseStudies = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Case Studies</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Real Results from Real MSPs
              </h1>
              <p className="text-lg text-muted-foreground">
                See how MSPs like yours have transformed their operations with AutoMSP.
              </p>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="space-y-16">
              {caseStudies.map((study, index) => (
                <div
                  key={study.company}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground font-heading">{study.company}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{study.industry}</span>
                          <span>•</span>
                          <span>{study.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">Challenge</h4>
                        <p className="text-muted-foreground">{study.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-1">Solution</h4>
                        <p className="text-muted-foreground">{study.solution}</p>
                      </div>
                    </div>

                    <div className="glass-card p-6 mb-6">
                      <h4 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Results</h4>
                      <ul className="space-y-2">
                        {study.results.map((result) => (
                          <li key={result} className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="text-foreground font-medium">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                      "{study.quote}"
                      <footer className="mt-2 text-sm font-semibold text-foreground not-italic">
                        — {study.author}
                      </footer>
                    </blockquote>
                  </div>

                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center">
                      <div className="text-center">
                        <Building2 className="w-20 h-20 text-primary/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">{study.company}</p>
                      </div>
                    </div>
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
                Ready to Write Your Success Story?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join these MSPs and hundreds more who have transformed their operations with AutoMSP.
              </p>
              <Button variant="cta" size="lg" asChild>
                <Link to="/contact">
                  Get Started Today
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

export default CaseStudies;
