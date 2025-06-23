import { Button } from "~/components/ui/button";

export default function Hero() {
  return (
    <section className="flex h-[calc(100vh-80px)] flex-col items-center justify-center bg-gray-100 px-4 text-center dark:bg-gray-900">
      <h1 className="mb-4 text-5xl font-bold">Build your product faster</h1>
      <p className="mb-8 max-w-xl text-lg text-gray-600 dark:text-gray-300">
        Beautiful UI components with ShadCN and Tailwind.
      </p>
      <Button size="lg">Get Started</Button>
    </section>
  );
}
