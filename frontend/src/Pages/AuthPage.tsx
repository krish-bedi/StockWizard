import Navbar from "../components/Home/Navbar";
import Login from "../components/Home/Login";
import Signup from "../components/Home/Signup";
import ResetPassword from "../components/Home/PasswordReset";
const AuthPage = ({ mode }: any) => {
  return (
    <>
      <Navbar />
      {mode === "login" && <Login />}
      {mode === "signup" && <Signup />}
      {mode === "resetpassword" && <ResetPassword />}
    </>
  );
};

export default AuthPage;
