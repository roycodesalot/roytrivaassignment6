/*
Name: Roy Aguilar
Date: 11.19.2026
CSC 372-01
Configures and exports the PostgreSQL connection pool using environment variables.
*/

let { Pool } = require('pg');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL || process.env.DATA_BASE_URL;
let isLocalConnection =
  connectionString &&
  /^(postgres(?:ql)?:\/\/[^/]*(localhost|127\.0\.0\.1)|postgres:\/\/\/)/i.test(connectionString);

let pool = new Pool({
  connectionString,
  ssl: isLocalConnection ? false : { rejectUnauthorized: false }
});
//
module.exports = pool;
