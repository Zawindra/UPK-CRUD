import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoutes from "./routes/testRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

process.env.TZ = "Asia/Jakarta";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);
app.use("/api/transactions", transactionRoutes);;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(5000, () =>
  console.log("🚀 Server running on http://localhost:5000")
);