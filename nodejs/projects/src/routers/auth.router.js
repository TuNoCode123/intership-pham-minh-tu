import express from "express";
import authController from "../controllers/auth.controller.js";
import { authorizeRole } from "../middlewares/roleManagement.js";
import validateRequest from "../middlewares/validateMiddleware.js";
import { loginSchema, userSchema } from "../validates/auth.validate.js";
const routerAuth = express.Router();

// Định nghĩa các route
routerAuth.post("/login", validateRequest(loginSchema), authController.login);

routerAuth.post(
  "/register",
  validateRequest(userSchema),
  authController.register
);

export default routerAuth;
