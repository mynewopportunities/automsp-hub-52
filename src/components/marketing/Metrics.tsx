const metrics = [
  { value: '60%', label: 'Faster Ticket Triage' },
  { value: '45%', label: 'Reduction in SLA Breaches' },
  { value: '3x', label: 'Technician Productivity' },
  { value: '85%', label: 'Client Satisfaction' },
];

export const Metrics = () => {
  return (
    <section className="py-16 bg-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-heading">
                {metric.value}
              </div>
              <p className="text-primary-foreground/70 text-sm md:text-base">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
