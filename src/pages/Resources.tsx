import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Video, BookOpen, Newspaper } from 'lucide-react';

const resourceCategories = [
  {
    icon: Newspaper,
    title: 'Blog',
    description: 'Latest insights on MSP automation, AI, and industry trends.',
    count: '25+ articles',
    href: '/resources/blog',
  },
  {
    icon: FileText,
    title: 'Case Studies',
    description: 'See how other MSPs transformed their operations with AutoMSP.',
    count: '10+ stories',
    href: '/resources/case-studies',
  },
  {
    icon: BookOpen,
    title: 'Whitepapers',
    description: 'Deep-dive reports on MSP best practices and technology.',
    count: '5+ papers',
    href: '/resources/whitepapers',
  },
  {
    icon: Video,
    title: 'Webinars',
    description: 'On-demand and live sessions with industry experts.',
    count: '15+ videos',
    href: '/resources/webinars',
  },
];

const featuredResources = [
  {
    type: 'Blog',
    title: '5 Ways AI is Transforming MSP Service Desks in 2024',
    excerpt: 'Discover how leading MSPs are using artificial intelligence to automate ticket handling and improve client satisfaction.',
    date: 'Jan 15, 2026',
  },
  {
    type: 'Case Study',
    title: 'How TechOps MSP Reduced Ticket Resolution Time by 60%',
    excerpt: "Learn how a 50-person MSP implemented AutoMSP and saw immediate improvements in their service desk metrics.",
    date: 'Jan 10, 2026',
  },
  {
    type: 'Whitepaper',
    title: 'The Ultimate Guide to MSP Churn Prevention',
    excerpt: 'A comprehensive guide to identifying at-risk clients and taking proactive measures to retain them.',
    date: 'Dec 28, 2025',
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Resources</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Learn, Grow, and Transform
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore our library of resources to help you get the most out of MSP automation.
              </p>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resourceCategories.map((category) => (
                <div
                  key={category.title}
                  className="glass-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 font-heading">{category.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                  <span className="text-primary text-sm font-semibold">{category.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Resources */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">Featured Resources</h2>
              <p className="text-muted-foreground">Our most popular content to help you get started</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredResources.map((resource) => (
                <article key={resource.title} className="glass-card p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {resource.type}
                    </span>
                    <span className="text-sm text-muted-foreground">{resource.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 font-heading line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{resource.excerpt}</p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Read more <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
