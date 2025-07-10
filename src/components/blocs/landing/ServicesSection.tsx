const services = [
  {
    icon: "🚜",
    title: "Farm-Fresh Produce",
    description:
      "Locally sourced fruits and vegetables, harvested at peak ripeness for maximum freshness and nutrition.",
  },
  {
    icon: "🌾",
    title: "Organic Staples & Grains",
    description:
      "High-quality organic grains, legumes, and pantry essentials grown sustainably by trusted farmers.",
  },
  {
    icon: "🧺",
    title: "Artisanal Farm Products",
    description:
      "Handmade cheeses, jams, honey, and other small-batch products crafted with care from local ingredients.",
  },
  {
    icon: "📅",
    title: " Weekly tours & Seasonal harvests",
    description:
      "From strawberry picking in spring to olive harvesting in autumn, Essenya Farm invites you to experience life on the farm.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="bg-white p-6">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-primary mb-12 text-center text-3xl font-bold drop-shadow-lg md:text-4xl">
          Premium Services
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-card-service rounded-2xl border border-yellow-300/20 bg-yellow-300/5 p-8 text-center shadow transition-all hover:-translate-y-2"
            >
              <div className="mb-4 text-4xl">{service.icon}</div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
