const pkg = require("pg");
const dotenv = require("dotenv");
const { Pool } = pkg;
dotenv.config();


console.log(process.env.DB_USERNAME);
console.log(process.env.DB_HOST);

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on("connect", () => {
  console.log("connection pool establised with Database");
});

module.exports = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    ssl: process.env.DB_ENABLE_SSL === 'true' ? { rejectUnauthorized: false } : false
  }