import fs from "fs";
import express from "express";
import path from "path";
import myData from "./data.js";
import clientRouter from "./routes/clientRoute.js";
import adminRouter from "./routes/adminRoute.js";
import authRouter from "./routes/authRoute.js";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 400,
  message: { status: 429, message: "Too many requests" },
});

const app = express();
var port = process.env.PORT || 3000;
var words = Object.keys(myData);

app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public')))
app.use(limiter);

app.use("/admin/api", adminRouter);
app.use("/api", clientRouter);
app.use("/", authRouter);

app.get("/download/all/words", (req, res) => {
  res.send(words.join(","));
});
app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});
app.get("/script.js", (req, res) => {
  res.sendFile("public/script.js", { root: __dirname });
});
app.get("/image.png", (req, res) => {
  res.sendFile("public/image.png", { root: __dirname });
});

app.listen(port, () => {
  console.log("api started on port " + port);
});
