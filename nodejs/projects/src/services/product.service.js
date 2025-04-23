import pagination from "../helpers/pagination.js";
import { addProductModal } from "../models/product.model.js";

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
  async findProducts({ limit, page, category, search }) {
    try {
      const offset = page > 0 ? (page + 1) * limit : 0;
      const res = await pagination(
        offset,
        limit,
        "products",
        "id",
        search,
        category
      );
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
}
export default new ProductService();
