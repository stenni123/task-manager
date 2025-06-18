import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { FaSignInAlt, FaSignOutAlt, FaUser, FaTasks } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="logo">
          <Link
            to={user ? (user.role === "admin" ? "/admin" : "/") : "/login"}
            className="text-2xl font-bold text-gray-800 flex items-center"
          >
            <FaTasks className="mr-2 text-blue-600" /> TaskFlow
          </Link>
        </div>
        <nav>
          <ul className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === "admin" && (
                  <li>
                    <Link
                      to="/admin"
                      className="text-gray-600 hover:text-blue-600 font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {user.role === "employee" && (
                  <li>
                    <Link
                      to="/"
                      className="text-gray-600 hover:text-blue-600 font-medium"
                    >
                      My Tasks
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={onLogout}
                    className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="flex items-center text-gray-600 hover:text-blue-600 font-medium"
                >
                  <FaSignInAlt className="mr-2" /> Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
