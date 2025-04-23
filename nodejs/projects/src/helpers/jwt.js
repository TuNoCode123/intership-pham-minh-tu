import jwt from "jsonwebtoken";
import { AUTH } from "../interfaces/auth.js";
const signToken = (payload, expire) => {
  try {
    const privateKey = process.env.PRIVATE_KEY_JWT ?? "";
    const token = jwt.sign(
      payload, // payload (dữ liệu bên trong token)
      privateKey, // khóa bí mật để ký token
      { expiresIn: expire } // token sẽ hết hạn sau 1 tiếng
    );
    return token;
  } catch (error) {}
};
const verifyToken = (token) => {
  try {
    const privateKey = process.env.PRIVATE_KEY_JWT ?? "";
    var decoded = jwt.verify(token, privateKey);
    return {
      EC: 0,
      decoded,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.TokenExpiredError) {
      return {
        EC: 1,
        EM: AUTH.TOKEN_EXPIRE,
      };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return {
        EC: 1,
        EM: error.message,
      };
    }
    return {
      EC: 1,
      EM: "OTHER ERROR",
    };
  }
};
export { signToken, verifyToken };
