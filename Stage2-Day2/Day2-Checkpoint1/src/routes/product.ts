import express from "express";
import {getProducts, createProducts, getProduct, updateProduct, deleteProduct} from "../controllers/product";

const router = express.Router();

router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.post("/product", createProducts);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);


export default router;