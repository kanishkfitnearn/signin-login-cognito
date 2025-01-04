'use client';  // Add this line to mark the component as a Client Component

export default function SignUp() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Account created successfully!");
    } else {
      alert(data.error || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 bg-white p-6 shadow rounded-md">
      <h2 className="text-2xl font-bold">Create Account</h2>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input type="email" name="email" id="email" required className="mt-1 block w-full" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input type="password" name="password" id="password" required className="mt-1 block w-full" />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded">
        Create Account
      </button>
    </form>
  );
}
