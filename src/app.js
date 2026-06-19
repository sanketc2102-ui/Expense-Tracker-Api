import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

// Routes
import authRouter from "./routes/auth.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import expensesRouter from "./routes/expenses.routes.js";
import incomeSourceRouter from "./routes/incomeSources.routes.js";
import incomesRouter from "./routes/income.routes.js";
import budgetRouter from "./routes/budget.routes.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

// cookie parser
app.use(cookieParser());

// cors configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/expenses", expensesRouter);
app.use("/api/v1/income-sources", incomeSourceRouter);
app.use("/api/v1/incomes", incomesRouter);
app.use("/api/v1/budgets", budgetRouter);

// gloable Error handling
app.use(errorHandler);

export default app;
