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
  // SWITCH MODE
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
    <div
      className="
        relative
        min-h-[100dvh]
        overflow-x-hidden
        overflow-y-auto
        bg-[#f6f4ef]
        px-3
        py-4
        text-[#292725]
        transition-colors
        duration-300
        sm:px-5
        sm:py-6
        md:px-6
        dark:bg-[#101310]
        dark:text-white
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-24
          -top-24
          h-52
          w-52
          rounded-full
          bg-[#765b6b]/10
          blur-3xl
          sm:-left-32
          sm:-top-32
          sm:h-72
          sm:w-72
          dark:bg-[#765b6b]/20
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -right-24
          h-56
          w-56
          rounded-full
          bg-[#627b82]/10
          blur-3xl
          sm:-bottom-40
          sm:-right-32
          sm:h-80
          sm:w-80
        "
      />

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-6xl
          items-center
          justify-between
        "
      >
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#765b6b]
              text-sm
              font-black
              text-white
              shadow-[0_3px_0_#594451]
              sm:h-10
              sm:w-10
              sm:rounded-2xl
            "
          >
            L
          </div>

          <span className="hidden text-sm font-black sm:block">
            Lockin
          </span>
        </div>

        {/* THEME BUTTON */}

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
          className="
            group
            flex
            h-10
            shrink-0
            items-center
            gap-2
            rounded-xl
            border
            border-[#ded9d1]
            bg-white
            px-3
            text-[#625e58]
            shadow-sm
            transition
            hover:-translate-y-0.5
            hover:shadow-md
            sm:h-11
            sm:rounded-2xl
            dark:border-[#343934]
            dark:bg-[#1b1f1c]
            dark:text-[#d8d5cf]
          "
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

          <span className="hidden text-xs font-black xs:block sm:block">
            {darkMode ? "Light" : "Dark"}
          </span>
        </button>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-6xl
          items-center
          justify-center
          py-6
          sm:py-10
          lg:min-h-[calc(100dvh-7rem)]
          lg:py-12
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-8
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-12
          "
        >
          {/* =================================================
              LEFT INTRO
          ================================================= */}

          <section className="hidden lg:block">
            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#ded9d1]
                bg-white/70
                px-3
                py-1.5
                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]
                text-[#765b6b]
                backdrop-blur
                dark:border-[#343934]
                dark:bg-[#1b1f1c]/70
                dark:text-[#c7aebe]
              "
            >
              <ShieldCheck size={13} />
              Your productivity space
            </div>

            <h1
              className="
                max-w-lg
                text-4xl
                font-black
                leading-[1.05]
                tracking-[-0.04em]
                xl:text-5xl
              "
            >
              Stay focused.
              <br />
              <span className="text-[#765b6b] dark:text-[#c7aebe]">
                Keep locking in.
              </span>
            </h1>

            <p
              className="
                mt-6
                max-w-md
                text-sm
                leading-7
                text-[#777169]
                dark:text-[#aaa69e]
              "
            >
              Organize your tasks, build consistency,
              and keep your attention on what matters.
            </p>

            <div
              className="
                mt-8
                flex
                items-center
                gap-3
                text-xs
                font-bold
                text-[#918b82]
                dark:text-[#aaa69e]
              "
            >
              <div className="flex -space-x-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#f6f4ef]
                    bg-[#765b6b]
                    text-[10px]
                    font-black
                    text-white
                    dark:border-[#101310]
                  "
                >
                  L
                </div>

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#f6f4ef]
                    bg-[#627b82]
                    text-[10px]
                    font-black
                    text-white
                    dark:border-[#101310]
                  "
                >
                  +
                </div>
              </div>

              Simple. Focused. Yours.
            </div>
          </section>

          {/* =================================================
              AUTH AREA
          ================================================= */}

          <section
            className="
              mx-auto
              w-full
              max-w-md
              min-w-0
            "
          >
            {/* MOBILE BRAND */}

            <div
              className="
                mb-5
                text-center
                lg:hidden
                sm:mb-7
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#765b6b]
                  text-xl
                  font-black
                  text-white
                  shadow-[0_5px_0_#594451]
                  sm:h-16
                  sm:w-16
                  sm:rounded-3xl
                  sm:text-2xl
                "
              >
                L
              </div>

              <h1
                className="
                  mt-4
                  text-2xl
                  font-black
                  tracking-tight
                  sm:mt-5
                  sm:text-3xl
                "
              >
                Lockin
              </h1>
            </div>

            {/* AUTH CARD */}

            <div
              className="
                w-full
                overflow-hidden
                rounded-[1.5rem]
                border
                border-[#e2ddd5]
                bg-white/95
                shadow-[0_15px_45px_rgba(41,39,37,0.08)]
                backdrop-blur
                sm:rounded-[2rem]
                sm:shadow-[0_20px_60px_rgba(41,39,37,0.08)]
                dark:border-[#343934]
                dark:bg-[#1b1f1c]/95
                dark:shadow-black/20
              "
            >
              {/* CARD HEADER */}

              <div
                className="
                  border-b
                  border-[#eeeae4]
                  px-4
                  pb-4
                  pt-5
                  sm:px-8
                  sm:pb-5
                  sm:pt-7
                  dark:border-[#30352f]
                "
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p
                      className="
                        mb-1.5
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-[#765b6b]
                        sm:mb-2
                        sm:text-[10px]
                        sm:tracking-[0.18em]
                        dark:text-[#c7aebe]
                      "
                    >
                      {accountExists
                        ? "Welcome back"
                        : "Get started"}
                    </p>

                    <h2
                      className="
                        text-xl
                        font-black
                        tracking-tight
                        sm:text-2xl
                      "
                    >
                      {accountExists
                        ? "Sign in"
                        : "Create your account"}
                    </h2>

                    <p
                      className="
                        mt-1
                        text-[11px]
                        leading-5
                        text-[#918b82]
                        sm:mt-1.5
                        sm:text-xs
                        dark:text-[#aaa69e]
                      "
                    >
                      {accountExists
                        ? "Continue where you left off."
                        : "Set up your Lockin account on this device."}
                    </p>
                  </div>

                  <div
                    className="
                      hidden
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#765b6b]/10
                      text-[#765b6b]
                      sm:flex
                      dark:bg-[#765b6b]/20
                      dark:text-[#c7aebe]
                    "
                  >
                    {accountExists ? (
                      <LockKeyhole size={19} />
                    ) : (
                      <User size={19} />
                    )}
                  </div>
                </div>
              </div>

              {/* FORM AREA */}

              <div
                className="
                  px-4
                  py-5
                  sm:px-8
                  sm:py-7
                "
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3.5 sm:space-y-4"
                >
                  {/* NAME */}

                  {!accountExists && (
                    <div>
                      <label className="mb-1.5 block text-xs font-black sm:mb-2">
                        Name
                      </label>

                      <div
                        className="
                          group
                          flex
                          min-w-0
                          items-center
                          gap-2.5
                          rounded-xl
                          border
                          border-[#ded9d1]
                          bg-[#faf9f6]
                          px-3.5
                          transition
                          focus-within:border-[#765b6b]
                          focus-within:ring-4
                          focus-within:ring-[#765b6b]/10
                          sm:h-12
                          sm:gap-3
                          sm:rounded-2xl
                          sm:px-4
                          dark:border-[#343934]
                          dark:bg-[#151815]
                          dark:focus-within:border-[#c7aebe]
                          dark:focus-within:ring-[#765b6b]/10
                        "
                      >
                        <User
                          size={17}
                          className="
                            shrink-0
                            text-[#918b82]
                            transition
                            group-focus-within:text-[#765b6b]
                            dark:group-focus-within:text-[#c7aebe]
                          "
                        />

                        <input
                          type="text"
                          value={name}
                          onChange={(event) =>
                            setName(event.target.value)
                          }
                          placeholder="Your name"
                          autoComplete="name"
                          className="
                            min-w-0
                            flex-1
                            bg-transparent
                            py-3
                            text-sm
                            font-semibold
                            outline-none
                            placeholder:text-[#aaa49c]
                            dark:placeholder:text-[#716f69]
                          "
                        />
                      </div>
                    </div>
                  )}

                  {/* EMAIL */}

                  <div>
                    <label className="mb-1.5 block text-xs font-black sm:mb-2">
                      Email
                    </label>

                    <div
                      className="
                        group
                        flex
                        min-w-0
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-[#ded9d1]
                        bg-[#faf9f6]
                        px-3.5
                        transition
                        focus-within:border-[#765b6b]
                        focus-within:ring-4
                        focus-within:ring-[#765b6b]/10
                        sm:h-12
                        sm:gap-3
                        sm:rounded-2xl
                        sm:px-4
                        dark:border-[#343934]
                        dark:bg-[#151815]
                        dark:focus-within:border-[#c7aebe]
                        dark:focus-within:ring-[#765b6b]/10
                      "
                    >
                      <Mail
                        size={17}
                        className="
                          shrink-0
                          text-[#918b82]
                          transition
                          group-focus-within:text-[#765b6b]
                          dark:group-focus-within:text-[#c7aebe]
                        "
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="
                          min-w-0
                          flex-1
                          bg-transparent
                          py-3
                          text-sm
                          font-semibold
                          outline-none
                          placeholder:text-[#aaa49c]
                          dark:placeholder:text-[#716f69]
                        "
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}

                  <div>
                    <label className="mb-1.5 block text-xs font-black sm:mb-2">
                      {accountExists
                        ? "Password"
                        : "Login password"}
                    </label>

                    <div
                      className="
                        group
                        flex
                        min-w-0
                        items-center
                        gap-2.5
                        rounded-xl
                        border
                        border-[#ded9d1]
                        bg-[#faf9f6]
                        px-3.5
                        transition
                        focus-within:border-[#765b6b]
                        focus-within:ring-4
                        focus-within:ring-[#765b6b]/10
                        sm:h-12
                        sm:gap-3
                        sm:rounded-2xl
                        sm:px-4
                        dark:border-[#343934]
                        dark:bg-[#151815]
                        dark:focus-within:border-[#c7aebe]
                        dark:focus-within:ring-[#765b6b]/10
                      "
                    >
                      <LockKeyhole
                        size={17}
                        className="
                          shrink-0
                          text-[#918b82]
                          transition
                          group-focus-within:text-[#765b6b]
                          dark:group-focus-within:text-[#c7aebe]
                        "
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
                        className="
                          min-w-0
                          flex-1
                          bg-transparent
                          py-3
                          text-sm
                          font-semibold
                          outline-none
                          placeholder:text-[#aaa49c]
                          dark:placeholder:text-[#716f69]
                        "
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
                        className="
                          shrink-0
                          rounded-lg
                          p-2
                          text-[#918b82]
                          transition
                          hover:bg-black/5
                          hover:text-[#765b6b]
                          dark:hover:bg-white/5
                          dark:hover:text-[#c7aebe]
                        "
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
                      <label className="mb-1.5 block text-xs font-black sm:mb-2">
                        Confirm password
                      </label>

                      <div
                        className="
                          group
                          flex
                          min-w-0
                          items-center
                          gap-2.5
                          rounded-xl
                          border
                          border-[#ded9d1]
                          bg-[#faf9f6]
                          px-3.5
                          transition
                          focus-within:border-[#765b6b]
                          focus-within:ring-4
                          focus-within:ring-[#765b6b]/10
                          sm:h-12
                          sm:gap-3
                          sm:rounded-2xl
                          sm:px-4
                          dark:border-[#343934]
                          dark:bg-[#151815]
                          dark:focus-within:border-[#c7aebe]
                          dark:focus-within:ring-[#765b6b]/10
                        "
                      >
                        <LockKeyhole
                          size={17}
                          className="
                            shrink-0
                            text-[#918b82]
                            transition
                            group-focus-within:text-[#765b6b]
                            dark:group-focus-within:text-[#c7aebe]
                          "
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
                          className="
                            min-w-0
                            flex-1
                            bg-transparent
                            py-3
                            text-sm
                            font-semibold
                            outline-none
                            placeholder:text-[#aaa49c]
                            dark:placeholder:text-[#716f69]
                          "
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
                          className="
                            shrink-0
                            rounded-lg
                            p-2
                            text-[#918b82]
                            transition
                            hover:bg-black/5
                            hover:text-[#765b6b]
                            dark:hover:bg-white/5
                            dark:hover:text-[#c7aebe]
                          "
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
                    <div
                      className="
                        flex
                        gap-2.5
                        rounded-xl
                        border
                        border-[#e5dfd8]
                        bg-[#f8f5f1]
                        px-3.5
                        py-3
                        sm:gap-3
                        sm:rounded-2xl
                        sm:px-4
                        sm:py-3.5
                        dark:border-[#343934]
                        dark:bg-[#171a17]
                      "
                    >
                      <ShieldCheck
                        size={17}
                        className="
                          mt-0.5
                          shrink-0
                          text-[#765b6b]
                          dark:text-[#c7aebe]
                        "
                      />

                      <p
                        className="
                          min-w-0
                          text-[10px]
                          leading-5
                          text-[#777169]
                          sm:text-[11px]
                          dark:text-[#aaa69e]
                        "
                      >
                        Your login information is stored
                        locally on this device. Your Archive
                        password is set separately when you
                        first open Archives.
                      </p>
                    </div>
                  )}

                  {/* ERROR */}

                  {error && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-rose-200
                        bg-rose-50
                        px-3.5
                        py-3
                        text-[11px]
                        font-bold
                        leading-5
                        text-rose-600
                        sm:rounded-2xl
                        sm:px-4
                        dark:border-rose-900/40
                        dark:bg-rose-950/20
                        dark:text-rose-400
                      "
                    >
                      {error}
                    </div>
                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      group
                      mt-1
                      flex
                      min-h-12
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#765b6b]
                      px-5
                      py-3
                      text-sm
                      font-black
                      text-white
                      shadow-[0_4px_0_#594451]
                      transition
                      hover:-translate-y-0.5
                      hover:shadow-[0_6px_0_#594451]
                      active:translate-y-0
                      active:shadow-[0_2px_0_#594451]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      sm:rounded-2xl
                    "
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

                <div className="mt-5 text-center sm:mt-6">
                  <button
                    type="button"
                    onClick={switchMode}
                    className="
                      px-2
                      text-[11px]
                      font-bold
                      text-[#765b6b]
                      transition
                      hover:underline
                      sm:text-xs
                      dark:text-[#c7aebe]
                    "
                  >
                    {accountExists
                      ? "Need to create an account?"
                      : "Already have an account? Sign in"}
                  </button>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <p
              className="
                mt-4
                px-2
                text-center
                text-[9px]
                leading-5
                text-[#918b82]
                sm:mt-5
                sm:text-[10px]
                dark:text-[#716f69]
              "
            >
              Lockin keeps your account data on this device.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default SignIn;