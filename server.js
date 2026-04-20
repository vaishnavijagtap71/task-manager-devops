// ✅ Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// ✅ Connect to DB
db.connect((err) => {
    if (err) {
        console.error("DB connection failed ❌:", err.message);
    } else {
        console.log("MySQL Connected ✅");
    }
});

// ✅ Test route
app.get("/", (req, res) => {
    res.send("Task Manager API is running 🚀");
});


// ✅ Add Task
app.post("/tasks", (req, res) => {
    console.log("BODY RECEIVED:", req.body);  // 👈 add this

    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    db.query(
        "INSERT INTO tasks (title) VALUES (?)",
        [title],
        (err, result) => {
            if (err) return res.status(500).send(err);

            res.json({ id: result.insertId, title });
        }
    );
});

// ✅ Get All Tasks
app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json(results);
    });
});


// ✅ Delete Task
app.delete("/tasks/:id", (req, res) => {
    const query = "DELETE FROM tasks WHERE id = ?";

    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        res.json({ message: "Task deleted successfully" });
    });
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
