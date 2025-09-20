import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const isAdmin = payload.is_superuser || payload.is_staff;

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
        {/* Left: Branding / Links */}
        <div className="flex space-x-6 items-center">
          <Link to="/" className="text-xl font-bold text-yellow-400">
            🍬 SweetShop
          </Link>

          {token && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-yellow-400 transition-colors"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex space-x-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-1 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 px-4 py-1 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 px-4 py-1 rounded-lg hover:bg-green-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Where child routes render */}
      <div className="p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}
