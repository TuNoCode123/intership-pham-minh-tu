class SqlCrud {
  insertItem = async (table, orderItem, connection) => {
    try {
      const insertField = Object.keys(orderItem).join(", ");
      const query = `INSERT INTO ${table} (${insertField}) VALUES (?, ?, ?, ?)`;
      const dependecies = [
        orderItem.product_id,
        orderItem.quantity,
        orderItem.price,
        orderItem.order_id,
      ];
      const [result] = await connection.query(query, dependecies);
      const { affectedRows, insertId } = result;
      if (affectedRows <= 0)
        throw new HttpError(500, `Insert INTO ${table} Failed`);
      return {
        ST: 200,
        EC: 0,
        EM: `Insert INTO ${table} SUCCESS`,
        DT: insertId,
      };
    } catch (error) {
      return {
        ST: error.status | 500,
        EC: 1,
        EM: error.message,
      };
    }
  };
}
export default new SqlCrud();
