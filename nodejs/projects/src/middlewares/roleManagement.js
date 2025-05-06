import pool from "../configs/configMysql.js";
import { AUTH } from "../interfaces/auth.js";
import HttpError from "../interfaces/error.js";

export const authorizeRole = (roles) => {
  return async (req, res, next) => {
    const user = req.user;
    console.log("-------------->", user);
    if (!user) {
      return res.status(401).json({ EC: 1, EM: "Not login" });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ EC: 1, EM: "unAuthorization" });
    }
    if (roles.includes(AUTH.USER)) {
      const { id } = user;
      if (!id) {
        return res.status(401).json({ EC: 1, EM: "PAYLOAD MUST INCLUDING ID" });
      }
      const isExistedUser = await pool.query("SELECT * FROM users where id=?", [
        +id,
      ]);
      const [[resultObject]] = isExistedUser;
      if (!resultObject) {
        next(new HttpError(404, "user not existed"));
      }
      const { revork } = resultObject;
      if (revork == 1) {
        next(new HttpError(403, "you banned"));
      } //check redis but there is not a redis db, so i will check into db
    }
    next();
  };
};
