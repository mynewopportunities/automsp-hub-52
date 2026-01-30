import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search, Book, MessageCircle, FileText, Video, Mail, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const supportCategories = [
  {
    icon: Book,
    title: 'Knowledge Base',
    description: 'Browse our comprehensive documentation and how-to guides.',
    link: '#',
    cta: 'Browse Articles',
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Watch step-by-step tutorials for common tasks and features.',
    link: '/resources/webinars',
    cta: 'Watch Videos',
  },
  {
    icon: MessageCircle,
    title: 'Community Forum',
    description: 'Connect with other MSPs and share best practices.',
    link: '#',
    cta: 'Join Community',
  },
  {
    icon: FileText,
    title: 'API Documentation',
    description: 'Technical documentation for developers and integrations.',
    link: '#',
    cta: 'View API Docs',
  },
];

const popularArticles = [
  'Getting Started with AutoMSP',
  'Configuring ServiceNow Integration',
  'Setting Up AI Ticket Triage',
  'Creating Your First Workflow',
  'Understanding Health Scores',
  'Managing SLA Policies',
];

const Support = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Support</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                How Can We Help?
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Find answers in our knowledge base or get in touch with our support team.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for help articles..."
                  className="pl-12 pr-4 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Support Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {supportCategories.map((category) => (
                <div key={category.title} className="glass-card p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <category.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 font-heading">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={category.link}>
                      {category.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 font-heading text-center">Popular Articles</h2>
              <div className="glass-card divide-y divide-border">
                {popularArticles.map((article) => (
                  <a
                    key={article}
                    href="#"
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{article}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">Need More Help?</h2>
              <p className="text-muted-foreground">Our support team is here to help you succeed.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass-card p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-heading">Email Support</h3>
                <p className="text-muted-foreground text-sm mb-4">Get a response within 24 hours</p>
                <a href="mailto:support@automsp.us" className="text-primary font-semibold hover:underline">
                  support@automsp.us
                </a>
              </div>

              <div className="glass-card p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-heading">Phone Support</h3>
                <p className="text-muted-foreground text-sm mb-4">For urgent issues (Pro & Enterprise)</p>
                <a href="tel:+13462003801" className="text-primary font-semibold hover:underline">
                  +1 346 200 3801
                </a>
              </div>

              <div className="glass-card p-8 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-heading">Support Hours</h3>
                <p className="text-muted-foreground text-sm mb-2">Monday - Friday</p>
                <p className="text-foreground font-semibold">9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Support */}
        <section className="py-12 bg-foreground">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-background font-heading">Enterprise Support</h3>
                <p className="text-background/70">24/7 priority support for enterprise customers</p>
              </div>
              <Button variant="cta" asChild>
                <Link to="/contact">
                  Contact Enterprise Support
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

export default Support;
