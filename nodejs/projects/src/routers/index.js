import authMiddleware from "../middlewares/auth.js";
import { errorHandler, notFound } from "../middlewares/errorHandler.js";
import routerAdmin from "./admin.router.js";
import routerAuth from "./auth.router.js";
import routerOrder from "./order.router.js";
import routerProduct from "./product.router.js";

import routerTest from "./testRouter.js";

const Router = (app) => {
  //check auth
  app.use(authMiddleware);
  app.use("/api/v1", routerTest);
  app.use("/api/v1", routerAuth);
  app.use("/api/v1/admin", routerAdmin);
  app.use("/api/v1", routerProduct);
  app.use("/api/v1", routerOrder);

  // Route với lỗi 404
  app.use(notFound);
  //router lỗi chung
  app.use(errorHandler);
};
export default Router;
