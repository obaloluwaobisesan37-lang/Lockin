import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Moon,
  Sun,
  User,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

async function hashPassword(password) {
  if (!window.crypto?.subtle) {
    throw new Error("Secure password hashing is not available.");
  }

  const data = new TextEncoder().encode(password);

  const hashBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    data
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getSavedAccount() {
  try {
    const saved = localStorage.getItem("lockin_auth_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function SignIn() {
  const navigate = useNavigate();

  const [accountExists, setAccountExists] = useState(
    Boolean(getSavedAccount())
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("lockin_dark_mode") === "true";
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // THEME
  // =========================================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "lockin_dark_mode",
      String(darkMode)
    );
  }, [darkMode]);

  // =========================================================
  // SESSION CHECK
  // =========================================================

  useEffect(() => {
    const session =
      localStorage.getItem("lockin_session") === "true";

    if (session && getSavedAccount()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // =======================================================
    // SIGN IN
    // =======================================================

    if (accountExists) {
      if (!loginPassword) {
        setError("Enter your password.");
        return;
      }

      setLoading(true);

      try {
        const account = getSavedAccount();

        if (!account) {
          setAccountExists(false);
          setError(
            "Your account could not be found. Please create a new account."
          );
          return;
        }

        const passwordHash =
          await hashPassword(loginPassword);

        if (
          cleanEmail !== account.email ||
          passwordHash !== account.passwordHash
        ) {
          setError("Incorrect email or password.");
          return;
        }

        localStorage.setItem(
          "lockin_session",
          "true"
        );

        // Always lock Archives when logging in.
        sessionStorage.removeItem(
          "lockin_archive_unlocked"
        );

        navigate("/dashboard", {
          replace: true,
        });
      } catch {
        setError(
          "Unable to sign in. Please try again."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // =======================================================
    // CREATE ACCOUNT
    // =======================================================

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (loginPassword.length < 6) {
      setError(
        "Your password must be at least 6 characters."
      );
      return;
    }

    if (loginPassword !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const passwordHash =
        await hashPassword(loginPassword);

      const account = {
        name: cleanName,
        email: cleanEmail,
        passwordHash,

        /*
         * Archive password is intentionally NOT created
         * on the Sign In page.
         *
         * It will be handled separately by Archives.
         */
        archivePasswordHash: null,

        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "lockin_auth_user",
        JSON.stringify(account)
      );

      localStorage.setItem(
        "lockin_session",
        "true"
      );

      sessionStorage.removeItem(
        "lockin_archive_unlocked"
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch {
      setError(
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SWITCH ACCOUNT MODE
  // =========================================================

  const switchMode = () => {
    setAccountExists((current) => !current);

    setName("");
    setEmail("");
    setLoginPassword("");
    setConfirmPassword("");

    setError("");

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f4ef] px-4 py-6 text-[#292725] transition-colors duration-300 dark:bg-[#101310] dark:text-white sm:px-6">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#765b6b]/10 blur-3xl dark:bg-[#765b6b]/20" />

      <div className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full bg-[#627b82]/10 blur-3xl dark:bg-[#627b82]/10" />

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#765b6b] text-sm font-black text-white shadow-[0_4px_0_#594451]">
            L
          </div>

          <span className="hidden text-sm font-black sm:block">
            Lockin
          </span>

        </div>

        {/* THEME TOGGLE */}

        <button
          type="button"
          onClick={() =>
            setDarkMode((current) => !current)
          }
          aria-label={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="group flex h-11 items-center gap-2 rounded-2xl border border-[#ded9d1] bg-white px-3 text-[#625e58] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#343934] dark:bg-[#1b1f1c] dark:text-[#d8d5cf]"
        >
          {darkMode ? (
            <Sun
              size={17}
              className="transition-transform group-hover:rotate-12"
            />
          ) : (
            <Moon
              size={17}
              className="transition-transform group-hover:-rotate-12"
            />
          )}

          <span className="hidden text-xs font-black sm:block">
            {darkMode ? "Light" : "Dark"}
          </span>
        </button>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-5xl items-center justify-center py-10">

        <div className="grid w-full items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">

          {/* =================================================
              LEFT INTRO
          ================================================= */}

          <div className="hidden lg:block">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ded9d1] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#765b6b] backdrop-blur dark:border-[#343934] dark:bg-[#1b1f1c]/70 dark:text-[#c7aebe]">
              <ShieldCheck size={13} />
              Your productivity space
            </div>

            <h1 className="max-w-lg text-5xl font-black leading-[1.05] tracking-[-0.04em]">
              Stay focused.
              <br />
              <span className="text-[#765b6b] dark:text-[#c7aebe]">
                Keep locking in.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-[#777169] dark:text-[#aaa69e]">
              Organize your tasks, build consistency,
              and keep your attention on what matters.
            </p>

            <div className="mt-8 flex items-center gap-3 text-xs font-bold text-[#918b82] dark:text-[#aaa69e]">
              <div className="flex -space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f6f4ef] bg-[#765b6b] text-[10px] font-black text-white dark:border-[#101310]">
                  L
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f6f4ef] bg-[#627b82] text-[10px] font-black text-white dark:border-[#101310]">
                  +
                </div>
              </div>

              Simple. Focused. Yours.
            </div>
          </div>

          {/* =================================================
              AUTH CARD
          ================================================= */}

          <div className="mx-auto w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="mb-7 text-center lg:hidden">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#765b6b] text-2xl font-black text-white shadow-[0_6px_0_#594451]">
                L
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight">
                Lockin
              </h1>

            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#e2ddd5] bg-white/95 shadow-[0_20px_60px_rgba(41,39,37,0.08)] backdrop-blur dark:border-[#343934] dark:bg-[#1b1f1c]/95 dark:shadow-black/20">

              {/* CARD HEADER */}

              <div className="border-b border-[#eeeae4] px-6 pb-5 pt-7 dark:border-[#30352f] sm:px-8">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#765b6b] dark:text-[#c7aebe]">
                      {accountExists
                        ? "Welcome back"
                        : "Get started"}
                    </p>

                    <h2 className="text-2xl font-black tracking-tight">
                      {accountExists
                        ? "Sign in"
                        : "Create your account"}
                    </h2>

                    <p className="mt-1.5 text-xs leading-5 text-[#918b82] dark:text-[#aaa69e]">
                      {accountExists
                        ? "Continue where you left off."
                        : "Set up your Lockin account on this device."}
                    </p>
                  </div>

                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#765b6b]/10 text-[#765b6b] dark:bg-[#765b6b]/20 dark:text-[#c7aebe] sm:flex">
                    {accountExists ? (
                      <LockKeyhole size={19} />
                    ) : (
                      <User size={19} />
                    )}
                  </div>

                </div>
              </div>

              {/* FORM */}

              <div className="px-6 py-6 sm:px-8 sm:py-7">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* NAME */}

                  {!accountExists && (
                    <div>
                      <label className="mb-2 block text-xs font-black">
                        Name
                      </label>

                      <div className="group flex h-12 items-center gap-3 rounded-2xl border border-[#ded9d1] bg-[#faf9f6] px-4 transition focus-within:border-[#765b6b] focus-within:ring-4 focus-within:ring-[#765b6b]/10 dark:border-[#343934] dark:bg-[#151815] dark:focus-within:border-[#c7aebe] dark:focus-within:ring-[#765b6b]/10">

                        <User
                          size={17}
                          className="shrink-0 text-[#918b82] transition group-focus-within:text-[#765b6b] dark:group-focus-within:text-[#c7aebe]"
                        />

                        <input
                          type="text"
                          value={name}
                          onChange={(event) =>
                            setName(event.target.value)
                          }
                          placeholder="Your name"
                          autoComplete="name"
                          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#aaa49c] dark:placeholder:text-[#716f69]"
                        />
                      </div>
                    </div>
                  )}

                  {/* EMAIL */}

                  <div>
                    <label className="mb-2 block text-xs font-black">
                      Email
                    </label>

                    <div className="group flex h-12 items-center gap-3 rounded-2xl border border-[#ded9d1] bg-[#faf9f6] px-4 transition focus-within:border-[#765b6b] focus-within:ring-4 focus-within:ring-[#765b6b]/10 dark:border-[#343934] dark:bg-[#151815] dark:focus-within:border-[#c7aebe]">

                      <Mail
                        size={17}
                        className="shrink-0 text-[#918b82] transition group-focus-within:text-[#765b6b] dark:group-focus-within:text-[#c7aebe]"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#aaa49c] dark:placeholder:text-[#716f69]"
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}

                  <div>
                    <label className="mb-2 block text-xs font-black">
                      {accountExists
                        ? "Password"
                        : "Login password"}
                    </label>

                    <div className="group flex h-12 items-center gap-3 rounded-2xl border border-[#ded9d1] bg-[#faf9f6] px-4 transition focus-within:border-[#765b6b] focus-within:ring-4 focus-within:ring-[#765b6b]/10 dark:border-[#343934] dark:bg-[#151815] dark:focus-within:border-[#c7aebe]">

                      <LockKeyhole
                        size={17}
                        className="shrink-0 text-[#918b82] transition group-focus-within:text-[#765b6b] dark:group-focus-within:text-[#c7aebe]"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={loginPassword}
                        onChange={(event) =>
                          setLoginPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter your password"
                        autoComplete={
                          accountExists
                            ? "current-password"
                            : "new-password"
                        }
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#aaa49c] dark:placeholder:text-[#716f69]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (current) => !current
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="shrink-0 rounded-lg p-1.5 text-[#918b82] transition hover:bg-black/5 hover:text-[#765b6b] dark:hover:bg-white/5 dark:hover:text-[#c7aebe]"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}

                  {!accountExists && (
                    <div>
                      <label className="mb-2 block text-xs font-black">
                        Confirm password
                      </label>

                      <div className="group flex h-12 items-center gap-3 rounded-2xl border border-[#ded9d1] bg-[#faf9f6] px-4 transition focus-within:border-[#765b6b] focus-within:ring-4 focus-within:ring-[#765b6b]/10 dark:border-[#343934] dark:bg-[#151815] dark:focus-within:border-[#c7aebe]">

                        <LockKeyhole
                          size={17}
                          className="shrink-0 text-[#918b82] transition group-focus-within:text-[#765b6b] dark:group-focus-within:text-[#c7aebe]"
                        />

                        <input
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(
                              event.target.value
                            )
                          }
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#aaa49c] dark:placeholder:text-[#716f69]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (current) => !current
                            )
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          className="shrink-0 rounded-lg p-1.5 text-[#918b82] transition hover:bg-black/5 hover:text-[#765b6b] dark:hover:bg-white/5 dark:hover:text-[#c7aebe]"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* INFO */}

                  {!accountExists && (
                    <div className="flex gap-3 rounded-2xl border border-[#e5dfd8] bg-[#f8f5f1] px-4 py-3.5 dark:border-[#343934] dark:bg-[#171a17]">

                      <ShieldCheck
                        size={17}
                        className="mt-0.5 shrink-0 text-[#765b6b] dark:text-[#c7aebe]"
                      />

                      <p className="text-[11px] leading-5 text-[#777169] dark:text-[#aaa69e]">
                        Your login information is stored
                        locally on this device. Your Archive
                        password is set separately when you
                        first open Archives.
                      </p>

                    </div>
                  )}

                  {/* ERROR */}

                  {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold leading-5 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400">
                      {error}
                    </div>
                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#765b6b] px-5 text-sm font-black text-white shadow-[0_4px_0_#594451] transition hover:-translate-y-0.5 hover:shadow-[0_6px_0_#594451] active:translate-y-0 active:shadow-[0_2px_0_#594451] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Please wait..."
                      : accountExists
                      ? "Sign in"
                      : "Create account"}

                    {!loading && (
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </button>
                </form>

                {/* SWITCH */}

                <div className="mt-6 text-center">

                  <button
                    type="button"
                    onClick={switchMode}
                    className="text-xs font-bold text-[#765b6b] transition hover:underline dark:text-[#c7aebe]"
                  >
                    {accountExists
                      ? "Need to create an account?"
                      : "Already have an account? Sign in"}
                  </button>

                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-[10px] leading-5 text-[#918b82] dark:text-[#716f69]">
              Lockin keeps your account data on this device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;