import express from "express";
import router from "./routes/product";

const app = express ();

app.use (express.json());

app.use("/api/v1", router);

app.listen(process.env.PORT, ()=> {
    console.log("server is running");
});