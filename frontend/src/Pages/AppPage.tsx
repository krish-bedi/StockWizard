import { useEffect } from "react";
import AppNavbar from "../components/App/AppNavbar";
import { toast } from "react-toastify";

const AppPage = () => {
  // Close all initial toast notifications
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <>
      <AppNavbar />
    </>
  );
};

export default AppPage;
