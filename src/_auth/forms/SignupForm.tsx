import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SignupValidation } from "../../lib/validation";
import type z from "zod";

import memeflix from "../../../public/assetss/images/memeflix.icon.jpg";

import {
  useCreateUserAccount,
  useSignInAccount,
  useSignInWithGoogle,
} from "@/lib/react-query/queriesAndMutations";

import { useUserContext } from "@/constants/context/AuthContext";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import "./BullAuth.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();

  /* =========================================================
     STEP
  ========================================================= */

  // 1 = email
  // 2 = name + username + password
  const [step, setStep] = useState(1);

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
  useCreateUserAccount();

  const { mutateAsync: signInAccount } = useSignInAccount();
  /* =========================================================
     VISUAL STATE
  ========================================================= */

  const [focusedField, setFocusedField] = useState<
    "name" | "username" | "email" | "password" | "confirmPassword" | null
  >(null);

  const [showPassword, setShowPassword] = useState(false);

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [pupilOffset, setPupilOffset] = useState({
    x: 0,
    y: 0,
  });

  const [blinking, setBlinking] = useState(false);

 
  /* =========================================================
     FORM
  ========================================================= */

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),

    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  /* =========================================================
     THEME
  ========================================================= */

  const currentTheme = useMemo(() => {
    if (isSuccess) {
      return "theme-success";
    }

    if (hasError) {
      return "theme-red";
    }

    if (
      focusedField !== null ||
      name.length > 0 ||
      username.length > 0 ||
      email.length > 0 ||
      password.length > 0
    ) {
      return "theme-orange";
    }

    return "theme-green";
  }, [
    hasError,
    focusedField,
    name,
    username,
    email,
    password,
    isSuccess,
  ]);

  /* =========================================================
     NATURAL BLINKING
  ========================================================= */

  useEffect(() => {
    if (
      focusedField === "password" ||
      focusedField === "confirmPassword"
    ) {
      return;
    }

    const interval = setInterval(() => {
      if (Math.random() > 0.35) {
        setBlinking(true);

        setTimeout(() => {
          setBlinking(false);
        }, 180);
      }
    }, 3200);

    return () => {
      clearInterval(interval);
    };
  }, [focusedField]);

  /* =========================================================
     ERROR
  ========================================================= */

  const clearError = () => {
    if (hasError) {
      setHasError(false);
      setErrorMessage("");
    }
  };

  /* =========================================================
     PUPIL
  ========================================================= */

  const updatePupil = (value: string) => {
    const textLen = value.length;

    const calculatedX = Math.min(
      Math.max(-5 + textLen * 0.5, -6),
      7
    );

    setPupilOffset({
      x: calculatedX,
      y: 3,
    });
  };

  /* =========================================================
     INPUT HANDLERS
  ========================================================= */

  const handleNameChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setName(value);

    form.setValue("name", value, {
      shouldValidate: false,
    });

    clearError();
    updatePupil(value);
  };

  const handleUsernameChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setUsername(value);

    form.setValue("username", value, {
      shouldValidate: false,
    });

    clearError();
    updatePupil(value);
  };

  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setEmail(value);

    form.setValue("email", value, {
      shouldValidate: false,
    });

    clearError();
    updatePupil(value);
  };

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setPassword(value);

    form.setValue("password", value, {
      shouldValidate: false,
    });

    clearError();
  };

  const handleConfirmPasswordChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setConfirmPassword(value);

    clearError();
  };

  /* =========================================================
     FOCUS
  ========================================================= */

  const handleFocus = (
    field:
      | "name"
      | "username"
      | "email"
      | "password"
      | "confirmPassword"
  ) => {
    setFocusedField(field);
    clearError();

    if (field === "name") {
      updatePupil(name);
    }

    if (field === "username") {
      updatePupil(username);
    }

    if (field === "email") {
      updatePupil(email);
    }
  };

  const handleBlur = () => {
    setFocusedField(null);

    setPupilOffset({
      x: 0,
      y: 0,
    });
  };

  /* =========================================================
     EYEBROWS
  ========================================================= */

  const getEyebrowClasses = () => {
    if (isSuccess) {
      return {
        left: "brow-happy-left",
        right: "brow-happy-right",
      };
    }

    if (hasError) {
      return {
        left: "brow-angry-left",
        right: "brow-angry-right",
      };
    }

    if (focusedField) {
      return {
        left: "brow-focus-left",
        right: "brow-focus-right",
      };
    }

    return {
      left: "brow-idle-left",
      right: "brow-idle-right",
    };
  };

  const brows = getEyebrowClasses();

  const isEyesCovered =
    focusedField === "password" ||
    focusedField === "confirmPassword";

  const isPeeking =
    isEyesCovered && showPassword;

  /* =========================================================
     STEP 1
  ========================================================= */

  const handleNext = async () => {
    clearError();

    const valid = await form.trigger([
      "email",
    ]);

    if (!valid) {
      setHasError(true);
      setErrorMessage(
        "Please enter a valid email address."
      );
      return;
    }

    setStep(2);
  };

  /* =========================================================
     SIGNUP
  ========================================================= */
