import productService from "../services/product.service.js";

class ProductController {
  async addProduct(req, res, next) {
    try {
      const response = await productService.addProduct(req.data);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async findProducts(req, res, next) {
    try {
      const response = await productService.findProducts(req.data);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async deleteProductbyId(req, res, next) {
    try {
      const { id } = req.data;
      const response = await productService.deleteProductById(id);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async correctProduct(req, res, next) {
    try {
      const response = await productService.correctProduct(req.data);
      const { ST, ...restResultFromService } = response;
      return res.status(ST).json(restResultFromService);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
export default new ProductController();
