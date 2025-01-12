import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RiStockLine } from "react-icons/ri";
import { useLogoutMutation } from "../../redux/slices/usersApiSlice";
import { clearCredentials } from "../../redux/slices/authSlice";
import { FaUser } from "react-icons/fa";
import { useSearchStocksQuery } from '../../redux/slices/appSlice';

const AppNavbar = () => {

  // Handle authentication
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

  // Handle stock search
  const [searchTerm, setSearchTerm] = useState("");         // Immediate input value
  const [isFocused, setIsFocused] = useState(false);        // Boolean to show/hide suggestions
  const [debouncedTerm, setDebouncedTerm] = useState("");   // Debounced input value

  // Wait 100ms after user stops typing before updating debouncedTerm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 0); // turned off for demo
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Only make API call with debounced term
  const { data: suggestions } = useSearchStocksQuery(debouncedTerm, {
    skip: !debouncedTerm,  // Only skip if empty
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="navbar bg-black text-white border-b border-slate-700">
        <div className="flex-1 flex items-center gap-4">
          <NavLink
            to="/app"
            className="logo-btn text-white ml-20 btn btn-ghost text-xl"
          >
            <RiStockLine /> StockWizard
          </NavLink>
          <div className="relative w-[20%] ml-[8%]">
            <label className="input input-bordered flex items-center gap-2 w-[100%] bg-neutral-900">
              <input
                type="text"
                className="grow"
                placeholder="Search ticker or company"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  // Small delay to allow clicking on suggestions
                  setTimeout(() => {
                    setIsFocused(false)
                  }, 100)
                }}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="white"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
            {searchTerm && suggestions && isFocused && (
              <ul className="absolute w-full mt-1 bg-neutral-900 rounded-lg shadow-lg max-h-60 overflow-auto z-50
                scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-neutral-500 scrollbar-track-neutral-900">
                {suggestions.map((stock) => (
                  <li
                    key={stock.symbol}
                    className="px-4 py-2 hover:bg-neutral-800 cursor-pointer"
                    onClick={() => {
                      alert(stock.symbol);
                      setIsFocused(false);  // Hide suggestions after selection
                    }}
                  >
                    <span className="font-bold">{stock.symbol}</span> -{" "}
                    <span className="text-sm text-gray-300">{stock.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
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
                          src={userInfo.imageUrl}
                          className="rounded-full size-10 outline-2 outline-white"
                          onError={(e) => {
                            e.currentTarget.src =
                              "../../../public/default-pfp.jpg";
                          }}
                          referrerPolicy="no-referrer" // Add this to handle Google image security
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
