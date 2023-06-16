import express from "express";
import cors from "cors";
import { findOne, findTwo, contact } from "../controller/client.js";

const clientRouter = express.Router();
clientRouter.use(cors());

clientRouter.get("/:word1/:word2", findTwo);
clientRouter.get("/:word", findOne);
clientRouter.post("/contact", contact);

export default clientRouter;
