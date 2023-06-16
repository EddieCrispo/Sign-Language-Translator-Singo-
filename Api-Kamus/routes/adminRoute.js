import express from "express";
import {
  getQueries,
  downloadJson,
  remove,
  workWithWord,
} from "../controller/admin.js";
import { adminDetails } from "../data.js";
import { adminToken } from "../controller/auth.js";

export const verifyAdmin = (req, res, next) => {
  if (adminDetails.loggedIn == false) {
    return res
      .status(403)
      .json({ message: "login as admin to access this route" });
  }
  if (req.query.token !== adminToken) {
    return res.status(401).json({ message: "Provide a valod admin token" });
  }
  if (req.query.token == adminToken && adminDetails.loggedIn == true) {
    next();
  }
};

const adminRouter = express.Router();
adminRouter.use(verifyAdmin);

adminRouter.get("/queries", getQueries);
adminRouter.get("/downloadJson", downloadJson);
adminRouter.delete("/remove", remove);
adminRouter.post("/word_work", workWithWord);

export default adminRouter;
