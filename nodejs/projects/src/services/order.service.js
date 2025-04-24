import pool from "../configs/configMysql.js";
import sqlCrud from "../helpers/sqlCrud.js";
import HttpError from "../interfaces/error.js";
import { insertOrder } from "../models/order.model.js";
import { getUserById } from "../models/user.model.js";
import "dotenv/config";
class OrderService {
  async addOrder(orders) {
    const connection = await pool.getConnection();
    try {
      let orderIdArr = [];
      const userId = orders[0].user_id;
      const checkUser = await getUserById(userId);
      if (checkUser.EC == 1) throw new HttpError(checkUser.ST, checkUser.EM);
      await connection.beginTransaction();

      for (let item of orders) {
        const { orderItems, ...order } = item;
        const rsOfInsertOrder = await insertOrder(order, connection);
        const { EC, ST, EM, DT: orderId } = rsOfInsertOrder;
        orderIdArr.push(orderId);
        if (EC == 1) throw new HttpError(ST, EM);
        for (let item of orderItems) {
          const temp = {
            ...item,
            order_id: orderId,
          };
          const rsOfInsertOrderItem = await sqlCrud.insertItem(
            "order_items",
            temp,
            connection
          );

          const {
            EC: ECOfInsertOrderItem,
            ST: STOfInsertOrderItem,
            EM: EMOfInsertOrderItem,
          } = rsOfInsertOrderItem;
          if (ECOfInsertOrderItem == 1) {
            throw new HttpError(STOfInsertOrderItem, EMOfInsertOrderItem);
          }
          const { product_id, quantity } = item;

          //reduce stock
        }
        // reduce stock
      }

      const promiseReductStock = orderIdArr.map(async (id) => {
        const query = `
        UPDATE products
        JOIN order_items oi ON products.id = oi.product_id
        SET products.stock = products.stock - oi.quantity
        WHERE oi.order_id = ? AND products.stock >= oi.quantity;
      `;
        await connection.execute(query, [id]);
      });
      await Promise.all(promiseReductStock);
      await connection.commit();
      return {
        ST: 200,
        EC: 0,
        EM: "Insert Order SUCCESS",
      };
    } catch (error) {
      await connection.rollback();
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    } finally {
      connection.release();
    }
  }
  async getOrdersOfUser({ id }) {
    try {
      const query = `SELECT * FROM orders LEFT JOIN order_items oi 
        ON orders.id = oi.order_id WHERE orders.user_id = ?`;
      const dependecies = [id];
      const [rs] = await pool.execute(query, dependecies);
      return {
        ST: 200,
        EC: 0,
        EM: "GET SUCCESS",
        DT: rs,
      };
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
  async getAllOrders({ limit, page }) {
    try {
      const limitLocal = limit ? +limit : +process.env.LIMIT;
      const offsetLocal = page ? +page : +process.env.OFFSET;
      const realPage = offsetLocal - 1;
      const realOffset = realPage > 0 ? (offsetLocal - 1) * limitLocal : 0;
      const query = `SELECT * FROM orders LIMIT ? OFFSET ?`;
      const dependecies = [limitLocal, realOffset];
      console.log(limitLocal, realOffset);
      const [rs] = await pool.query(query, dependecies);
      return {
        ST: 200,
        EC: 0,
        EM: "GET SUCCESS",
        DT: rs,
      };
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
  async updateStateOrder({ id, status }) {
    try {
      const [checkOrderExisted] = await pool.query(
        "SELECT * FROM orders where id=?",
        [id]
      );
      if (checkOrderExisted.length <= 0)
        throw new HttpError(404, "order not existed");
      const orderTarget = checkOrderExisted[0];
      if (orderTarget.status == status)
        throw new HttpError(400, "State is Current");
      const query = `UPDATE orders SET status = ? WHERE id = ?`;
      const dependecies = [status, id];
      const [rs] = await pool.execute(query, dependecies);
      const { affectedRows } = rs;
      if (affectedRows === 0) throw new HttpError(500, "update failed");
      return {
        ST: 200,
        EC: 0,
        EM: "UPDATE SUCCESS",
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
export default new OrderService();
