import express from "express";
import belanjaRoutes from "./routes/belanja-routes";
import orderRoutes from "./routes/order-routes";

const app = express();
const PORT = 3000;

// Middleware untuk parsing JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/", belanjaRoutes);
app.use("/api/v1/orders", orderRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log("Server running on");
});
