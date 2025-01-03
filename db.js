const mysql = require("mysql2");

// Create a connection pool
const db = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12755550",
  password: "BhYGlebns3",
  database: "sql12755550",
  connectionLimit: 10,
  port: 3306,
});

// Export the connection pool
module.exports = db;
