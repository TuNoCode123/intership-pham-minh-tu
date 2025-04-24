import orderService from "../services/order.service.js";

class OrderController {
  async createBulkOrders(req, res, next) {
    try {
      const response = await orderService.addOrder(req.data);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async getOrdersOfUser(req, res, next) {
    try {
      //   console.log(req.data);
      const response = await orderService.getOrdersOfUser(req.data);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async getAllOrders(req, res, next) {
    try {
      const response = await orderService.getAllOrders(req.query);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async updateStatus(req, res, next) {
    try {
      const response = await orderService.updateStateOrder(req.data);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
export default new OrderController();
