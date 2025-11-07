import { useNavigate } from "react-router-dom";
import EzzyLogo from "@/assets/ezzy-logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <img
            src={EzzyLogo}
            alt="Ezzy Auto Parts Logo"
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-xl font-bold text-gray-900">Ezzy Auto Parts</h1>
        </div>

        <nav className="flex items-center space-x-6 text-gray-700 font-medium">
          <button
            onClick={handleLogout}
            className="hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
