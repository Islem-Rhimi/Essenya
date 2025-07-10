"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Where do your products come from?",
    answer:
      "All our products are sourced from trusted local farms and producers committed to sustainable and ethical practices.",
  },
  {
    question: "Is everything organic?",
    answer:
      "We prioritize organic produce and clearly label all items. Look for the 'Organic' badge on products for verified organic goods.",
  },
  {
    question: "How does delivery work?",
    answer:
      "We offer fast home delivery across the region, or you can choose free farm pickup. Delivery options are available at checkout.",
  },

  {
    question: "What if I'm not satisfied with my order?",
    answer:
      "Your satisfaction is our priority. Contact our support within 24 hours of delivery, and we'll replace or refund any unsatisfactory items.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="flex flex-col items-center justify-center space-y-6 p-6"
    >
      <h2 className="text-center text-2xl font-bold">
        🌿 Frequently Asked Questions
      </h2>
      <div className="flex w-full max-w-2xl flex-col space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-background rounded-lg border p-4 shadow-sm transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
