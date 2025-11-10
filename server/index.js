import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();

// ✅ Allow CORS safely (replace with your deployed frontend domain later)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://your-render-frontend-url.onrender.com", // your Render app URL
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ✅ Simple async wrapper for bcrypt setup
const USERS = [];

(async () => {
  USERS.push({
    userId: "Admin", // ✅ username
    passwordHash: await bcrypt.hash("Rangwala", 10),
  });
})();

// ✅ Health check (Render pings this automatically)
app.get("/", (req, res) => {
  res.json({ status: "Server running ✅" });
});

// ✅ Login route
app.post("/api/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = USERS.find((u) => u.userId === userId);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({ success: true, userId });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ✅ Dynamic port (important for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Auth API running on port ${PORT}`);
});
