import { RiStockLine } from "react-icons/ri";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { updateField } from "../../redux/slices/formSlice";
import { useLoginMutation, useResendVerificationMutation } from "../../redux/slices/usersApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { ThreeDots } from "react-loader-spinner";
import OAuth from "./OAuth";
import { useResendTimer } from '../../hooks/useResendTimer';

const Login = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { token } = useParams();

  const [login, { isLoading }] = useLoginMutation();
  const [resendVerification] = useResendVerificationMutation();

  const { userInfo } = useAppSelector((state: any) => state.auth);

  const { cooldownTime, canResend, startCooldown } = useResendTimer();

  // Reset verification states when navigating away from token URL
  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setVerificationError(null);
    }
  }, [token]);

  useEffect(() => {
    if (userInfo) {
      navigate("/app");
    } else if (token) {
      setIsVerifying(true);
      autoLogin(token);
    }
  }, [navigate, userInfo, token]);

  const autoLogin = async (token: string) => {
    try {
      const res = await login({ token, isVerification: true }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/app");
    } catch (err: any) {
      setVerificationError(err?.data?.message || "This verification link has expired. Please request a new one from the login page.");
    }
  };

  const formData = useAppSelector((state: any) => state.formData.data);

  const passwordRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      setIsResendLoading(true);
      await resendVerification({ email: verificationEmail }).unwrap();
      setIsResendLoading(false);
      setResendSuccess(true);
      startCooldown();
    } catch (err: any) {
      setIsResendLoading(false);
      setErrorMessage(err?.data?.message || err?.error);
    }
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      const email = formData.loginEmail;
      const password = passwordRef.current?.value;
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/app");
    } catch (err: any) {
      if (err?.data?.message === "Email address has not been verified") {
        setErrorMessage(null);
        setVerificationEmail(formData.loginEmail);
        setShowVerification(true);
      } else {
        setErrorMessage(err?.data?.message || err?.error);
      }
    }
  };

  // Preload the background image
  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src =
      "https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2020/08/xomchart.png";
    preloadImage.onload = () => {
      setIsImageLoaded(true); // Set state to true once the image is loaded
    };
  }, []);

  if (isVerifying || verificationError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        {verificationError ? (
          <div className="text-white text-center px-4">
            <p className="text-xl mb-4">{verificationError}</p>
            <NavLink to="/login" className="text-primary hover:text-hover underline">
              Return to login
            </NavLink>
          </div>
        ) : (
          <ThreeDots color="white" height={50} width={50} />
        )}
      </div>
    );
  }

  if (!isImageLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <ThreeDots color="white" height={50} width={50} />
      </div>
    );
  }

  return (
    <>
      <div className="bg-black h-[80dvh]">
        <div className="flex mt-[8.5dvh] h-[75dvh] bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl h-">
          <div
            className="lg:block lg:w-1/2 bg-black"
            style={{
              backgroundImage:
                "url('https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2020/08/xomchart.png')",
              backgroundPosition: "center", // Centers the background image within the div
              backgroundSize: "cover", // Change this to 'cover', '50%', '100%', or another value as needed
              backgroundRepeat: "no-repeat", // Prevents the background image from repeating
            }}
          ></div>
          <div className="w-full p-8 lg:w-1/2">
            <h2 className="text-2xl font-semibold text-primary text-center btn btn-ghost logo-btn ml-[21%]">
              <RiStockLine /> StockWizard
            </h2>
            <p className="text-xl text-gray-900 text-center">Welcome back!</p>
            <OAuth setErrorMessage={setErrorMessage} />
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-900 uppercase"
              >
                or login with email
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            {/* Login Form */}

            <form id="loginForm" onSubmit={submitHandler}>
              <div className="mt-4">
                <label className="block text-gray-900 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  className="bg-gray-200 text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                  name="loginEmail"
                  value={formData.loginEmail || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block text-gray-900 text-sm font-bold mb-2">
                    Password
                  </label>
                  <NavLink
                    to="/resetpassword"
                    className="text-xs text-gray-900"
                  >
                    Forget Password?
                  </NavLink>
                </div>
                <input
                  className="bg-gray-200 text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="password"
                  ref={passwordRef}
                />
                <div className={`mt-2 text-red-500 text-sm font-medium h-5 ${errorMessage ? 'visible' : 'invisible'}`}>
                  {errorMessage || 'No error'}
                </div>
              </div>
              {showVerification ? (
                <>
                  <div className="mt-8 mb-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-md">
                    <p className="text-green-700 text-sm">
                      Check your email for the verification link.
                    </p>
                    <button
                      onClick={handleResend}
                      disabled={!canResend || isResendLoading}
                      className={`mt-2 text-sm text-primary hover:text-hover underline ${
                        !canResend ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {canResend ? 'Resend verification link' : `Resend available in ${cooldownTime}s`}
                    </button>
                  </div>
                  <div className={`text-sm text-green-600 mb-16 ml-1 transition-opacity duration-300 ${resendSuccess || isResendLoading ? 'opacity-100' : 'opacity-0'}`}>
                    {isResendLoading ? 'Sending verification email...' : 'New verification email sent!'}
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-8">
                    <button
                      type="submit"
                      className={`bg-black text-white font-bold py-2 px-4 w-full rounded hover:bg-hover flex items-center justify-center ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isLoading}
                    >
                      Login
                      <span className="inline-block align-middle ml-1 mt-1">
                        {isLoading && <ThreeDots color="white" height={20} width={20} />}
                      </span>
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="border-b w-1/5 md:w-1/4"></span>
                    <NavLink
                      to="/signup"
                      className="text-xs text-gray-900 uppercase hover:underline underline-offset-4"
                    >
                      or sign up
                    </NavLink>
                    <span className="border-b w-1/5 md:w-1/4"></span>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
