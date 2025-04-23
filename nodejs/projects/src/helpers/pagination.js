import pool from "../configs/configMysql.js";

const pagination = async (offset, limit, table, orderBy, name, category) => {
  try {
    let res;
    if (name && !category) {
      console.log("fdsfkhdsakfhdksahf");
      const sql = `SELECT * 
                   FROM ??
                   WHERE name LIKE ?
                   ORDER BY ??
                   LIMIT ? OFFSET ?`;
      const formattedSql = pool.format(sql, [
        table,
        `%${name}%`,
        orderBy,
        limit,
        offset,
      ]);
      res = await pool.query(formattedSql);
    } else if (category && !name) {
      const sql = `SELECT id,category,price 
  FROM ?? 
  GROUP BY id,category,price
  HAVING category LIKE ? 
  ORDER BY ?? 
  LIMIT ? OFFSET ?`;
      const formattedSql = pool.format(sql, [
        table,
        category,
        orderBy,
        limit,
        offset,
      ]);
      res = await pool.query(formattedSql);
    } else if (name && category) {
      const sql = `SELECT * 
  FROM ?? 
  WHERE name LIKE ? 
  GROUP BY  category
  Having category like ?
  ORDER BY ?? 
  LIMIT ? OFFSET ?`;
      const formattedSql = pool.format(sql, [
        table,
        name,
        category,
        orderBy,
        limit,
        offset,
      ]);
      res = await pool.query(formattedSql);
    } else {
      const sql = `SELECT * FROM ?? ORDER BY ?? LIMIT ? OFFSET ?`;
      const formattedSql = pool.format(sql, [table, orderBy, limit, offset]);
      res = await pool.query(formattedSql);
    }
    // // console.log(offset, limit, table, orderBy);
    // console.log([table, orderBy, limit, offset]);

    console.log(res);
    return {
      EC: 0,
      EM: "GET SUCCESS",
      DATA: res[0],
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: error.message,
    };
  }
};
export default pagination;
