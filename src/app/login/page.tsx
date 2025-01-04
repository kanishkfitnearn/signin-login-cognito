"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/email-sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to sign in");
        console.error(data.error || "Failed to sign in");
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data); // Log success message
    } catch (err) {
      console.error("An error occurred during sign-in."); // Updated to avoid unused variable
    }
  };

  const handleSignUp = () => {
    router.push("/signup"); // Redirect to the signup page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full space-y-8 p-6 bg-white shadow rounded-md"
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in with your Google account or email/password.
          </p>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In with Email
          </button>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Don&apos;t have an account?</p> {/* Escaped `'` */}
          <button
            type="button"
            onClick={handleSignUp}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
