import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { SigninValidation } from "../../lib/validation";
import type z from "zod";
import memeflix from "../../../public/assetss/images/memeflix.icon.jpg"
import Loader from "@/components/shared/Loader";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/constants/context/AuthContext";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import "./BullAuth.css";

const SigninForm = () => {
  const navigate = useNavigate();

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount } = useSignInAccount();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [focusedField, setFocusedField] = useState<
    "email" | "password" | null
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

  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /*
  |--------------------------------------------------------------------------
  | BULL THEME
  |--------------------------------------------------------------------------
  */

  const currentTheme = useMemo(() => {
    if (isSuccess) return "theme-success";

    if (hasError) return "theme-red";

    if (
      focusedField !== null ||
      email.length > 0 ||
      password.length > 0
    ) {
      return "theme-orange";
    }

    return "theme-green";
  }, [
    hasError,
    focusedField,
    email,
    password,
    isSuccess,
  ]);

  /*
  |--------------------------------------------------------------------------
  | NATURAL BLINKING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (focusedField === "password") return;

    const interval = setInterval(() => {
      if (Math.random() > 0.35) {
        setBlinking(true);

        setTimeout(() => {
          setBlinking(false);
        }, 180);
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [focusedField]);

  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  const clearError = () => {
    if (hasError) {
      setHasError(false);
      setErrorMessage("");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PUPIL TRACKING
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | EMAIL
  |--------------------------------------------------------------------------
  */

  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setEmail(value);

    form.setValue("email", value);

    clearError();

    updatePupil(value);
  };

  const handleEmailFocus = () => {
    setFocusedField("email");

    clearError();

    updatePupil(email);
  };

  /*
  |--------------------------------------------------------------------------
  | PASSWORD
  |--------------------------------------------------------------------------
  */

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setPassword(value);

    form.setValue("password", value);

    clearError();
  };

  const handlePasswordFocus = () => {
    setFocusedField("password");

    clearError();
  };

  /*
  |--------------------------------------------------------------------------
  | BLUR
  |--------------------------------------------------------------------------
  */

  const handleBlur = () => {
    setFocusedField(null);

    setPupilOffset({
      x: 0,
      y: 0,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | EYEBROWS
  |--------------------------------------------------------------------------
  */

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
    focusedField === "password";

  const isPeeking =
    focusedField === "password" && showPassword;

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    e?: FormEvent<HTMLFormElement>
  ) => {
    if (e) {
      e.preventDefault();
    }

    clearError();

    const valid = await form.trigger([
      "email",
      "password",
    ]);

    if (!valid) {
      setHasError(true);
      setErrorMessage(
        "Please enter your email and password."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await signInAccount({
        email,
        password,
      });

      if (!session) {
        throw new Error(
          "Invalid credentials. Please check your email and password."
        );
      }

      const isLoggedIn = await checkAuthUser();

      if (!isLoggedIn) {
        throw new Error(
          "Unable to verify session. Please try again."
        );
      }

      /*
       * SUCCESS
       */

      setIsSubmitting(false);
      setIsSuccess(true);

      if (window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 70,
          origin: {
            y: 0.6,
          },
        });
      }

      /*
       * Same redirect you already use
       */

      setTimeout(() => {
        form.reset();

        setEmail("");
        setPassword("");

        navigate("/auth-loading");
      }, 900);

    } catch (error: any) {
      setIsSubmitting(false);

      setHasError(true);

      setErrorMessage(
        error?.message ||
          "Invalid credentials. Please try again."
      );

      toast.error(
        error?.message ||
          "Unable to sign in."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const handleReset = () => {
    setIsSuccess(false);
    setHasError(false);
    setErrorMessage("");

    setEmail("");
    setPassword("");

    setFocusedField(null);

    setPupilOffset({
      x: 0,
      y: 0,
    });

    form.reset();
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <Form {...form}>
      <div
        className={`min-h-screen flex flex-col justify-between transition-colors duration-500 ${currentTheme}`}
      >

        {/* =========================================================
            HEADER
        ========================================================== */}

        <header className="pt-8 sm:pt-12 px-4 text-center text-white z-10 select-none">

         <img 
            src={memeflix}
            alt="MEMEFLIX"
            className="memelogo"
         />

        </header>


        {/* =========================================================
            BULL
        ========================================================== */}

        <main className="auth-main">

          <p className="text-lg sm:text-2xl font-light tracking-wide  text-white/90">
            {isSuccess
              ? "Glad to have you back"
              : "login to your account"}
          </p>

          <div
            className={`bull-container ${
              hasError
                ? "animate-shake"
                : isSuccess
                ? "animate-bounce-happy"
                : "animate-float"
            }`}
          >

            {/* =====================================================
                BULL SVG
            ====================================================== */}

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


              {/* TUFT */}

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


              {/* =================================================
                  LEFT EYE
              ================================================== */}

              <g
                id="leftEyeGroup"
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
                    isEyesCovered || blinking
                      ? "eyelid-closed"
                      : "eyelid-open"
                  }`}
                />

                {(isEyesCovered || blinking) && (
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
                  style={{
                    transformOrigin: "0% 0%",
                  }}
                />

              </g>


              {/* =================================================
                  RIGHT EYE
              ================================================== */}

              <g
                id="rightEyeGroup"
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

                {(!isEyesCovered || isPeeking) && (
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
                    (isEyesCovered && !isPeeking) ||
                    blinking
                      ? "eyelid-closed"
                      : "eyelid-open"
                  }`}
                />

                {((isEyesCovered && !isPeeking) ||
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
                  style={{
                    transformOrigin: "100% 0%",
                  }}
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


            {/* =====================================================
                INPUT PANEL
            ====================================================== */}

            <div className="auth-panel">

              <form
                onSubmit={handleSubmit}
                className="auth-form"
              >

                {/* EMAIL */}

                <div className="auth-field">

                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={handleEmailFocus}
                    onBlur={handleBlur}
                    className="auth-input"
                    disabled={isSuccess}
                  />

                </div>


                {/* PASSWORD */}

                <div className="auth-field auth-password-field">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={handlePasswordFocus}
                    onBlur={handleBlur}
                    className="auth-input auth-password-input"
                    disabled={isSuccess}
                  />


                  {/* PASSWORD TOGGLE */}

                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="password-toggle"
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (

                      <svg
                        className="password-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />

                      </svg>

                    ) : (

                      <svg
                        className="password-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />

                      </svg>

                    )}

                  </button>

                </div>

              </form>

            </div>


            {/* =====================================================
                ERROR
            ====================================================== */}

            {hasError && (

              <div className="auth-error">
                ⚠️ {errorMessage}
              </div>

            )}


            {/* =====================================================
                BULL BUTTON
            ====================================================== */}

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


              {/* GO BUTTON */}

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={
                  isSubmitting ||
                  isUserLoading ||
                  isSuccess
                }
                className="btn-action flex-1 py-1.5 sm:py-2 text-white font-bold text-xs sm:text-sm tracking-widest rounded uppercase select-none cursor-pointer flex items-center justify-center gap-1"
              >

                {isSubmitting ||
                isUserLoading ? (

                  <span className="inline-flex gap-1">

                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />

                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-100" />

                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-200" />

                  </span>

                ) : isSuccess ? (
                  "✓ Done"
                ) : (
                  "go"
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

        </main>


        {/* =========================================================
            FOOTER
        ========================================================== */}

        <footer className="py-4 sm:py-6 px-4 text-center z-10">

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-white/90 font-medium">

            <Link
              to="/sign-up"
              className="hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition"
            >
              Don't have an account? Sign Up
            </Link>

            <span className="opacity-40">
              |
            </span>

            <Link
              to="/forgot-password"
              className="hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition"
            >
              Forgot Password?
            </Link>

          </div>

        </footer>


        {/* =========================================================
            SUCCESS MODAL
        ========================================================== */}

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
                Authenticated!
              </h3>

              <p className="text-sm text-gray-500 mt-2 mb-6">
                Signed in successfully as{" "}
                <strong className="text-gray-700">
                  {email}
                </strong>
              </p>

            </div>

          </div>

        )}

      </div>
    </Form>
  );
};

export default SigninForm;
