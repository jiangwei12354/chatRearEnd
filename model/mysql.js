const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test1',
    port:"3306"
//       host:"127.0.0.1",
//     user:"root",
//     password:"123456",
//     port:"3306",
//     database:"test1"

});
// 执行SQL查询
function query(sql, params, callback) {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error, null);
        } else {
        connection.query(sql, params, (error, results) => {
            connection.release();
            callback(error, results);
        });
        }
    });
}

// 插入数据
function insert(table, data, callback) {
    const sql = `INSERT INTO ${table} SET ?`;
    query(sql, data, callback);
}

// 更新数据
function update(table, data, where, callback) {
    const sql = `UPDATE ${table} SET ? WHERE ${where}`;
    query(sql, data, callback);
}

// 删除数据
function remove(table, where, callback) {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    query(sql, null, callback);
}
module.exports = {
    query,
    insert,
    update,
    remove
}