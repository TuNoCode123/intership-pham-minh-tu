import express from "express";
import userManagementController from "../controllers/userManagement.controller.js";
import { authorizeRole } from "../middlewares/roleManagement.js";
const routerAdmin = express.Router();
routerAdmin.use(authorizeRole("admin"));
// Định nghĩa các route
routerAdmin.get("/users", userManagementController.getUser);
routerAdmin.patch("/users/:id/lock", userManagementController.lockUserbyId);

export default routerAdmin;
