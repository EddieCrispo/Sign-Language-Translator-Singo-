import express from "express";
import {
  adminToken,
  loginAdmin,
  securityQ,
  authAdmin,
  securityPage,
  secureAdmin,
  adminPage,
  logoutAdmin,
  forgotPass,
  passwordReset,
  changePass,
  getCredentials,
} from "../controller/auth.js";
import { verifyAdmin } from "./adminRoute.js";

const authRouter = express.Router();

authRouter.get("/YWRtaW4uanMuc2NyaXB0.js", verifyAdmin, (req, res) => {
  res.sendFile("public/admin/admin.js", { root: "./" });
});
authRouter.get(
  "/c4031095857118d11646ae256ac52ae1",
  verifyAdmin,
  getCredentials
);
authRouter.post("/change", verifyAdmin, changePass);
//publically exposed admin routes
authRouter.get("/admin", adminPage);
authRouter.route("/login").get(loginAdmin).post(authAdmin);
authRouter.get("/security-questions", securityQ);
authRouter.route("/security").get(securityPage).post(secureAdmin);
authRouter.route("/admin-forgot-password").get(forgotPass).post(passwordReset);
authRouter.get("/logout", logoutAdmin);

export default authRouter;
