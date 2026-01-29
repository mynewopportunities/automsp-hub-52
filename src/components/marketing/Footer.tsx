import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  solutions: [
    { name: 'AI Ticket Triage', href: '/solutions/ai-triage' },
    { name: 'Intelligent Workflows', href: '/solutions/intelligent-workflows' },
    { name: 'Compliance & SLA', href: '/solutions/compliance-sla' },
  ],
  resources: [
    { name: 'Blog', href: '/resources/blog' },
    { name: 'Case Studies', href: '/resources/case-studies' },
    { name: 'Whitepapers', href: '/resources/whitepapers' },
    { name: 'Webinars', href: '/resources/webinars' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
    { name: 'Support', href: '/support' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/automsp', icon: Linkedin },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'YouTube', href: '#', icon: Youtube },
  { name: 'Email', href: 'mailto:info@automsp.us', icon: Mail },
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background" role="contentinfo">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-xl">A</span>
              </div>
              <span className="font-heading font-bold text-xl text-background">AutoMSP</span>
            </div>
            <p className="text-background/70 text-sm mb-4 leading-relaxed">
              AI-powered automation for MSPs on ServiceNow.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-background/70">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>C1-1003, Burhani Centenary Park, Bhestan, Surat, Gujarat, India 395023</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-background/70">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 346 200 3801</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-background/70">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@automsp.us</span>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="font-bold font-heading mb-4 text-sm">Solutions</h3>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bold font-heading mb-4 text-sm">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold font-heading mb-4 text-sm">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Social */}
          <div>
            <h3 className="font-bold font-heading mb-4 text-sm">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="flex gap-2 mt-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-8 h-8 rounded-md bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                  aria-label={item.name}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} AutoMSP. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-background/60">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                SOC 2 Ready
              </span>
              <span>•</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