const {
  mutateAsync: googleSignup,
  isPending: isGoogleSigningIn,
} = useSignInWithGoogle();

const handleGoogleSignup = async () => {
  try {
    clearError();
    setIsSubmitting(true);

    await googleSignup();
  } catch (error: any) {
    console.error("GOOGLE SIGNUP ERROR:", error);

    setIsSubmitting(false);
    setHasError(true);

    const message =
      error?.message ||
      "Unable to continue with Google.";

    setErrorMessage(message);
    toast.error(message);
  }
};

const handleSignupSubmit = async (
  e?: FormEvent<HTMLFormElement>
) => {
  e?.preventDefault();

  clearError();

  // ==========================================
  // STEP 1 — EMAIL
  // ==========================================
  if (step === 1) {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setHasError(true);
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setHasError(true);
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStep(2);
    return;
  }

  // ==========================================
  // STEP 2 — NAME + USERNAME
  // ==========================================
  if (step === 2) {
    const cleanName = name.trim();
    const cleanUsername = username.trim().toLowerCase();

    if (cleanName.length < 2) {
      setHasError(true);
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (cleanUsername.length < 2) {
      setHasError(true);
      setErrorMessage("Username must be at least 2 characters.");
      return;
    }

    if (cleanUsername.length > 25) {
      setHasError(true);
      setErrorMessage("Username must be 25 characters or less.");
      return;
    }

    if (!/^[a-zA-Z.]+$/.test(cleanUsername)) {
      setHasError(true);
      setErrorMessage(
        "Username can only contain letters and dots."
      );
      return;
    }

    if (
      cleanUsername.startsWith(".") ||
      cleanUsername.endsWith(".") ||
      cleanUsername.includes("..")
    ) {
      setHasError(true);
      setErrorMessage(
        "Dots cannot start, end, or repeat."
      );
      return;
    }

    setUsername(cleanUsername);
    setStep(3);
    return;
  }

  // ==========================================
  // STEP 3 — PASSWORD
  // ==========================================
  if (step === 3) {
    if (password.length < 8) {
      setHasError(true);
      setErrorMessage(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setHasError(true);
      setErrorMessage(
        "Passwords do not match."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("CREATING ACCOUNT...");

      // ==========================================
      // CREATE APPWRITE ACCOUNT
      // ==========================================

      const newUser = await createUserAccount({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (!newUser) {
        throw new Error(
          "Failed to create your account."
        );
      }

      console.log(
        "ACCOUNT CREATED:",
        newUser
      );

      // ==========================================
      // AUTOMATIC LOGIN
      // ==========================================

      const session = await signInAccount({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!session) {
        throw new Error(
          "Account created, but automatic login failed."
        );
      }

      console.log(
        "SESSION CREATED:",
        session
      );

      // ==========================================
      // CHECK AUTH
      // ==========================================

      const loggedIn = await checkAuthUser();

      if (!loggedIn) {
        throw new Error(
          "Account created, but authentication could not be verified."
        );
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      toast.success(
        "Account created successfully!"
      );

      setTimeout(() => {
        navigate("/auth-loading", {
          replace: true,
        });
      }, 900);

    } catch (error: any) {
      console.error(
        "SIGNUP ERROR:",
        error
      );

      setIsSubmitting(false);
      setHasError(true);

      const message =
        error?.message ||
        "Something went wrong while creating your account.";

      setErrorMessage(message);

      toast.error(message);
    }
  }
};
  /* =========================================================
     RESET
  ========================================================= */

  const handleReset = () => {
    setStep(1);

    setName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setFocusedField(null);

    setHasError(false);
    setErrorMessage("");

    setIsSubmitting(false);
    setIsSuccess(false);

    setShowPassword(false);

    setPupilOffset({
      x: 0,
      y: 0,
    });

    form.reset();
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <Form {...form}>
      <div
        className={`min-h-screen flex flex-col justify-between transition-colors duration-500 ${currentTheme}`}
      >

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="pt-8 sm:pt-12 px-4 text-center text-white z-10 select-none">

          <img
            src={memeflix}
            alt="MEMEFLIX"
            className="memelogo"
          />

        </header>

        {/* =====================================================
            MAIN
        ====================================================== */}

        <main className="auth-main">

          <div
            className={`bull-container ${
              hasError
                ? "animate-shake"
                : isSuccess
                ? "animate-bounce-happy"
                : "animate-float"
            }`}
          >

            {/* =================================================
                BULL
            ================================================== */}

            <svg
              viewBox="0 0 600 460"
              className="bull-svg w-full h-full block"
              xmlns="http://www.w3.org/2000/svg"
            >

              <defs>

                <linearGradient
                  id="hornGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >

                  <stop
                    offset="0%"
                    stopColor="var(--bull-tuft)"
                  />

                  <stop
                    offset="100%"
                    stopColor="var(--bull-dark)"
                  />

                </linearGradient>

              </defs>

              {/* LEFT HORN */}

              <path
                d="M 175 195 C 145 130 190 70 235 125 C 215 150 195 170 175 195 Z"
                fill="url(#hornGrad)"
                stroke="var(--bull-dark)"
                strokeWidth="3"
              />

              {/* RIGHT HORN */}

              <path
                d="M 425 195 C 455 130 410 70 365 125 C 385 150 405 170 425 195 Z"
                fill="url(#hornGrad)"
                stroke="var(--bull-dark)"
                strokeWidth="3"
              />

              {/* BODY */}

              <path
                d="M 20 460 C 20 230 130 175 300 175 C 470 175 580 230 580 460 Z"
                className="bull-body-fill"
              />

              {/* HAIR */}

              <path
                d="M 270 175 C 290 145 310 145 330 175 C 315 170 285 170 270 175 Z"
                className="bull-tuft-fill"
              />

              {/* LEFT EAR */}

              <ellipse
                cx="160"
                cy="205"
                rx="26"
                ry="14"
                transform="rotate(-20 160 205)"
                className="bull-tuft-fill"
              />

              {/* RIGHT EAR */}

              <ellipse
                cx="440"
                cy="205"
                rx="26"
                ry="14"
                transform="rotate(20 440 205)"
                className="bull-tuft-fill"
              />

              {/* LEFT EYE */}

              <g
                transform="translate(252, 222)"
              >

                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill="#ffffff"
                  stroke="var(--bull-dark)"
                  strokeWidth="4"
                />

                {!isEyesCovered && (
                  <circle
                    cx={pupilOffset.x}
                    cy={pupilOffset.y}
                    r="9"
                    className="bull-pupil-fill pupil"
                  />
                )}

                <path
                  d="M -22 0 A 22 22 0 0 1 22 0 L 22 -22 L -22 -22 Z"
                  className={`eyelid ${
                    isEyesCovered ||
                    blinking
                      ? "eyelid-closed"
                      : "eyelid-open"
                  }`}
                />

                {(isEyesCovered ||
                  blinking) && (
                  <line
                    x1="-19"
                    y1="0"
                    x2="19"
                    y2="0"
                    stroke="var(--bull-dark)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}

                <line
                  x1="-24"
                  y1="-27"
                  x2="20"
                  y2="-27"
                  className={`bull-dark-stroke ${brows.left}`}
                  strokeWidth="7"
                  strokeLinecap="round"
                />

              </g>

              {/* RIGHT EYE */}

              <g
                transform="translate(348, 222)"
              >

                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill="#ffffff"
                  stroke="var(--bull-dark)"
                  strokeWidth="4"
                />

                {(!isEyesCovered ||
                  isPeeking) && (
                  <circle
                    cx={pupilOffset.x}
                    cy={pupilOffset.y}
                    r="9"
                    className="bull-pupil-fill pupil"
                  />
                )}

                <path
                  d="M -22 0 A 22 22 0 0 1 22 0 L 22 -22 L -22 -22 Z"
                  className={`eyelid ${
                    (isEyesCovered &&
                      !isPeeking) ||
                    blinking
                      ? "eyelid-closed"
                      : "eyelid-open"
                  }`}
                />

                {((isEyesCovered &&
                  !isPeeking) ||
                  blinking) && (
                  <line
                    x1="-19"
                    y1="0"
                    x2="19"
                    y2="0"
                    stroke="var(--bull-dark)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}

                <line
                  x1="-20"
                  y1="-27"
                  x2="24"
                  y2="-27"
                  className={`bull-dark-stroke ${brows.right}`}
                  strokeWidth="7"
                  strokeLinecap="round"
                />

              </g>

              {/* NOSE */}

              <g className="bull-nose">

                <ellipse
                  cx="300"
                  cy="275"
                  rx="6"
                  ry="4"
                  className="bull-dark-fill"
                  opacity="0.6"
                />

                <ellipse
                  cx="282"
                  cy="276"
                  rx="3.5"
                  ry="3"
                  className="bull-dark-fill"
                />

                <ellipse
                  cx="318"
                  cy="276"
                  rx="3.5"
                  ry="3"
                  className="bull-dark-fill"
                />

              </g>

              {/* ARMS */}

              <path
                d="M 120 325 Q 20 330 150 430"
                className="bull-arm bull-arm-right"
              />

              <path
                d="M 480 325 Q 580 330 450 430"
                className="bull-arm bull-arm-left"
              />

            </svg>

            {/* =================================================
                INPUT PANEL
            ================================================== */}

            <div className="auth-panel">

              <form
                id="signup-form"
                onSubmit={handleSignupSubmit}
                className="auth-form"
              >

                {/* =================================================
                    STEP 1 — EMAIL
                ================================================== */}

                {step === 1 && (
                  <div className="auth-field">
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={email}
                      onChange={handleEmailChange}
                      onFocus={() => handleFocus("email")}
                      onBlur={handleBlur}
                      className="auth-input"
                      disabled={isSuccess}
                      autoComplete="email"
                    />
                  </div>
                )}

                {/* =================================================
                    STEP 2
                ================================================== */}

                {step === 2 && (
                <>
                  <div className="auth-field">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={handleNameChange}
                      onFocus={() => handleFocus("name")}
                      onBlur={handleBlur}
                      className="auth-input"
                      disabled={isSuccess}
                      autoComplete="name"
                    />
                  </div>

                  <div className="auth-field">
                    <input
                      type="text"
                      required
                      placeholder="Username"
                      value={username}
                      onChange={handleUsernameChange}
                      onFocus={() => handleFocus("username")}
                      onBlur={handleBlur}
                      className="auth-input"
                      disabled={isSuccess}
                      autoComplete="username"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="auth-field relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Password"
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => handleFocus("password")}
                      onBlur={handleBlur}
                      className="auth-input"
                      disabled={isSuccess}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="auth-field relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onFocus={() => handleFocus("confirmPassword")}
                      onBlur={handleBlur}
                      className="auth-input"
                      disabled={isSuccess}
                      autoComplete="new-password"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="text-xs text-white/70 hover:text-white transition mt-1"
                  >
                    {showPassword
                      ? "Hide password"
                      : "Show password"}
                  </button>
                </>
              )}

              </form>

            </div>

            {/* =================================================
                ERROR
            ================================================== */}

            {hasError && (
              <div className="auth-error">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* =================================================
                BUTTON
            ================================================== */}

            <div className="auth-button-position">

              {/* LEFT PAW */}

              <div
                className="w-7 sm:w-8 h-9 rounded-l-xl -mr-1 flex flex-col justify-around py-1 px-0.5 z-10"
                style={{
                  backgroundColor:
                    "var(--bull-dark)",
                }}
              >

                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      "var(--bull-tuft)",
                  }}
                />

                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      "var(--bull-tuft)",
                  }}
                />

                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      "var(--bull-tuft)",
                  }}
                />

              </div>

              {/* CENTER */}

             <button
              type="submit"
              disabled={
                isSubmitting ||
                isCreatingAccount ||
                isSuccess
              }
              className="btn-action flex-1 py-1.5 sm:py-2 text-white font-bold text-xs sm:text-sm tracking-widest rounded uppercase select-none cursor-pointer flex items-center justify-center gap-1"
            >
              {isSubmitting || isCreatingAccount ? (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-200" />
                </span>
              ) : isSuccess ? (
                "✓ Done"
              ) : step === 1 ? (
                "Next"
              ) : step === 2 ? (
                "Next"
              ) : (
                "Create Account"
              )}
            </button>

              {/* RIGHT PAW */}

              <div
                className="w-7 sm:w-8 h-9 rounded-r-xl -ml-1 flex flex-col items-end justify-around py-1 px-0.5 z-10"
                style={{
                  backgroundColor:
                    "var(--bull-dark)",
                }}
              >

                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      "var(--bull-tuft)",
                  }}
                />

                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      "var(--bull-tuft)",
                  }}
                />

                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      "var(--bull-tuft)",
                  }}
                />

              </div>

            </div>

          </div>

          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-1 rounded-full transition-all duration-300 ${
                  item === step
                    ? "w-8 bg-white"
                    : item < step
                    ? "w-5 bg-white/70"
                    : "w-5 bg-white/20"
                }`}
              />
            ))}
          </div>

        </main>

        {/* =====================================================
            FOOTER TEXT
        ====================================================== */}

        <p className="text-lg sm:text-2xl font-light tracking-wide mt-1 sm:mt-2 text-white/90 text-center">

          {isSuccess
            ? "Your account is ready!"
            : step === 1
            ? "create your account"
            : step === 2
            ? "tell us about you"
            : "secure your account"}

        </p>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="py-4 sm:py-6 px-4 text-center z-10">

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-white/90 font-medium">

            <Link
              to="/sign-in"
              className="hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition"
            >
              Already have an account? Sign In
            </Link>

            <span className="opacity-40">
              |
            </span>

            <button
              type="button"
              disabled={isSubmitting || isSuccess}
              onClick={handleGoogleSignup}
              className="hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              CONTINUE WITH GOOGLE
            </button>

          </div>

        </footer>

        {/* =====================================================
            SUCCESS MODAL
        ====================================================== */}

        {isSuccess && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">

            <div
              className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border-4"
              style={{
                borderColor:
                  "var(--bull-dark)",
              }}
            >

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold">
                ✓
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                Account Created
              </h3>

              <p className="text-sm text-gray-500 mt-2 mb-6">

                Welcome{" "}

                <strong className="text-gray-700">
                  {username || name}
                </strong>

              </p>

            </div>

          </div>
        )}

      </div>
    </Form>
  );
};

export default SignupForm;