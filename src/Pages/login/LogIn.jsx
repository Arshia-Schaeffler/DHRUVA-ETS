import { useReducer, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../components/common/AxiosInstance";
import { FiUser, FiLock, FiArrowRight, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

// ============================================================================
// LOGO — why it was broken, and how to fix it for real
// ============================================================================
// Your old code had:
//     const SCHAEFFLER_LOGO = "REPLACE_WITH_YOUR_BASE64_LOGO_STRING";
// That's a placeholder, not an image — the browser had nothing real to load,
// so it showed a broken-image icon. There was never a "bug" in the layout,
// there was just no actual logo data behind it.
//
// Do ONE of these three things:
//
// OPTION A (best — recommended): put the real logo file in your project and
// import it like a normal asset. Put your PNG/SVG at
// src/assets/schaeffler-logo.svg (or .png) and uncomment this line:
// import SCHAEFFLER_LOGO from "../../assets/schaeffler-logo.svg";
//
// OPTION B: keep it as a base64 string, but put the FULL string (it will be
// long — often 5,000+ characters) in its own file so this component stays
// readable:
//     // src/assets/schaefflerLogo.js
//     export const SCHAEFFLER_LOGO = "data:image/png;base64,iVBORw0K...";
// then:
// import { SCHAEFFLER_LOGO } from "../../assets/schaefflerLogo";
//
// OPTION C (fastest, zero files): paste the full base64 string directly
// where the placeholder is below, replacing the whole
// "REPLACE_WITH_YOUR_BASE64_LOGO_STRING" value.
//
// Until you plug in a real source, the component below automatically shows
// a clean text wordmark instead of a broken image — so your page always
// looks finished, even before the logo file is wired up.
const SCHAEFFLER_LOGO = "REPLACE_WITH_YOUR_BASE64_LOGO_STRING";
const hasRealLogo =
  SCHAEFFLER_LOGO && !SCHAEFFLER_LOGO.startsWith("REPLACE_WITH");

// ============================================================================
// COLOR SYSTEM — grounded in Schaeffler's actual brand green, not a generic
// "green" guess. Deepened the background so the green has room to breathe,
// added one warm-neutral for the form side so it doesn't feel clinical.
// ============================================================================
//   --sch-ink        #07130F   near-black with a whisper of green, brand panel bg
//   --sch-ink-soft    #0E1F17   secondary depth inside the brand panel
//   --sch-green       #00A651   Schaeffler primary green — buttons, focus, accents
//   --sch-green-deep  #027A3E   hover / pressed state, and the small print
//   --sch-mint        #7BE7AE   glow / motif lines on the dark panel only
//   --sch-paper       #F7FAF8   warm near-white, right panel background
//   --sch-slate       #10201A   primary text
//   --sch-muted       #5E7268   secondary text / placeholders
//   --sch-line        #DDE6E1   borders, dividers

const loginReducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// A quiet, precise clock — reads like an instrument, not a widget.
const useLiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const LogIn = () => {
  const [state, dispatch] = useReducer(loginReducer, { error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const now = useLiveClock();

  const time = now.toLocaleTimeString("en-GB", { hour12: false });
  const date = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      dispatch({ type: "SET_ERROR", payload: "" });
      try {
        const response = await axiosInstance.post("/auth/login", values);
        const { token, role, EmpId } = response.data;
        login(token, role, EmpId);

        if (role === "Admin") navigate("/admin/dashboard");
        else if (role === "Manager") navigate("/manager/dashboard");
        else if (role === "User") navigate("/user/dashboard");
        else navigate("/login");
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Invalid username or password." });
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-[#F7FAF8] font-sans text-[#10201A]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .sch-font-display { font-family: 'Space Grotesk', 'Inter', sans-serif; }
        .sch-font-body { font-family: 'Inter', sans-serif; }
        .sch-tabular { font-variant-numeric: tabular-nums; }

        .sch-ring-orbit {
          animation: sch-spin 90s linear infinite;
          transform-origin: 310px 310px;
        }
        .sch-ring-orbit-rev {
          animation: sch-spin-rev 130s linear infinite;
          transform-origin: 310px 310px;
        }
        @keyframes sch-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes sch-spin-rev {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sch-ring-orbit, .sch-ring-orbit-rev { animation: none; }
        }

        .sch-input:focus-within {
          border-color: #00A651;
          box-shadow: 0 0 0 3px rgba(0, 166, 81, 0.14);
        }

        .sch-btn {
          background: linear-gradient(135deg, #00A651 0%, #027A3E 100%);
        }
        .sch-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #00934A 0%, #026636 100%);
        }

        .sch-checkbox {
          accent-color: #00A651;
        }
      `}</style>

      {/* ================= Left — brand panel ================= */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between bg-[#07130F] text-white px-14 py-12 overflow-hidden">
        {/* subtle depth wash so the panel isn't a flat black rectangle */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 900px 600px at 15% 90%, rgba(0,166,81,0.16), transparent 60%)",
          }}
          aria-hidden="true"
        />

        {/* Precision bearing motif — two rings drifting at different, slow speeds */}
        <svg
          className="pointer-events-none absolute -right-52 top-1/2 -translate-y-1/2 opacity-[0.16]"
          width="620"
          height="620"
          viewBox="0 0 620 620"
          fill="none"
          aria-hidden="true"
        >
          <g className="sch-ring-orbit">
            <circle cx="310" cy="310" r="300" stroke="#7BE7AE" strokeWidth="1" />
            <circle cx="310" cy="310" r="150" stroke="#7BE7AE" strokeWidth="1" />
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * 2 * Math.PI;
              const cx = 310 + 185 * Math.cos(angle);
              const cy = 310 + 185 * Math.sin(angle);
              return <circle key={i} cx={cx} cy={cy} r="12" stroke="#7BE7AE" strokeWidth="1" />;
            })}
          </g>
          <g className="sch-ring-orbit-rev">
            <circle cx="310" cy="310" r="220" stroke="#7BE7AE" strokeWidth="1" strokeDasharray="2 10" />
          </g>
        </svg>

        {/* Logo — falls back to a clean text wordmark until a real logo file is wired in */}
        <div className="relative z-10 h-9 flex items-center">
          {hasRealLogo ? (
            <img
              src={SCHAEFFLER_LOGO}
              alt="Schaeffler"
              className="h-full w-auto object-contain object-left"
            />
          ) : (
            <span className="sch-font-display text-[22px] font-semibold tracking-tight text-white">
              SCHAEFFLER
            </span>
          )}
        </div>

        <div className="relative z-10 max-w-sm">
          <p className="text-[13px] text-[#7BE7AE] mb-3 sch-font-body">Employee Portal</p>
          <h1 className="sch-font-display text-[30px] leading-[1.25] font-medium text-white/95">
            Precision engineering starts with a secure sign-in.
          </h1>
        </div>

        {/* Live instrument reading — quiet, technical, on-brand rather than decorative */}
        <div className="relative z-10">
          <div className="h-px w-full bg-white/10 mb-5" />
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] text-white/40 sch-font-body mb-1">Local time</p>
              <p className="sch-font-display sch-tabular text-[26px] text-white/90 leading-none">
                {time}
              </p>
              <p className="text-[12px] text-white/40 sch-font-body mt-1.5">{date}</p>
            </div>
            <p className="text-[12px] text-white/30 sch-font-body">
              © {now.getFullYear()} Schaeffler Group
            </p>
          </div>
        </div>
      </div>

      {/* ================= Right — form panel ================= */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-[380px]"
        >
          {/* Compact lockup for mobile / tablet, where the brand panel is hidden */}
          <div className="lg:hidden h-7 flex items-center mb-10">
            {hasRealLogo ? (
              <img src={SCHAEFFLER_LOGO} alt="Schaeffler" className="h-full w-auto object-contain object-left" />
            ) : (
              <span className="sch-font-display text-[18px] font-semibold tracking-tight text-[#07130F]">
                SCHAEFFLER
              </span>
            )}
          </div>

          <div className="mb-9">
            <h2 className="sch-font-display text-[28px] font-semibold text-[#10201A] tracking-tight">
              Sign in
            </h2>
            <p className="text-[15px] text-[#5E7268] mt-1.5 sch-font-body">
              Enter your employee credentials to reach your dashboard.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-[13px] font-medium text-[#10201A] mb-1.5 sch-font-body">
                Username
              </label>
              <div
                className={`sch-input flex items-center gap-3 rounded-[8px] border px-3.5 py-3 bg-white transition-colors ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-400"
                    : "border-[#DDE6E1]"
                }`}
              >
                <FiUser className="text-[#8A9490] text-base shrink-0" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="you@schaeffler.com"
                  className="w-full bg-transparent outline-none text-[#10201A] placeholder-[#A3ACA9] text-[15px] sch-font-body"
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-600 text-[13px] mt-1.5 sch-font-body">{formik.errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-[#10201A] mb-1.5 sch-font-body">
                Password
              </label>
              <div
                className={`sch-input flex items-center gap-3 rounded-[8px] border px-3.5 py-3 bg-white transition-colors ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-400"
                    : "border-[#DDE6E1]"
                }`}
              >
                <FiLock className="text-[#8A9490] text-base shrink-0" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none text-[#10201A] placeholder-[#A3ACA9] text-[15px] sch-font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[#8A9490] hover:text-[#10201A] transition-colors shrink-0"
                >
                  {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-600 text-[13px] mt-1.5 sch-font-body">{formik.errors.password}</p>
              )}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[13px] text-[#5E7268] sch-font-body cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((v) => !v)}
                  className="sch-checkbox w-3.5 h-3.5 rounded-[3px] border-[#DDE6E1] cursor-pointer"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-[13px] font-medium text-[#027A3E] hover:text-[#00A651] transition-colors sch-font-body"
              >
                Forgot password?
              </button>
            </div>

            {/* Error message */}
            {state.error && (
              <div
                role="alert"
                className="text-red-700 text-[14px] text-center font-medium bg-red-50 border border-red-200 rounded-[8px] py-2.5 sch-font-body"
              >
                {state.error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              aria-label="Log In"
              className="sch-btn w-full flex items-center justify-center gap-2 py-3 mt-2 disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00A651] transition-colors text-white rounded-[8px] font-semibold text-[15px] sch-font-body shadow-[0_8px_20px_-6px_rgba(0,166,81,0.55)]"
            >
              {formik.isSubmitting ? (
                <>
                  <FiLoader className="text-base animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Log in
                  <FiArrowRight className="text-base" />
                </>
              )}
            </button>
          </form>

          <p className="text-[13px] text-[#8A9490] text-center mt-8 sch-font-body">
            Trouble signing in? Contact your IT administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LogIn;
