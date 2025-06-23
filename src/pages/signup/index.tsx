import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="clsmin-h-screen flex items-center justify-center bg-[#e6e8ea] px-4">
      <div className="bg-background flex overflow-hidden rounded-2xl shadow-xl">
        <div className="hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Farm Landscape"
            className="h-full w-[600px] object-cover"
          />
        </div>
        <div className="flex w-[600px] flex-col justify-center p-6">
          <h1 className="mb-6 text-center text-2xl font-bold">Sign Up</h1>

          <Button
            variant="outline"
            className="mb-4 flex w-full items-center gap-2"
            onClick={() => signIn("google")}
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </Button>

          <div className="relative mb-4 text-center">
            <span className="bg-background relative z-10 px-2 text-sm">
              or create account with email
            </span>
            <div className="border-muted absolute top-3 right-0 left-0 -z-0 border-t"></div>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <Input type="text" placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <Input type="date" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input type="email" placeholder="you@example.com" required />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">Password</label>
                <Input type="password" placeholder="••••••••" required />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <Input type="password" placeholder="••••••••" required />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/signin" className="text-primary underline">
              Sign in
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
