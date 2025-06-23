import { Button } from "~/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["Basic features", "Email support"],
  },
  {
    name: "Pro",
    price: "$9/mo",
    features: ["All features", "Priority support", "Team access"],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50 py-24 dark:bg-neutral-900">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-12 text-3xl font-bold">Pricing</h2>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white p-6 text-left dark:bg-black"
            >
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="my-4 text-3xl font-bold">{plan.price}</p>
              <ul className="mb-6 list-inside list-disc text-gray-600 dark:text-gray-400">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <Button className="w-full">Choose {plan.name}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
