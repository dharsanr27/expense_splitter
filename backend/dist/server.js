import dotenv from "dotenv"; // 1. Load environment variables first
dotenv.config();
import express from "express";
import pool from "./config/database.js";
import userRouter from "./routes/userRoutes.js";
import groupRouter from "./routes/groupRoutes.js";
import expenseRouter from "./routes/expenseRoutes.js";
import settlementRouter from "./routes/settlementRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import cors from "cors";
import rateLimit from "./middlewares/rateLimitMiddleware.js";
const app = express();
// 2. Middleware (The "Security & Parsing" layer)
app.use(cors());
app.use(express.json());
app.use(rateLimit);
app.use((req, res, next) => {
    const start = performance.now();
    res.on("finish", () => {
        // console.log(`${req.method} ${req.originalUrl} - ${(performance.now() - start).toFixed(2)} ms`);
    });
    next();
});
// 3. The "Health Check" Route
app.get("/ping", (req, res) => {
    res.status(200).send(JSON.stringify({
        name: "dharsan",
        age: 25,
        greet: "WELCOMe ABOARD",
    }));
});
// A test route to make sure the database is alive
app.get("/db-test", async (req, res) => {
    try {
        // 1. Send the SQL command to PostgreSQL using the pool
        // 'SELECT NOW()' just asks Postgres to return the current timestamp
        const result = await pool.query("SELECT * from temp;");
        // 2. The data returned from Postgres always lives inside the '.rows' array
        res.json({
            message: "Successfully connected to PostgreSQL!",
            timestamp: result.rows[0],
        });
    }
    catch (error) {
        // 3. If something goes wrong (wrong password, database offline), catch it here
        console.error("Database connection error:", error);
        res.status(500).json({ error: "Failed to connect to the database" });
    }
});
//attach user routes to a base path
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/settlements", settlementRouter);
app.use("/api/dashboardData", dashboardRouter);
// 4. Port Configuration (Professional Defaulting)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
