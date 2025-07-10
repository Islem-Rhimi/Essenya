import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* Outer container: flex with no width restriction */}
      <div className="flex overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-black">
        {/* Image container: height matches form height */}
        <div className="hidden md:block">
          <img
            src="/images/login/306009e1b96645c98f6e9253a39cc136.webp"
            alt="Farm Landscape"
            className="h-full w-[400px] object-cover"
          />
        </div>
        {/* Form container: fixed width (old size), padding */}
        <div className="flex w-[400px] flex-col justify-center p-6">
          <h1 className="mb-6 text-center text-2xl font-bold">Sign In</h1>

          <Button
            variant="outline"
            className="mb-4 flex w-full items-center gap-2"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>

          <div className="relative mb-4 text-center">
            <span className="bg-background relative z-10 px-2 text-sm">
              or continue with email
            </span>
            <div className="border-muted absolute top-3 right-0 left-0 -z-0 border-t"></div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary underline">
              Sign up
            </a>
          </p>

          <Link href="/">
            <Button variant="ghost" className="mt-4 w-full">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
