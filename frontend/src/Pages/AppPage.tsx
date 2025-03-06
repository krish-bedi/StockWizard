import { useEffect } from "react";
import AppNavbar from "../components/App/AppNavbar";
import { toast } from "react-toastify";

const AppPage = () => {
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
