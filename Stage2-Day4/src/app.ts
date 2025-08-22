import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";
import postRouter from "./routes/post";
import transferPoints from "./routes/transfer-points";
import supplierRouter from "./routes/supplier";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== Custom Error Class ==========
class AppError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
  }
}

// ========== Routes ==========
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1", transferPoints);
app.use("/api/v1/suppliers", supplierRouter);

// (Opsional) route untuk test error
// app.get("/error-test", () => { throw new AppError("Contoh error custom", 400); });

// middleware Global Error Handler 
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error detail:", err);

  const status = err instanceof AppError ? err.status : 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ success: false, message });
});

// Server 
const PORT = process.env.PORT || 8081; 
app.listen(PORT, () => { console.log(PORT); 
    console.log("server is running"); 
});