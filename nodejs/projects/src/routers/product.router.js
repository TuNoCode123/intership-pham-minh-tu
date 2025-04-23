import express from "express";
import validateRequest from "../middlewares/validateMiddleware.js";
import productController from "../controllers/product.controller.js";
import { productSchema } from "../validates/product.validate.js";
import { authorizeRole } from "../middlewares/roleManagement.js";
import { productQuerySchema } from "../validates/queryInput.validate.js";
const routerProduct = express.Router();

// Định nghĩa các route
routerProduct.post(
  "/admin/products",
  authorizeRole("admin"),
  validateRequest(productSchema),
  productController.addProduct
);

routerProduct.get(
  "/products",
  validateRequest(productQuerySchema),
  productController.findProducts
);

export default routerProduct;
