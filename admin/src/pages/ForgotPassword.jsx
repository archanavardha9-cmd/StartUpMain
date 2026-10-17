import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Coffee, Mail } from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          typeof data.message === "string" && data.message
            ? data.message
            : "Unable to process your request."
        );
      }

      setMessage(data.message);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f3ef] px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-9">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#a72b6c]"
        >
          <ArrowLeft size={17} />
          Back to sign in
        </Link>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#a72b6c] text-white">
          <Coffee size={24} />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a72b6c]">
          Account recovery
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#202a25]">
          Forgot your password?
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Enter the email address associated with your admin account. If it
          matches an account, we&apos;ll send you a secure reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {message && (
            <p
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              {message}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <label
            htmlFor="recovery-email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
            <span className="relative mt-2 block">
              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                maxLength={254}
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a72b6c] focus:ring-4 focus:ring-[#a72b6c]/10"
              />
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#a72b6c] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#a72b6c]/15 transition hover:bg-[#8f2059] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending request..." : "Send reset link"}
          </button>
        </form>
      </section>
    </main>
  );
}
