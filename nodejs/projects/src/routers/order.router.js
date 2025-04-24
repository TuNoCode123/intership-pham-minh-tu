import express from "express";
import orderController from "../controllers/order.controller.js";
import validateRequest from "../middlewares/validateMiddleware.js";
import { orderArraySchema } from "../validates/order.validate.js";
import { authorizeRole } from "../middlewares/roleManagement.js";
import { AUTH } from "../interfaces/auth.js";
import {
  idSchema,
  schemaUpdateState,
} from "../validates/queryInput.validate.js";
const routerOrder = express.Router();

// Định nghĩa các route
routerOrder.post(
  "/orders",
  authorizeRole(AUTH.USER),
  validateRequest(orderArraySchema),
  orderController.createBulkOrders
);

// Định nghĩa các route
routerOrder.get(
  "/orders",
  validateRequest(idSchema),
  orderController.getOrdersOfUser
);
// productQuerySchema
routerOrder.get(
  "/admin/orders",
  authorizeRole(AUTH.ADMIN),
  orderController.getAllOrders
);

// /admin/orders/:id/status:

routerOrder.patch(
  "/admin/orders/:id/status",
  authorizeRole(AUTH.ADMIN),
  validateRequest(schemaUpdateState),
  orderController.updateStatus
);

export default routerOrder;
