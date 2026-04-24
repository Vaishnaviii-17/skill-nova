import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// 🔥 Sync DB
sequelize.sync().then(() => {
  console.log("PostgreSQL Connected");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});