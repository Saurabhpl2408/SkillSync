import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

async function startServer() {
  await connectDB();

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SkillSync API is running" });
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();