import pool from "../configs/configMysql.js";
import HttpError from "../interfaces/error.js";

class AdminService {
  async getUser() {
    try {
      const [rows] = await pool.query(
        "SELECT id, name, email, role FROM users"
      );
      const listUsers = Array.isArray(rows) ? rows : [];
      return {
        ST: 200,
        EC: 0,
        EM: "get all users  SUCCESS",
        DT: listUsers,
      };
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  }
  async lockUser(id) {
    try {
      //check user existed
      const isExistedUser = await pool.query("SELECT * FROM users where id=?", [
        +id,
      ]);
      const [[resultObject]] = isExistedUser;
      if (!resultObject) throw new HttpError(404, "user not existed");
      const { revork } = resultObject;
      const query = "UPDATE users SET revork = ? WHERE id = ?";
      const revorkState = revork == 1 ? false : true;
      const depend = [revorkState, +id];
      await pool.execute(query, depend);
      return {
        ST: 200,
        EC: 0,
        EM: `${revorkState ? "lock" : "unlock"} user having id=${id} SUCCESS`,
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
export default new AdminService();
