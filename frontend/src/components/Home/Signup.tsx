import { RiStockLine } from "react-icons/ri";
import { FaRegCircleCheck, FaCircleCheck } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import PasswordChecklist from "react-password-checklist";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateField } from "../../redux/slices/formSlice";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRegisterMutation, useResendVerificationMutation } from "../../redux/slices/usersApiSlice";
import { ThreeDots } from "react-loader-spinner";
import OAuth from "./OAuth";
import { RootState } from "../../store";
import { useResendTimer } from '../../hooks/useResendTimer';

const Signup = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [password, setPassword] = useState("");
  const [pwIsValid, setpwIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/app');
    }
  }, [navigate, userInfo]);

  const dispatch = useDispatch();
  const formData = useSelector((state: any) => state.formData.data);
  const [signup, { isLoading }] = useRegisterMutation();
  const [resendVerification] = useResendVerificationMutation();
  const { cooldownTime, canResend, startCooldown } = useResendTimer();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      setIsResendLoading(true);
      await resendVerification({ email: signupEmail }).unwrap();
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
    if (!formData.username || !formData.signupEmail || !password) {
      setErrorMessage("Please enter username, email and password");
      return;
    } 
    
    if (!pwIsValid) {
      setErrorMessage("Password requirements not met");
      return;
    }

    try {
      const res = await signup({ 
        name: formData.username, 
        email: formData.signupEmail, 
        password 
      }).unwrap();

      if (res.message) {
        setErrorMessage(null);
        setSignupSuccess(true);
        setSignupEmail(formData.signupEmail);
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.error);
    }
  };

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = "https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2020/08/xomchart.png";
    preloadImage.onload = () => setIsImageLoaded(true);
  }, []);

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
            <p className="text-xl text-gray-900 text-center">
              Create an account
            </p>
            <OAuth setErrorMessage={setErrorMessage} />
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
                <a
                  href="#"
                  className="text-xs text-center text-gray-900 uppercase"
                >
                  or signup with email
                </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            {/* Signup Form */}

            <form id="signupForm" onSubmit={submitHandler}>
              <div className="mt-4">
                <label className="block text-gray-900 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  className="bg-gray-200 text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-900 text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  className="bg-gray-200 text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                  name="signupEmail"
                  value={formData.signupEmail || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block text-gray-900 text-sm font-bold mb-2">
                    Password
                  </label>
                </div>
                <input
                  className="bg-gray-200 text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className={`mt-2 text-red-500 text-sm font-medium h-5 ${errorMessage ? 'visible' : 'invisible'}`}>
                  {errorMessage || 'No error'}
                </div>
                {!signupSuccess && (
                  <div className="mt-2">
                    <PasswordChecklist
                      iconComponents={{
                        ValidIcon: (
                          <FaCircleCheck className="mr-1 mt-[1px] text-secondary text-base" />
                        ),
                        InvalidIcon: (
                          <FaRegCircleCheck className="mr-1 mt-[1px] text-base" />
                        ),
                      }}
                      invalidTextColor="#333"
                      className="text-xs text-black font-bold grid grid-cols-2"
                      rules={[
                        "minLength",
                        "capital",
                        "number",
                        "specialChar",
                      ]}
                      minLength={8}
                      value={password}
                      onChange={(isValid) => {
                        setpwIsValid(isValid);
                      }}
                      messages={{
                        capital: "Contains Uppercase",
                        specialChar: "Contains Special Character",
                        number: "Contains Number",
                        minLength: "At least 8 characters",
                      }}
                    />
                  </div>
                )}
              </div>
              {signupSuccess && (
                <>
                  <div className="mt-8 mb-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-md">
                    <p className="text-green-700 text-sm">
                      Verification link has been sent to your email.
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
                    {isResendLoading ? 'Sending verification email...' : 'New verification email sent'}
                  </div>
                </>
              )}
              <div className="mt-8">
                <button
                  type="submit"
                  className={`bg-black text-white font-bold py-2 px-4 w-full rounded hover:bg-hover ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  Sign Up
                  <span className="inline-block align-middle ml-1 mt-1">
                    {isLoading && (
                      <ThreeDots color="white" height={20} width={20} />
                    )}
                  </span>
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <NavLink
                to="/login"
                className="text-xs text-gray-500 uppercase hover:underline underline-offset-4"
              >
                or login
              </NavLink>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={20000}
        closeOnClick
        pauseOnHover
      />
      {showOverlay && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
          style={{ 
            WebkitBackdropFilter: 'blur(5px)',
            backdropFilter: 'blur(5px)'
          }}
        />
      )}
    </>
  );
};

export default Signup;
