
import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Simulated user — securely hashed password
const USERS = [
  {
    userId: "Admin", // ✅ simple username, no email
    passwordHash: await bcrypt.hash("Rangwala", 10),
  },
];

// POST /api/login
app.post("/api/login", async (req, res) => {
  const { userId, password } = req.body; // ✅ changed
  const user = USERS.find((u) => u.userId === userId);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Auth API running on http://localhost:${PORT}`));
