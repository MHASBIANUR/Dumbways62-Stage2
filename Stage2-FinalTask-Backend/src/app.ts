import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import orderRoutes from "./routes/order"; 
import pointRoutes from "./routes/point";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/points", pointRoutes);

// Error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
