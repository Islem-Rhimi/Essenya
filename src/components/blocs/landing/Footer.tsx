export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6 dark:bg-black">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
