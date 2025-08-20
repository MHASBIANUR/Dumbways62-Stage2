import express from "express";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";

const app = express();

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

app.listen(process.env.PORT, ()=> {
    console.log("server is running");
});

