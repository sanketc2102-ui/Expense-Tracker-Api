import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/dbConnection.js";

dotenv.config({
  path: "./.env",
});

const port = 3000;

connectDB()
  .then(() => {
    app.listen(
      port,
      console.log(`server is running on port localhost:${port}`),
    );
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
