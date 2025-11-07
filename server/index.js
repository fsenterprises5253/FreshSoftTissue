import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Simulated user — securely hashed password
const USERS = [
  {
    email: "admin@ezzyautoparts.com",
    passwordHash: await bcrypt.hash("SuperSecurePass123", 10),
  },
];

// POST /api/login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Auth API running on http://localhost:${PORT}`));
