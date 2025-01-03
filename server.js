const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const db = require("./db"); // Import the database connection pool

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON body

// API to create a new user
app.post("/signup", (req, res) => {
  const userID = uuidv4(); // Generate a unique userID
  const sql =
    "INSERT INTO `table` (`userID`, `name`, `email`, `age`, `gender`, `address`) VALUES (?)";
  const values = [
    userID, // Add the generated userID to the values array
    req.body.name,
    req.body.email,
    req.body.age,
    req.body.gender,
    req.body.address,
  ];

  // Use connection pool for query
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({ error: err.message });
    }
    return res
      .status(200)
      .json({ message: "User registered successfully", userID });
  });
});

// API to fetch all users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM `table`"; // Query to fetch all users

  // Use connection pool to execute query
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(data); // Return all users in the response
  });
});

// API to edit a user
app.put("/users/:userID", (req, res) => {
  const { userID } = req.params; // Get userID from the URL parameters
  const { name, email, age, gender, address } = req.body; // Destructure updated user details from the request body

  const sql =
    "UPDATE `table` SET `name` = ?, `email` = ?, `age` = ?, `gender` = ?, `address` = ? WHERE `userID` = ?";
  const values = [name, email, age, gender, address, userID];

  // Use connection pool for query
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully" });
  });
});

// API to delete a user
app.delete("/users/:userID", (req, res) => {
  const { userID } = req.params; // Get userID from the URL parameters

  const sql = "DELETE FROM `table` WHERE `userID` = ?";

  // Use connection pool for query
  db.query(sql, [userID], (err, data) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({ error: err.message });
    }
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  });
});

// Start the server
app.listen(8081, () => {
  console.log("Server is running on http://localhost:8081");
});
