// config/database.js
const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'rooter1',
  database: 'shoppingcartal',
  port   : '3306'
};

const pool = mysql.createPool(dbConfig);

pool.query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query(sql, values, (error, results) => {
        connection.release();
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  });
};

module.exports = pool;
