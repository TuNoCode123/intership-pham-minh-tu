import authMiddleware from "../middlewares/auth";
import { errorHandler, notFound } from "../middlewares/errorHandler";
import routerTest from "./testRouter";

const Router = (app) => {
  //check auth
  app.use(authMiddleware);
  app.use("/api/v1", routerTest);
  // Route với lỗi 404
  app.use(notFound);
  //router lỗi chung
  app.use(errorHandler);
};
export default Router;
