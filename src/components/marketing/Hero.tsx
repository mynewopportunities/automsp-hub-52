import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Zap, Play, Users, Bot, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Particle component for animated background
const Particle = ({ delay, duration, size, left, top }: {
  delay: number;
  duration: number;
  size: number;
  left: string;
  top: string;
}) => (
  <div
    className="absolute rounded-full bg-primary/40 animate-pulse"
    style={{
      width: size,
      height: size,
      left,
      top,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      boxShadow: `0 0 ${size * 2}px ${size / 2}px hsl(var(--primary) / 0.3)`,
    }}
  />
);

// Generate random particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 6,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  }));
};

const FloatingCard = ({ icon: Icon, title, delay }: {
  icon: React.ElementType;
  title: string;
  delay: number;
}) => (
  <div
    className="absolute bg-card/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-primary/20 animate-fade-in"
    style={{
      animationDelay: `${delay}s`,
      animation: `float 6s ease-in-out infinite ${delay}s`,
    }}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className="font-heading font-semibold text-foreground">{title}</span>
    </div>
  </div>
);

export const Hero = () => {
  const [particles] = useState(() => generateParticles(30));

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(200,60%,6%)] via-[hsl(180,50%,8%)] to-[hsl(160,40%,6%)]" />

      {/* Radial gradient overlays for depth */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-secondary/15 via-secondary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-[hsl(160,60%,15%)]/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(87,179,62,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(87,179,62,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Flowing waves */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-64 opacity-40"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroWaveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(120, 60%, 35%)" />
            <stop offset="50%" stopColor="hsl(150, 70%, 45%)" />
            <stop offset="100%" stopColor="hsl(180, 60%, 40%)" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 Q200,40 400,90 T800,60 T1200,100 L1200,200 L0,200 Z"
          fill="url(#heroWaveGradient1)"
          opacity="0.6"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,80 Q200,40 400,90 T800,60 T1200,100 L1200,200 L0,200 Z;
              M0,90 Q200,60 400,70 T800,90 T1200,80 L1200,200 L0,200 Z;
              M0,80 Q200,40 400,90 T800,60 T1200,100 L1200,200 L0,200 Z
            "
          />
        </path>
      </svg>

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm mb-6 animate-fade-in-up shadow-glow-green">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-white/90 font-heading">
                Now integrating with ServiceNow AI
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up animation-delay-200 font-heading">
              Intelligent Workflows for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-400 to-secondary">MSPs</span> on ServiceNow
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8 animate-fade-in-up animation-delay-400">
              AutoMSP automates ticket triage and routing, cutting SLA breaches and
              manual workload without expensive consulting.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-in-up animation-delay-600">
              <Button variant="cta" size="lg" className="shadow-glow-orange">
                Book a 30-minute Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="lg">
                <Play className="w-5 h-5" />
                See How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-white/60 animate-fade-in-up animation-delay-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">SOC 2 Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium">60% Faster Triage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">SN</span>
                </div>
                <span className="text-sm font-medium">Native ServiceNow</span>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative h-[500px] md:h-[600px] hidden lg:block">
            <div className="absolute top-[10%] right-[10%]" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <div className="bg-card/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">AI Triage</p>
                    <p className="text-sm text-muted-foreground">Auto-classify tickets</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-[35%] right-[25%]" style={{ animation: 'float 6s ease-in-out infinite 0.5s' }}>
              <div className="bg-card/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">Smart Routing</p>
                    <p className="text-sm text-muted-foreground">Right tech, first time</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-[60%] right-[5%]" style={{ animation: 'float 6s ease-in-out infinite 1s' }}>
              <div className="bg-card/90 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">SLA Tracking</p>
                    <p className="text-sm text-muted-foreground">Never miss deadlines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating particles around cards */}
            <div className="absolute top-[20%] right-[40%] w-3 h-3 rounded-full bg-primary animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute top-[45%] right-[35%] w-2 h-2 rounded-full bg-secondary animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <div className="absolute top-[70%] right-[45%] w-4 h-4 rounded-full bg-primary/60 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </section>
  );
};
