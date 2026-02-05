import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connection.js";
import usersRouter from "./routes/users.js";
import availabilityRouter from "./routes/availability.js";
import projectsRouter from "./routes/projects.js";
import requestsRouter from "./routes/requests.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/requests", requestsRouter);

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