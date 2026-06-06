import "dotenv/config";
import mysql2 from "mysql2/promise";

const pool = mysql2.createPool({
  host: process.env.MYSQL_DATABASE_HOST,
  user: process.env.MYSQL_DATABASE_USERNAME,
  password: process.env.MYSQL_DATABASE_PASSWORD,
  database: process.env.MYSQL_DATABASE_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("✅ mysql connection is established");

    connection.release();
  } catch (error) {
    console.log("❌ mysql connnection failed", error);
    throw error;
  }
};

export default pool;
