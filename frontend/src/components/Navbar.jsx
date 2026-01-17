import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
<nav className="bg-white/70 backdrop-blur-lg border-b border-white/40 
                px-6 py-4 flex justify-between items-center 
                sticky top-0 z-50">
      <h1 className="text-xl font-bold text-blue-600">
        JobPortal
      </h1>

      <div className="space-x-4">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Jobs
        </Link>

        {!user && (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
            >
              Register
            </Link>
          </>
        )}

        {user && user.role === "employer" && (
          <Link
            to="/employer"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>
        )}
        {user && user.role === "jobseeker" && (
  <Link
    to="/seeker"
    className="text-gray-700 hover:text-blue-600 font-medium"
  >
    My Applications
  </Link>
)}


        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
