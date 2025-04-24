import pool from "../configs/configMysql.js";

const pagination = async (offset, limit, searchQuery) => {
  try {
    let res;
    // if (name && !category) {
    //   const sql = `SELECT *
    //                FROM ??
    //                WHERE name LIKE ?
    //                ORDER BY ??
    //                LIMIT ? OFFSET ?`;
    //   const formattedSql = pool.format(sql, [
    //     table,
    //     `%${name}%`,
    //     orderBy,
    //     limit,
    //     offset,
    //   ]);
    //   res = await pool.query(formattedSql);
    // } else if (category && !name) {
    //   const sql = `SELECT *
    //                FROM ??
    //                where category LIKE ?
    //                ORDER BY ??
    //                LIMIT ? OFFSET ?`;
    //   const formattedSql = pool.format(sql, [
    //     table,
    //     `%${category}%`,
    //     orderBy,
    //     limit,
    //     offset,
    //   ]);
    //   res = await pool.query(formattedSql);
    // } else if (name && category) {
    //   const sql = `SELECT id, category, price, name
    //                FROM products
    //                WHERE category LIKE ?
    //                AND name LIKE ?
    //                ORDER BY ??
    //                LIMIT ? OFFSET ?;`;
    //   const formattedSql = pool.format(sql, [
    //     table,
    //     name,
    //     category,
    //     orderBy,
    //     limit,
    //     offset,
    //   ]);
    //   res = await pool.query(formattedSql);
    // } else {
    //   const sql = `SELECT * FROM ?? ORDER BY ?? LIMIT ? OFFSET ?`;
    //   const formattedSql = pool.format(sql, [table, orderBy, limit, offset]);
    //   res = await pool.query(formattedSql);
    // }
    // // console.log(offset, limit, table, orderBy);
    // console.log([table, orderBy, limit, offset]);
    // Truy vấn FULLTEXT search với phân trang

    if (searchQuery) {
      const fullTextSearchQuery = `
        SELECT * FROM products
        WHERE MATCH(name, category) AGAINST (? IN BOOLEAN MODE)
        LIMIT ? OFFSET ?;
      `;
      res = await pool.query(fullTextSearchQuery, [
        searchQuery,
        +limit,
        +offset,
      ]);
    } else {
      const sql = `SELECT * FROM products ORDER BY id LIMIT ? OFFSET ?`;
      const formattedSql = pool.format(sql, [limit, offset]);
      res = await pool.query(formattedSql);
    }

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
