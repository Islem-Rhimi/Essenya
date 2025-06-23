const testimonials = [
  {
    name: "Alice Johnson",
    feedback: "This platform helped me launch in days. Absolutely worth it!",
  },
  {
    name: "Bob Smith",
    feedback: "Beautiful UI and excellent performance.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24 dark:bg-black">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-12 text-3xl font-bold">What users say</h2>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-xl bg-gray-50 p-6 text-left shadow dark:bg-neutral-800"
            >
              <p className="mb-4 text-gray-700 italic dark:text-gray-300">
                “{t.feedback}”
              </p>
              <p className="font-semibold text-blue-600 dark:text-blue-400">
                – {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
