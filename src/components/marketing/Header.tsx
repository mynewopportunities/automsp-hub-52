import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Solutions', href: '/solutions', hasDropdown: true },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Why AutoMSP', href: '/why-automsp' },
  { name: 'Resources', href: '/resources' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-primary/10'
          : 'bg-white/30 backdrop-blur-md'
      }`}
    >
      <nav className="flex items-center justify-between py-2 px-4 lg:px-8 max-w-7xl mx-auto" aria-label="Main navigation">
        {/* Logo - Far Left */}
        <Link to="/" className="flex items-center group">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xl">A</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">AutoMSP</span>
          </div>
        </Link>

        {/* Center Navigation + Right CTAs */}
        <div className="hidden lg:flex items-center gap-8">
          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-1 px-4 py-2 text-base font-semibold transition-colors rounded-md font-heading ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-foreground/80 hover:text-primary'
                }`}
              >
                {item.name}
                {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="default"
              className="font-heading bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate(user ? '/portal' : '/login')}
            >
              {user ? 'My Portal' : 'Customer Login'}
            </Button>
            <Button variant="cta" size="default">
              Book a Demo
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-card border-b border-border shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 text-base font-semibold rounded-lg font-heading ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/5'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
                {item.hasDropdown && <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigate(user ? '/portal' : '/login');
                  setMobileMenuOpen(false);
                }}
              >
                {user ? 'My Portal' : 'Customer Login'}
              </Button>
              <Button variant="cta" className="w-full">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
