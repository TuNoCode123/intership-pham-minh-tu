import morgan from "morgan";
import express from "express";
const configApps = (app, logStream) => {
  app.use(morgan("combined", { stream: logStream }));
  //   app.use(morgan("tiny"));
  app.set("trust proxy", true); // Tin tưởng proxy để lấy header X-Forwarded-For
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // Middleware để parse URL-encoded data
};
export default configApps;
