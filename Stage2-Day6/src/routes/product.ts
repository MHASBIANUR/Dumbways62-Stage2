import { Router } from "express";
import { upload } from "../utils/multer";
import { prisma } from "../prisma/client";

const router = Router();

// Endpoint upload gambar produk
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const { name, price, supplierId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "File tidak ditemukan" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        supplierId: parseInt(supplierId),
        image: req.file.filename
      },
    });

    res.json({
      message: "Produk berhasil ditambahkan",
      product,
      file: req.file.filename,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
