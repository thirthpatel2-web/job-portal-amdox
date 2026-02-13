import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const location = useLocation();

  const isLanding = location.pathname === "/";
  const user = auth;

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300
        ${
          isLanding
            ? "bg-white/10 border-white/20"
            : "bg-white/80 border-gray-200 shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {}
        <Link
          to="/"
          className={`text-2xl font-bold tracking-tight ${
            isLanding ? "text-white drop-shadow-md" : "text-indigo-600"
          }`}
        >
          JobSphere
        </Link>

        {}
        <div className="flex items-center gap-6 text-sm font-medium">

          {}
          {!user && (
            <>
              <Link
                to="/login"
                className={`transition ${
                  isLanding
                    ? "text-white hover:text-yellow-300"
                    : "text-gray-700 hover:text-indigo-600"
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Get Started
              </Link>
            </>
          )}

          {}
          {user?.role === "employer" && (
            <>
              <Link
                to="/employer/dashboard"
                className="text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>

              <Link
                to="/employer/post-job"
                className="text-gray-700 hover:text-indigo-600"
              >
                Post Job
              </Link>

              <Link
                to="/employer/applications"
                className="text-gray-700 hover:text-indigo-600"
              >
                Applications
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

          {}
          {user?.role === "jobseeker" && (
            <>
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600"
              >
                Browse Jobs
              </Link>

              <Link
                to="/jobseeker/dashboard"
                className="text-gray-700 hover:text-indigo-600"
              >
                Dashboard
              </Link>

              <Link
                to="/profile/jobseeker"
                className="text-gray-700 hover:text-indigo-600"
              >
                My Profile
              </Link>

              <Link
                to="/jobseeker/resume"
                className="text-gray-700 hover:text-indigo-600"
              >
                My Resume
              </Link>

              <Link
                to="/saved-jobs"
                className="text-gray-700 hover:text-indigo-600"
              >
                Saved Jobs
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
