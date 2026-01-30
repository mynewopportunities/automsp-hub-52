import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, FileText, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const whitepapers = [
  {
    title: 'The Ultimate Guide to MSP Churn Prevention',
    description: 'A comprehensive guide to identifying at-risk clients and taking proactive measures to retain them. Learn the key indicators, best practices, and automation strategies.',
    pages: 24,
    readTime: '15 min',
    topics: ['Client Retention', 'Analytics', 'Automation'],
  },
  {
    title: 'AI in MSP Operations: 2026 State of the Industry',
    description: 'An in-depth analysis of how artificial intelligence is reshaping managed services. Includes survey data from 500+ MSPs and expert predictions.',
    pages: 32,
    readTime: '20 min',
    topics: ['AI', 'Industry Trends', 'Technology'],
  },
  {
    title: 'ServiceNow Optimization for MSPs',
    description: 'Best practices for configuring and customizing ServiceNow to maximize efficiency in managed services environments.',
    pages: 18,
    readTime: '12 min',
    topics: ['ServiceNow', 'Configuration', 'Best Practices'],
  },
  {
    title: 'The ROI of Service Desk Automation',
    description: 'Calculate the true return on investment from automating your service desk operations. Includes frameworks, benchmarks, and case studies.',
    pages: 28,
    readTime: '18 min',
    topics: ['ROI', 'Automation', 'Business Case'],
  },
  {
    title: 'Building a Scalable MSP Technology Stack',
    description: 'A strategic guide to selecting and integrating the tools your MSP needs for sustainable growth and operational excellence.',
    pages: 22,
    readTime: '14 min',
    topics: ['Technology', 'Scalability', 'Integration'],
  },
];

const Whitepapers = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Whitepapers</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                In-Depth Research & Guides
              </h1>
              <p className="text-lg text-muted-foreground">
                Expert research and comprehensive guides on MSP automation, client success, and industry best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Whitepapers Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="space-y-8">
              {whitepapers.map((paper) => (
                <div key={paper.title} className="glass-card p-8 hover:shadow-lg transition-all duration-300">
                  <div className="grid lg:grid-cols-4 gap-8 items-center">
                    <div className="lg:col-span-3">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {paper.topics.map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 font-heading">
                        {paper.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{paper.description}</p>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{paper.pages} pages</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{paper.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:justify-end">
                      <Button variant="cta" className="w-full lg:w-auto">
                        <Download className="w-5 h-5" />
                        Download PDF
                      </Button>
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
              <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Want Custom Research?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our team can create tailored research and analysis for your specific MSP challenges.
              </p>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Contact Our Research Team
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

export default Whitepapers;
