import pagination from "../helpers/pagination.js";
import HttpError from "../interfaces/error.js";
import {
  addProductModal,
  deleteProductById,
  findProductById,
  updateProduct,
} from "../models/product.model.js";

class ProductService {
  async addProduct(product) {
    try {
      const rs = await addProductModal(product);
      return rs;
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
  async findProducts({ limit, page, search }) {
    try {
      const realPage = page - 1;
      const offset = realPage > 0 ? realPage * limit : 0;
      const res = await pagination(offset, limit, search);
      if (res.EC == 0) {
        return {
          ST: 200,
          ...res,
        };
      }
      return {
        ST: 400,
        ...res,
      };
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
  async deleteProductById(id) {
    try {
      if (!id) throw new HttpError(404, "missin input");
      const res = await deleteProductById(id);
      return res;
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
  async correctProduct({ id, ...restObject }) {
    try {
      const checkProduct = await findProductById(id);
      if (checkProduct.EC == 1)
        throw new HttpError(checkProduct.ST, checkProduct.EM);
      const res = await updateProduct({
        id,
        ...checkProduct.DT,
        ...restObject,
      });
      return res;
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
}
export default new ProductService();
