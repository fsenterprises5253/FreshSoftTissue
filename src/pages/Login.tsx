import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(""); // ✅ changed from email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Call your backend API for authentication
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }), // ✅ send userId instead of email
      });

      if (response.ok) {
        sessionStorage.setItem("auth", "true"); // ✅ auto-clears on browser close
        navigate("/");
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
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
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>

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
