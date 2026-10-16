import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../context/useAuth";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

async function requestAuthApi(path, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/auth${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || !data.success) {
    const error = new Error(data.message || "Unable to update account.");
    error.status = response.status;
    throw error;
  }

  return data;
}

const fieldClassName =
  "w-full rounded-xl border-2 border-black bg-white px-3.5 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#FFDE4D]";

const isExpiredSession = (error) =>
  error.status === 401 && error.message !== "Current password is incorrect.";

export default function Settings() {
  const { token, admin, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(admin);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [email, setEmail] = useState("");
  const [currentEmailPassword, setCurrentEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError("");

      try {
        const result = await requestAuthApi("/profile", token);
        if (active) setProfile(result.admin);
      } catch (error) {
        if (!active) return;

        if (error.status === 401) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        setProfileError(
          error.message || "Unable to load administrator profile."
        );
      } finally {
        if (active) setProfileLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [token, logout, navigate]);

  const handleEmailUpdate = async (event) => {
    event.preventDefault();
    setEmailError("");
    setEmailLoading(true);

    try {
      await requestAuthApi("/profile/email", token, {
        method: "PATCH",
        body: JSON.stringify({
          email,
          currentPassword: currentEmailPassword,
        }),
      });
      logout();
      navigate("/login", {
        replace: true,
        state: { message: "Email updated. Sign in again using your new email." },
      });
    } catch (error) {
      if (isExpiredSession(error)) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setEmailError(error.message || "Unable to update email address.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      await requestAuthApi("/change-password", token, {
        method: "PATCH",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      logout();
      navigate("/login", {
        replace: true,
        state: { message: "Password updated. Sign in using your new password." },
      });
    } catch (error) {
      if (isExpiredSession(error)) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setPasswordError(error.message || "Unable to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#C084FC] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <SettingsIcon />
          </div>
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">Settings</h1>
            <p className="mt-1 text-sm font-semibold text-black/60">
              Manage your administrator profile and sign-in credentials.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-5 rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-6">
        <div className="flex items-center gap-3">
          <UserRound className="h-5 w-5" />
          <h2 className="text-xl font-black">Admin profile</h2>
        </div>
        {profileError && (
          <p role="alert" className="rounded-xl border-2 border-red-700 bg-red-50 p-3 text-sm font-semibold text-red-800">
            {profileError}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-black uppercase tracking-wide text-black/55">
              Email address
            </p>
            <p className="min-h-12 break-all rounded-xl border-2 border-black bg-[#F5F5F0] px-3.5 py-3 text-sm font-bold">
              {profileLoading ? "Loading profile..." : profile?.email || "Unavailable"}
            </p>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-black uppercase tracking-wide text-black/55">
              Username
            </p>
            <p className="min-h-12 rounded-xl border-2 border-black bg-[#F5F5F0] px-3.5 py-3 text-sm font-semibold text-black/60">
              Username sign-in is not supported for this admin account.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-6">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5" />
          <div>
            <h2 className="text-xl font-black">Email address</h2>
            <p className="mt-1 text-sm font-semibold text-black/55">
              Changing your email signs you out on all devices.
            </p>
          </div>
        </div>
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          {emailError && (
            <p role="alert" className="rounded-xl border-2 border-red-700 bg-red-50 p-3 text-sm font-semibold text-red-800">
              {emailError}
            </p>
          )}
          <label className="block space-y-1.5 text-sm font-bold">
            New email address
            <input
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <label className="block space-y-1.5 text-sm font-bold">
            Current password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={currentEmailPassword}
              onChange={(event) => setCurrentEmailPassword(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <button
            type="submit"
            disabled={emailLoading || profileLoading}
            className="rounded-xl border-2 border-black bg-[#FFDE4D] px-5 py-3 text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {emailLoading ? "Updating email..." : "Update email"}
          </button>
        </form>
      </section>

      <section className="space-y-5 rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-6">
        <div className="flex items-center gap-3">
          <KeyRound className="h-5 w-5" />
          <div>
            <h2 className="text-xl font-black">Change password</h2>
            <p className="mt-1 text-sm font-semibold text-black/55">
              Use at least 12 characters. Changing your password signs you out.
            </p>
          </div>
        </div>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          {passwordError && (
            <p role="alert" className="rounded-xl border-2 border-red-700 bg-red-50 p-3 text-sm font-semibold text-red-800">
              {passwordError}
            </p>
          )}
          <label className="block space-y-1.5 text-sm font-bold">
            Current password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className={fieldClassName}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm font-bold">
              New password
              <input
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className={fieldClassName}
              />
            </label>
            <label className="block space-y-1.5 text-sm font-bold">
              Confirm new password
              <input
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={fieldClassName}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="rounded-xl border-2 border-black bg-[#FFDE4D] px-5 py-3 text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {passwordLoading ? "Updating password..." : "Update password"}
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border-2 border-black bg-[#FFFDF9] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-black">Sign out</h2>
          <p className="mt-1 text-sm font-semibold text-black/55">
            End this admin session on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#FFDE4D] px-5 py-3 text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </section>
    </div>
  );
}

function SettingsIcon() {
  return <ShieldCheck className="h-6 w-6" strokeWidth={3} />;
}
