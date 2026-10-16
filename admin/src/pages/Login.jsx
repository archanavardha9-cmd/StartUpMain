import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  Coffee,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const notice = location.state?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to sign in.");
      }

      login(data.token, data.admin);

      const destination = location.state?.from?.pathname || "/";
      window.location.assign(destination);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f3ef] lg:grid lg:grid-cols-2">
      {/* Left branding panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#202a25] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#a72b6c]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#b89b72]/15 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a72b6c]">
            <Coffee size={25} />
          </div>

          <div>
            <p className="text-xl font-semibold tracking-tight">
              Startup Cafe
            </p>
            <p className="text-xs tracking-[0.2em] text-white/50">
              ADMINISTRATION
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl py-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75">
            <ShieldCheck size={16} className="text-[#dca9c4]" />
            Secure administration portal
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-6xl">
            Your workspace.
            <br />
            <span className="text-[#e1a8c6]">Your control.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-white/65 xl:text-lg">
            Manage your website content, workspace information, pricing,
            and customer inquiries from one place.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/50">Website management</p>
              <p className="mt-2 font-medium">Content &amp; settings</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-white/50">Customer inquiries</p>
              <p className="mt-2 font-medium">Leads &amp; bookings</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/40">
          © {new Date().getFullYear()} Startup Cafe. All rights reserved.
        </p>
      </section>

      {/* Login panel */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a72b6c] text-white">
              <Coffee size={23} />
            </div>
            <div>
              <p className="text-lg font-semibold text-[#202a25]">
                Startup Cafe
              </p>
              <p className="text-xs tracking-widest text-gray-500">
                ADMINISTRATION
              </p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#a72b6c]">
              Welcome back
            </p>

            <h2 className="text-3xl font-semibold tracking-tight text-[#202a25] sm:text-4xl">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Enter your administrator credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {notice && (
              <div
                role="status"
                className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              >
                {notice}
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a72b6c] focus:ring-4 focus:ring-[#a72b6c]/10"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#a72b6c] focus:ring-4 focus:ring-[#a72b6c]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F472B6] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#a72b6c]/15 transition hover:bg-[#8f2059] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to dashboard"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 flex items-start gap-3 rounded-xl bg-white/80 p-4">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-[#F472B6]"
            />
            <p className="text-xs leading-5 text-gray-500">
              This area is restricted to authorized administrators. Keep
              your login credentials private.
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400 lg:hidden">
            © {new Date().getFullYear()} Startup Cafe
          </p>
        </div>
      </section>
    </main>
  );
}