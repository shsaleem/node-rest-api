import express from "express";
const router = express.Router();

import {
  getAllUsers,
  userSignUp,
  verifyEmail,
  userLogIn,
  userDelete,
  forgotPasswrod,
  resetPasswrod,
} from "../controllers/user.js";

import checkAuth from "../middleware/checkAuth.js";

router.get("/", getAllUsers);

router.post("/signup", userSignUp);

router.post("/verify-email", verifyEmail);

router.post("/login", userLogIn);

router.delete("/:userId", userDelete);

router.post("/forgot-password", forgotPasswrod);

router.put("/reset-password", resetPasswrod);

export default router;
