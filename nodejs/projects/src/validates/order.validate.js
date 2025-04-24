import { z } from "zod";
import { getUserById } from "../models/user.model.js";
import { findProductById } from "../models/product.model.js";
import HttpError from "../interfaces/error.js";
import pool from "../configs/configMysql.js";

// Định nghĩa schema cho status
const orderStatusSchema = z.enum(["pending", "paid", "shipped", "cancelled"]);
// Định nghĩa schema cho Order Item
const orderItemSchema = z
  .object({
    id: z.number().int().positive().optional(), // id là Primary Key, phải là số nguyên dương
    order_id: z.number().int().positive().optional(), // order_id là Foreign Key, phải là số nguyên dương
    product_id: z
      .number()
      .int()
      .positive()
      .refine(
        async (id) => {
          const rs = await findProductById(id);
          if (rs.EC == 0) return true;
          return false;
        },
        {
          message: "product not found",
        }
      ), // product_id là Foreign Key, phải là số nguyên dương
    quantity: z.number().int().min(1), // quantity là số nguyên dương và tối thiểu 1
    price: z.number().positive().min(0), // price là số và không âm
  })
  .refine(
    async (val) => {
      const { product_id, quantity } = val;

      const [rows] = await pool.execute(
        `
          SELECT id,stock
          FROM products
          Where id = ? AND stock < ?
        `,
        [product_id, quantity]
      );

      return rows.length === 0;
    },
    {
      message: "Not enough stock for the product.",
      path: ["quantity"],
    }
  );
// Định nghĩa schema cho Order
const orderSchema = z.object({
  id: z.number().int().positive().optional(), // id là Primary Key, phải là số nguyên dương
  user_id: z.number().int().positive(),
  total_price: z.number().min(0), // total_price là số, không âm
  status: orderStatusSchema, // status chỉ có thể là một trong những giá trị trong enum
  created_at: z.string().optional(),
  // .refine((val) => !isNaN(Date.parse(val)), {
  //   message:
  //     "created_at phải là một ngày hợp lệ và lớn hơn thời gian hiện tại",
  // }), // created_at phải là một chuỗi ngày hợp lệ (ISO string hoặc định dạng có thể chuyển thành Date)
  orderItems: z.array(orderItemSchema),
});
// && new Date(val) > new Date()
// Định nghĩa schema cho mảng các đối tượng
const orderArraySchema = z
  .array(orderSchema)
  .min(1)
  .max(5)
  .refine(
    (items) => {
      const errors = [];
      if (items.length === 0) return true;
      const firstUserId = items[0].user_id;
      if (!items.every((user) => user.user_id === firstUserId)) {
        errors.push("Tất cả userId phải giống nhau");
      }
      for (let item of items) {
        const { total_price } = item;
        let sumPrices = 0;
        for (let prices of item.orderItems) {
          const { price } = prices;
          sumPrices += price;
        }
        if (total_price != sumPrices) {
          errors.push("Tổng giá trị của orderItems không đúng với total_price");
          break;
        }
      }
      // Nếu có lỗi, trả về false
      if (errors.length > 0) {
        throw new HttpError(400, errors.join(", "));
      }
      return true;
      //   return users.every((user) => user.user_id === firstUserId);
    },
    {
      message: "Có lỗi trong dữ liệu",
    }
  );

// Định nghĩa schema cho mảng các đối tượng

export { orderArraySchema };
