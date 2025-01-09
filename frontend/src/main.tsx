import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import NotFoundPage from "./Pages/NotFoundPage";
import AuthPage from "./Pages/AuthPage";
import AppPage from "./Pages/AppPage";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => <AuthPage mode="signup" />;
const LoginPage = () => <AuthPage mode="login" />;
const ResetPasswordPage = () => <AuthPage mode="resetpassword" />;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/login/:token",
    element: <LoginPage />,
  },
  {
    path: "/resetpassword",
    element: <ResetPasswordPage />,
  },
  {
    path: "/resetpassword/:token",
    element: <ResetPasswordPage />,
  },
  {
    path: "/app",
    element: <AppPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        newestOnTop
        pauseOnFocusLoss
        closeOnClick
        theme="dark"
        transition={Bounce}
        className="mt-[8vh]"
      />
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
