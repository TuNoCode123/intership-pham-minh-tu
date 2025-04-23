import HttpError from "../interfaces/error.js";
import adminService from "../services/admin.service.js";

class UserManagementController {
  async getUser(req, res, next) {
    try {
      const response = await adminService.getUser();
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async lockUserbyId(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) throw new HttpError(404, "id missing");
      const response = await adminService.lockUser(id);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
export default new UserManagementController();
