import { RiStockLine } from "react-icons/ri";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { updateField } from "../../redux/slices/formSlice";
import { useLoginMutation } from "../../redux/slices/usersApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { ThreeDots } from "react-loader-spinner";
import OAuth from "./OAuth";

const Login = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { token } = useParams();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/app");
    } else if (token) {
      autoLogin(token);
    }
  }, [navigate, userInfo, token]);

  const autoLogin = async (token: string) => {
    try {
      const res = await login({ token }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/app");
    } catch (err: any) {
      console.error("Invalid token");
    }
  };

  const formData = useAppSelector((state: any) => state.formData.data);

  const passwordRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
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
            <h2 className="text-2xl font-semibold text-primary text-center btn btn-ghost logo-btn ml-[21%]">
              <RiStockLine /> StockWizard
            </h2>
            <p className="text-xl text-gray-900 text-center">Welcome back!</p>
            <OAuth />
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
              </div>
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
                to="/signup"
                className="text-xs text-gray-900 uppercase hover:underline underline-offset-4"
              >
                or sign up
              </NavLink>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
