import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, User, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: '5 Ways AI is Transforming MSP Service Desks in 2026',
    excerpt: 'Discover how leading MSPs are using artificial intelligence to automate ticket handling and improve client satisfaction.',
    author: 'Sarah Chen',
    date: 'Jan 28, 2026',
    category: 'AI & Automation',
    readTime: '5 min read',
  },
  {
    title: 'The Complete Guide to MSP Client Retention',
    excerpt: 'Learn proven strategies to reduce churn and build lasting relationships with your managed services clients.',
    author: 'Michael Roberts',
    date: 'Jan 25, 2026',
    category: 'Client Success',
    readTime: '8 min read',
  },
  {
    title: 'Optimizing Your ServiceNow Instance for MSP Operations',
    excerpt: 'Best practices for configuring ServiceNow to maximize efficiency in managed services environments.',
    author: 'David Park',
    date: 'Jan 22, 2026',
    category: 'ServiceNow',
    readTime: '6 min read',
  },
  {
    title: 'SLA Management: From Reactive to Proactive',
    excerpt: 'How to use predictive analytics to prevent SLA breaches before they happen.',
    author: 'Emily Watson',
    date: 'Jan 18, 2026',
    category: 'SLA Management',
    readTime: '4 min read',
  },
  {
    title: 'Building a Scalable MSP Tech Stack in 2026',
    excerpt: 'The essential tools and integrations every growing MSP needs for sustainable growth.',
    author: 'James Miller',
    date: 'Jan 15, 2026',
    category: 'Technology',
    readTime: '7 min read',
  },
  {
    title: 'Understanding Churn Signals: Early Warning Signs',
    excerpt: 'Identify the behavioral patterns that predict client churn and take action early.',
    author: 'Sarah Chen',
    date: 'Jan 10, 2026',
    category: 'Client Success',
    readTime: '5 min read',
  },
];

const categories = ['All', 'AI & Automation', 'Client Success', 'ServiceNow', 'SLA Management', 'Technology'];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-muted to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-title pl-10 mb-4 inline-block">Blog</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">
                Insights for Modern MSPs
              </h1>
              <p className="text-lg text-muted-foreground">
                Expert articles on automation, client success, and MSP best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article key={post.title} className="glass-card overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Tag className="w-12 h-12 text-primary/30" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 font-heading line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-heading">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-muted-foreground mb-8">
                Get the latest MSP insights delivered to your inbox weekly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="cta">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
