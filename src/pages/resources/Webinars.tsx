import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Calendar, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const upcomingWebinars = [
  {
    title: 'Mastering AI-Powered Ticket Triage',
    description: 'Learn how to implement and optimize AI-driven ticket classification for maximum efficiency.',
    date: 'Feb 15, 2026',
    time: '2:00 PM EST',
    speaker: 'Sarah Chen, Product Lead',
    type: 'Live',
  },
  {
    title: 'Building a Proactive Client Success Program',
    description: 'Strategies for moving from reactive to proactive client management using data and automation.',
    date: 'Feb 22, 2026',
    time: '1:00 PM EST',
    speaker: 'Michael Roberts, Customer Success',
    type: 'Live',
  },
];

const onDemandWebinars = [
  {
    title: 'Getting Started with AutoMSP: Complete Walkthrough',
    description: 'A comprehensive tour of the AutoMSP platform and how to configure it for your MSP.',
    duration: '45 min',
    views: '2.1K',
    topics: ['Getting Started', 'Configuration'],
  },
  {
    title: 'SLA Management Best Practices for 2026',
    description: 'Expert insights on tracking, managing, and reporting on service level agreements.',
    duration: '38 min',
    views: '1.8K',
    topics: ['SLA', 'Best Practices'],
  },
  {
    title: 'Churn Prevention: Early Warning Signs & Actions',
    description: 'How to identify at-risk clients and what to do to retain them.',
    duration: '52 min',
    views: '3.2K',
    topics: ['Client Retention', 'Analytics'],
  },
  {
    title: 'ServiceNow + AutoMSP Integration Deep Dive',
    description: 'Technical walkthrough of integrating AutoMSP with your ServiceNow instance.',
    duration: '60 min',
    views: '1.5K',
    topics: ['Integration', 'ServiceNow'],
  },
  {
    title: 'Building Intelligent Workflows: From Zero to Automation',
    description: 'Step-by-step guide to creating your first automated workflows in AutoMSP.',
    duration: '42 min',
    views: '2.4K',
    topics: ['Workflows', 'Automation'],
  },
  {
    title: 'Q4 2025 Product Update: What\'s New in AutoMSP',
    description: 'Overview of the latest features and improvements released in Q4 2025.',
    duration: '30 min',
    views: '4.1K',
    topics: ['Product Updates', 'Features'],
  },
];

const Webinars = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Webinars</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Learn from the Experts
              </h1>
              <p className="text-lg text-muted-foreground">
                Live sessions and on-demand content to help you master MSP automation.
              </p>
            </div>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 font-heading">Upcoming Live Webinars</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingWebinars.map((webinar) => (
                <div key={webinar.title} className="glass-card p-8 border-2 border-primary/20">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full animate-pulse">
                      {webinar.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 font-heading">{webinar.title}</h3>
                  <p className="text-muted-foreground mb-6">{webinar.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{webinar.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>{webinar.speaker}</span>
                    </div>
                  </div>
                  <Button variant="cta" className="w-full">
                    Register Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* On-Demand */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 font-heading">On-Demand Library</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {onDemandWebinars.map((webinar) => (
                <div key={webinar.title} className="glass-card overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {webinar.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 font-heading line-clamp-2">
                      {webinar.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{webinar.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{webinar.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{webinar.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="glass-card p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Host a Private Training Session
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Want personalized training for your team? We offer private sessions tailored to your MSP's needs.
              </p>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Request Training
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

export default Webinars;
