import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom";
import "../styles/404.css";
import { useSelector } from "react-redux";

interface ErrorType {
  statusText?: string;
  message?: string;
}

const NotFoundPage = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const error = useRouteError() as ErrorType;

  return (
    <>
      <section className="flex items-center h-[92vh] p-[11rem] dark:bg-gray-700">
        <div className="container flex flex-col items-center ">
          <div className="flex flex-col gap-6 max-w-md text-center">
            <div>
              <div className="cat ml-8">
                <div className="ear ear--left"></div>
                <div className="ear ear--right"></div>
                <div className="face">
                  <div className="eye eye--left">
                    <div className="eye-pupil"></div>
                  </div>
                  <div className="eye eye--right">
                    <div className="eye-pupil"></div>
                  </div>
                  <div className="muzzle"></div>
                </div>
              </div>
            </div>
            <h2 className="font-extrabold text-9xl text-white">
              <span className="sr-only">Error</span>404
            </h2>
            <p className="text-2xl md:text-3xl dark:text-gray-300">
              <i>{error ? error.statusText || error.message : ""}</i>
            </p>
            <Link
              to={userInfo ? "/app" : "/"}
              className="btn text-white bg-neutral-900 hover:bg-hover"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
