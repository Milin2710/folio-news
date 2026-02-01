require("dotenv").config();

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(path.join(__dirname, "certs", "ca.pem"), "utf8"),
  },
});

module.exports = pool;
