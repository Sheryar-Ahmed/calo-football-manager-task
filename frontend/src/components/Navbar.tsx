import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "text-white border-b-2 border-white"
      : "text-gray-200 hover:text-white";

  return (
    <nav className="backdrop-blur-sm bg-green-600 shadow-md text-white px-6 py-3 flex items-center justify-between rounded-b-2xl">
      {/* Left: Logo + Links */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          {/* <img src="/football.png" className="w-6 h-6" alt="logo" /> */}
          FantasyX
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/dashboard" className={isActive("/dashboard")}>
            Dashboard
          </Link>
          <Link to="/market" className={isActive("/market")}>
            Market
          </Link>
        </div>
      </div>

      {/* Right: Logout */}
      <button
        onClick={handleLogout}
        className="px-4 py-1.5 rounded-md bg-white text-[#3cad68] font-semibold hover:bg-gray-100 transition-all"
      >
        Logout
      </button>
    </nav>

  );
}
