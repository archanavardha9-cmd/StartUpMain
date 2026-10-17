import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Coffee } from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get("token") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname
      );
    }
  }, [token]);

  const handleVerify = async () => {
    setError("");
    setMessage("");

    if (!token) {
      setError("This email verification link is invalid or has expired.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/profile/email/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to verify this email address.");
      }

      setMessage(data.message);
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname
      );
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
          {message ? <CheckCircle2 size={24} /> : <Coffee size={24} />}
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a72b6c]">
          Admin account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#202a25]">
          Verify your email
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Confirm ownership of this address to finish changing your admin
          sign-in email.
        </p>

        <div className="mt-7 space-y-5">
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
          {!token && !error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              This email verification link is missing or invalid.
            </p>
          )}
          {token && !message && (
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading}
              className="w-full rounded-xl bg-[#a72b6c] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#a72b6c]/15 transition hover:bg-[#8f2059] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying email..." : "Verify email address"}
            </button>
          )}
          {message && (
            <Link
              to="/login"
              className="block w-full rounded-xl bg-[#a72b6c] px-4 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#8f2059]"
            >
              Sign in with your new email
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
