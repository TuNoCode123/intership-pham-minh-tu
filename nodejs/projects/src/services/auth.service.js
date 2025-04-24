import pool from "../configs/configMysql.js";
import { hashPassWord, comparePassword } from "../helpers/bcryptPass.js";
import { signToken } from "../helpers/jwt.js";
import HttpError from "../interfaces/error.js";
import { getUserByEmail, insertUser } from "../models/user.model.js";

class AuthService {
  async register({ email, password, name, role, ...rest }) {
    try {
      //check mail
      const rs = await getUserByEmail(email);
      if (rs.DT && rs.DT.length > 0) throw new HttpError(400, "email existed");
      const affectedRows = await insertUser({
        email,
        password,
        name,
        role,
        ...rest,
      });
      if (affectedRows.EC == 0) {
        const accessToken = signToken({ name, email, role }, "1h");
        return {
          ST: 200,
          EC: 0,
          EM: "REGISTER SUCCESS",
          DT: {
            accessToken,
          },
        };
      } else {
        throw new HttpError(500, "RESGISTER FAILED");
      }

      //check mail
      //   const isExistedEmail=
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
  async login({ email, password }) {
    try {
      const checkUserByEmail = await getUserByEmail(email);
      if (checkUserByEmail.DT.length <= 0)
        throw new HttpError(400, "email or password not correct");
      const [user] = checkUserByEmail.DT;
      const { password: Pass, name, role, revork, id, ...rest } = user;

      //check revork
      if (revork == true) throw new HttpError(403, "you banned");
      if (!Pass) throw new HttpError(400, "miss field in db");
      //check match pass
      const isMatch = await comparePassword(password, Pass);
      if (!isMatch) {
        throw new HttpError(400, "email or password not correct");
      }
      const accessToken = signToken({ name, email, role, id }, "1h");
      return {
        ST: 200,
        EC: 0,
        EM: "Login SUCCESS",
        DT: {
          user: { name, ...rest },
          accessToken,
        },
      };
      //check mail
      //   const isExistedEmail=
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
}
export default new AuthService();
