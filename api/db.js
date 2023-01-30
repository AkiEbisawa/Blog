import mysql from "mysql2"

console.log(process.env.DB_KEY)

 const pool = mysql.createPool({
  host:"localhost",
  user:"root",
  password: "Hthak0708",
  database:"blog",
  port: 3306,
}).promise()

export default pool 