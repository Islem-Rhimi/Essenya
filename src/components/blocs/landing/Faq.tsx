const faqs = [
  {
    q: "Is it free to use?",
    a: "Yes, our free plan offers all the essentials to get started.",
  },
  {
    q: "Can I upgrade later?",
    a: "Absolutely! You can switch to a paid plan at any time.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-gray-100 py-24 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto max-w-2xl space-y-8">
          {faqs.map((item, index) => (
            <div key={index}>
              <h4 className="mb-2 text-xl font-semibold">{item.q}</h4>
              <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
