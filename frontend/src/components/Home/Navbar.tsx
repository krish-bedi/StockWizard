import { RiStockLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <div className="navbar bg-black h-8v border-b border-slate-700">
        <div className="navbar-start">
          <NavLink
            to="/"
            className="logo-btn text-white ml-20 btn btn-ghost text-xl hover:..."
          >
            <RiStockLine /> StockWizard
          </NavLink>
        </div>
        <div className="navbar-start mr-[25vw] hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary btn btn-ghost font-bold tracking-wider text-base"
                    : "text-white btn btn-ghost text-base"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-primary btn btn-ghost font-bold text-base"
                    : "text-white btn btn-ghost text-base"
                }
              >
                About
              </NavLink>
            </li>
            {/*
            <li className="text-white">
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
            */}
            <li>
              <a className="text-white btn btn-ghost text-base">Item 3</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end mr-[11vw]">
          <NavLink
            to="/signup"
            className="text-white mr-3 btn bg-primary hover:bg-primary-darker"
          >
            SIGN UP
          </NavLink>
          <NavLink
            to="/login"
            className="text-white btn mr-10 bg-secondary hover:bg-secondary-darker"
          >
            LOG IN
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;
