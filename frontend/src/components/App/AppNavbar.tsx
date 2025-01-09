import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { RiStockLine } from "react-icons/ri";
import { useLogoutMutation } from "../../redux/slices/usersApiSlice";
import { clearCredentials } from "../../redux/slices/authSlice";
import { FaUser } from "react-icons/fa";

const AppNavbar = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(clearCredentials());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="navbar bg-black text-white border-b border-slate-700">
        <div className="flex-1">
          <NavLink
            to="/app"
            className="logo-btn text-white ml-20 btn btn-ghost text-xl hover:..."
          >
            <RiStockLine /> StockWizard
          </NavLink>
        </div>
        <label className="input input-bordered flex items-center gap-2">
          <input type="text" className="grow" placeholder="Search" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 items-center">
            <li className="h-full font-bold">
              <a>Link</a>
            </li>
            <li className="flex items-center">
              <details className="mr-20">
                <summary className="ml-2 hover:bg-transparent active:!bg-transparent">
                  <div className="w-full relative max-w-sm mx-auto h-auto ">
                    {userInfo ? (
                      userInfo.imageUrl ? (
                        <img
                          src={userInfo.imageUrl.slice(0, -2)}
                          className="rounded-full size-10 hover:"
                          onError={(e) => {
                            e.currentTarget.src =
                              "../../../public/default-pfp.jpg";
                          }}
                        />
                      ) : (
                        <div className="rounded-full size-10 flex items-center justify-center">
                          <FaUser className="text-xl" />
                        </div>
                      )
                    ) : null}
                    <div className="rounded-full absolute w-full h-full top-0 left-0 bg-white opacity-0 z-10 transition-opacity duration-150 hover:opacity-15"></div>
                  </div>
                </summary>

                <ul className="p-2 bg-neutral-900 rounded-t-none ml-[-10rem] !mt-[0.5rem]">
                  <li>
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                  <li>
                    <button onClick={logoutHandler}> Logout </button>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AppNavbar;
