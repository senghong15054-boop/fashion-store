import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminRoutes);

app.use((error, _req, res, _next) => {
  if (error) {
    return res.status(400).json({ message: error.message || "Unexpected error" });
  }

  return res.status(500).json({ message: "Unknown server error" });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
