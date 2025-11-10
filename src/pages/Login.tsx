import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👁️ import icons for toggle

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 controls visibility
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://ezzy-auth-api.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      if (response.ok) {
        sessionStorage.setItem("auth", "true");
        navigate("/");
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sign In
        </h1>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <div className="space-y-4">
          {/* 🧩 User ID input */}
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          {/* 🔐 Password input with toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // 👈 toggle visibility
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 pr-10"
              required
            />
            {/* 👁️ Eye icon toggle button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* 🔘 Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-lg font-medium text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Login;
