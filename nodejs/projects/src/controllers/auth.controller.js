import authService from "../services/auth.service.js";
class AuthController {
  async register(req, res, next) {
    try {
      const response = await authService.register(req.data);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error("------>", error);
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const response = await authService.login(req.data);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error("------>", error);
      next(error);
    }
  }
}
export default new AuthController();
