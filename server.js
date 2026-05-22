require("dotenv").config(); // 1. Load environment variables first
const express = require("express");
const pool =require('./config/database.js')

const app = express();

// 2. Middleware (The "Security & Parsing" layer)

app.use(express.json());


// 3. The "Health Check" Route
app.get("/ping", (req, res) => {
  res.status(200).send(
    JSON.stringify({
      name: "dharsan",
      age: 25,
      greet: "WELCOMe ABOARD",
    }),
  );
});
// A test route to make sure the database is alive
app.get('/db-test', async (req, res) => {
  try {
    // 1. Send the SQL command to PostgreSQL using the pool
    // 'SELECT NOW()' just asks Postgres to return the current timestamp
    const result = await pool.query('SELECT NOW();');
    
    // 2. The data returned from Postgres always lives inside the '.rows' array
    res.json({
      message: "Successfully connected to PostgreSQL!",
      timestamp: result.rows[0]
    });
    
  } catch (error) {
    // 3. If something goes wrong (wrong password, database offline), catch it here
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Failed to connect to the database" });
  }
});

// 4. Port Configuration (Professional Defaulting)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
