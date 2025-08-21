import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product";
import orderRouter from "./routes/order";
import postRouter from "./routes/post";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/products", productRouter);

app.listen(process.env.PORT, ()=> {
    console.log(process.env.PORT);
    console.log("server is running");
});

