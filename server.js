// ✅ Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Create DB connection (NO connect yet)
const db = mysql.createConnection({
    host: process.env.DB_HOST,   // should be: db (docker service name)
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// ✅ Retry connection function (IMPORTANT)
function connectDB() {
    db.connect((err) => {
        if (err) {
            console.error("DB not ready, retrying in 5 sec... ❌", err.message);

            setTimeout(connectDB, 5000); // retry after 5 sec
        } else {
            console.log("MySQL Connected ✅");
        }
    });
}

// ✅ Call the function
connectDB();

// ✅ Test route
app.get("/", (req, res) => {
    res.send("Task Manager API is running 🚀");
});

// ✅ Add Task
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    db.query(
        "INSERT INTO tasks (title) VALUES (?)",
        [title],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }

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
    db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
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

