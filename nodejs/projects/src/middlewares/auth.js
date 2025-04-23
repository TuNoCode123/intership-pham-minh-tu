import { verifyToken } from "../helpers/jwt.js";
import { AUTH } from "../interfaces/auth.js";

const getTargetUrl = (inputUrl) => {
  const url = inputUrl.split("/").slice(1);

  const [item] = url.slice(2);

  return item;
};

const authMiddleware = (req, res, next) => {
  try {
    const targetUrl = getTargetUrl(req.path);

    if (
      targetUrl == AUTH.REGISTER ||
      targetUrl == AUTH.LOGIN ||
      targetUrl == AUTH.PRODUCT
    ) {
      return next();
    }

    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return res.status(401).json({
        EC: 1,
        EM: "Unauthorized",
      });
    }
    const seperateToken = bearerToken.split(" ");
    const token = seperateToken.length > 0 ? seperateToken[1] : "";
    const checkVerify = verifyToken(token);

    if (checkVerify.EC == 1) {
      if (checkVerify.EM == AUTH.TOKEN_EXPIRE) {
        return res.status(401).json({ ...checkVerify });
      } else {
        return res.status(401).json({ ...checkVerify });
      }
    } else {
      req.user = checkVerify.decoded;
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
export default authMiddleware;
