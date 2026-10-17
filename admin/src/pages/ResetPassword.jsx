import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Coffee, Eye, EyeOff, LockKeyhole } from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const passwordChecks = [
  { label: "At least 12 characters", test: (value) => value.length >= 12 },
  { label: "At least 16 characters", test: (value) => value.length >= 16 },
  { label: "Contains an uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { label: "Contains a lowercase letter", test: (value) => /[a-z]/.test(value) },
  { label: "Contains a number", test: (value) => /\d/.test(value) },
  { label: "Contains a symbol", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

function PasswordField({ id, label, value, onChange, visible, onToggle }) {
  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700"
    >
      {label}
      <span className="relative mt-2 block">
        <LockKeyhole
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:border-[#a72b6c] focus:ring-4 focus:ring-[#a72b6c]/10"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  );
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = passwordChecks.filter((check) => check.test(password)).length;
  const strengthLabel =
    strength < 3 ? "Weak" : strength < 5 ? "Good" : "Strong";
  const strengthColor =
    strength < 3 ? "bg-red-500" : strength < 5 ? "bg-amber-500" : "bg-green-600";

  useEffect(() => {
    if (token) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname
      );
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    if (password.length < 12 || password.length > 128) {
      setError("Your password must be between 12 and 128 characters long.");
      return;
    }

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
          confirmPassword: confirmation,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to reset your password.");
      }

      setMessage(data.message);
      setPassword("");
      setConfirmation("");
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
          <Coffee size={24} />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a72b6c]">
          Secure account recovery
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#202a25]">
          Set a new password
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Choose a strong password you have not used for this account before.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          {message && (
            <p
              role="status"
              className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
            >
              {message}{" "}
              <Link to="/login" className="font-semibold underline">
                Sign in
              </Link>
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
              This password reset link is missing or invalid. Request a new
              reset link to continue.
            </p>
          )}
          <PasswordField
            id="new-password"
            label="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            visible={showPassword}
            onToggle={() => setShowPassword((visible) => !visible)}
          />
          <div aria-live="polite" className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Password strength</span>
              <span>{password ? strengthLabel : "Enter a password"}</span>
            </div>
            <div
              role="meter"
              aria-label="Password strength"
              aria-valuemin={0}
              aria-valuemax={6}
              aria-valuenow={strength}
              className="h-2 overflow-hidden rounded-full bg-gray-200"
            >
              <div
                className={`h-full ${strengthColor} transition-all`}
                style={{ width: `${(strength / passwordChecks.length) * 100}%` }}
              />
            </div>
            <p className="text-xs leading-5 text-gray-500">
              Use at least 12 characters. A longer password with a mix of
              letters, numbers, and symbols is stronger.
            </p>
          </div>
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            visible={showConfirmation}
            onToggle={() => setShowConfirmation((visible) => !visible)}
          />
          <button
            type="submit"
            disabled={loading || Boolean(message)}
            className="w-full rounded-xl bg-[#a72b6c] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#a72b6c]/15 transition hover:bg-[#8f2059] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating password..." : "Reset password"}
          </button>
        </form>
      </section>
    </main>
  );
}
