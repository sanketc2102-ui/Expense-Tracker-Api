import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

console.log(process.env.USERNAME);

console.log("Expense Tracker Api");
