export default function Features() {
  const features = [
    { title: "Modular", description: "Each section is its own component." },
    { title: "Responsive", description: "Works on all devices." },
    { title: "Dark Mode", description: "Built-in dark mode support." },
  ];

  return (
    <section id="features" className="bg-white py-24 dark:bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-12 text-3xl font-bold">Features</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 shadow dark:bg-neutral-900"
            >
              <h3 className="mb-2 text-xl font-semibold">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
