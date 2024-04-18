// ✅ test sqlite db
import { Database } from "bun:sqlite";

const db = new Database("mydatabase.db");

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  );`);

// Inserting data into the table
try {
    const name = 'Alice';
    const email = 'alice@example.com';
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    console.log('User added successfully.');
} catch (error) {
    console.error('Failed to add user:', error);
}

// Querying data
const users = db.prepare("SELECT * FROM users").all();
console.log(users);

// Closing the database
db.close();
