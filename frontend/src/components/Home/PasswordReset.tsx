import { RiStockLine } from "react-icons/ri";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  useResetPasswordMutation,
  useForgotPasswordUpdateMutation,
} from "../../redux/slices/usersApiSlice";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import PasswordChecklist from "react-password-checklist";
import { FaRegCircleCheck, FaCircleCheck } from "react-icons/fa6";
import OAuth from "./OAuth";

const ResetPassword = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const navigate = useNavigate();

  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [pwIsValid, setpwIsValid] = useState(false);

  const [resetPassword, { isLoading: isResetLoading }] =
    useResetPasswordMutation();
  const [forgotPasswordUpdate, { isLoading: isUpdateLoading }] =
    useForgotPasswordUpdateMutation();

  const emailRef = useRef<HTMLInputElement>(null);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    try {
      if (!token) {
        const email = emailRef.current?.value;
        const res = await resetPassword({ email }).unwrap();
        toast.success(res.message, { autoClose: 10000 });
      } else {
        if (pwIsValid) {
          const res = await forgotPasswordUpdate({ token, password }).unwrap();
          toast.success(res.message, { autoClose: 10000 });
          navigate("/login");
        } else {
          toast.error("Password requirements not met");
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error);
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
            <h2 className="text-2xl font-semibold text-primary text-center btn btn-ghost logo-btn ml-[16%]">
              <RiStockLine /> StockWizard
            </h2>
            <p className="text-xl text-gray-900 text-center">Reset Password</p>
            <OAuth />
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>

            {/* Login Form */}

            <form id="loginForm" onSubmit={submitHandler}>
              {!token && (
                <div className="mt-4">
                  <label className="block text-gray-900 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    className="bg-gray-200 text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                    type="email"
                    ref={emailRef}
                  />
                </div>
              )}
              {token && (
                <div className="mt-4">
                  <div className="flex justify-between">
                    <label className="block text-gray-900 text-sm font-bold mb-2">
                      Password
                    </label>
                  </div>
                  <input
                    className="bg-gray-200 text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="flex justify-between">
                    <label className="block text-gray-900 text-sm font-bold mb-2 mt-4">
                      Confirm password
                    </label>
                  </div>
                  <input
                    className="bg-gray-200 text-gray-900 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                    type="password"
                    onChange={(e) => setPasswordAgain(e.target.value)}
                  />
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
                      className="text-xs text-black font-bold"
                      rules={[
                        "minLength",
                        "capital",
                        "lowercase",
                        "number",
                        "specialChar",
                        "match",
                      ]}
                      minLength={8}
                      value={password}
                      valueAgain={passwordAgain}
                      onChange={(isValid) => {
                        setpwIsValid(isValid);
                      }}
                      messages={{
                        capital: "Contains Uppercase",
                        lowercase: "Contains Lowercase",
                        specialChar: "Contains Special Character",
                        number: "Contains Number",
                        minLength: "At least 8 characters",
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-8">
                <button
                  type="submit"
                  className={`bg-gray-800 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-900 flex items-center justify-center ${
                    isResetLoading || isUpdateLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isResetLoading || isUpdateLoading}
                >
                  {token ? "Reset Password" : "Send Password Reset Link"}
                  <span className="inline-block align-middle ml-1 mt-1">
                    {isResetLoading ||
                      (isUpdateLoading && (
                        <ThreeDots color="white" height={20} width={20} />
                      ))}
                  </span>
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <NavLink
                to="/login"
                className="text-xs text-gray-900 uppercase hover:underline underline-offset-4"
              >
                or login
              </NavLink>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
