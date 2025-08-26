import express, { Request, Response, NextFunction } from "express";
import path from "path";
import multer from "multer";
import authRouter from "./routes/auth";
import supplierRouter from "./routes/supplier";
import productRouter from "./routes/product";

const app = express();

// Middleware JSON
app.use(express.json());

// Static folder untuk akses file upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRouter);
app.use("/supplier", supplierRouter);
app.use("/product", productRouter);

// Error handler untuk Multer & lainnya
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // contoh: ukuran file terlalu besar
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Ukuran file terlalu besar (max 2MB)" });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    // error custom dari fileFilter
    return res.status(400).json({ error: err.message || "Terjadi kesalahan" });
  }

  next();
});

// Start server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
