import express from "express";
import router from "./routes/auth";
import supplierRouter from "./routes/supplier";

const app = express();

app.use(express.json());

app.use("/auth", router);
app.use("/supplier", supplierRouter);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
