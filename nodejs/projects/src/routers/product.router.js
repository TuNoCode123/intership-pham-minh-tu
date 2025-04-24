import express from "express";
import validateRequest from "../middlewares/validateMiddleware.js";
import productController from "../controllers/product.controller.js";
import {
  correctProductSchema,
  productSchema,
} from "../validates/product.validate.js";
import { authorizeRole } from "../middlewares/roleManagement.js";
import {
  idSchema,
  productQuerySchema,
} from "../validates/queryInput.validate.js";
import { AUTH } from "../interfaces/auth.js";
const routerProduct = express.Router();

// Định nghĩa các route
routerProduct.post(
  "/admin/products",
  authorizeRole(AUTH.ADMIN),
  validateRequest(productSchema),
  productController.addProduct
);

routerProduct.get(
  "/products",
  validateRequest(productQuerySchema),
  productController.findProducts
);

routerProduct.delete(
  "/admin/products/:id",
  authorizeRole(AUTH.ADMIN),
  validateRequest(idSchema),
  productController.deleteProductbyId
);

routerProduct.put(
  "/admin/products/:id",
  authorizeRole(AUTH.ADMIN),
  validateRequest(correctProductSchema),
  productController.correctProduct
);

export default routerProduct;
