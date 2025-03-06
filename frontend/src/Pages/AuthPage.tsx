import Navbar from "../components/Home/Navbar";
import Login from "../components/Home/Login";
import Signup from "../components/Home/Signup";
import ResetPassword from "../components/Home/PasswordReset";
import { useParams } from "react-router-dom";

const AuthPage = ({ mode }: any) => {
  const { token } = useParams();
  const isVerifying = mode === "login" && token;

  return (
    <>
      {!isVerifying && <Navbar />}
      {mode === "login" && <Login />}
      {mode === "signup" && <Signup />}
      {mode === "resetpassword" && <ResetPassword />}
    </>
  );
};

export default AuthPage;
