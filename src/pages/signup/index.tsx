import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess("Account created successfully!");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error, please try again later.");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e6e8ea] px-4">
      <div className="flex overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-black">
        <div className="hidden md:block">
          <img
            src="/images/login/FARM-OHIO.jpeg"
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

          {error && (
            <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
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
