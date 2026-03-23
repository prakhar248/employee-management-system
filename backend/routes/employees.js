const express = require("express");
const router = express.Router();
const db = require("../db");

// ─── GET ALL EMPLOYEES (with optional search, filter, sort) ───────────────────
router.get("/", (req, res) => {
  const { search, department, sortBy, order } = req.query;

  let query = "SELECT * FROM employees WHERE 1=1";
  const params = [];

  // Search by name or city
  if (search) {
    query += " AND (name LIKE ? OR city LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  // Filter by department
  if (department) {
    query += " AND department = ?";
    params.push(department);
  }

  // Sort by salary or age
  const allowedSortFields = ["salary", "age", "name", "id"];
  const allowedOrders = ["ASC", "DESC"];
  if (sortBy && allowedSortFields.includes(sortBy)) {
    const sortOrder =
      order && allowedOrders.includes(order.toUpperCase())
        ? order.toUpperCase()
        : "ASC";
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err);
      return res.status(500).json({ error: "Failed to fetch employees." });
    }
    res.json(results);
  });
});

// ─── GET SINGLE EMPLOYEE ──────────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM employees WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch employee." });
    if (results.length === 0)
      return res.status(404).json({ error: "Employee not found." });
    res.json(results[0]);
  });
});

// ─── CREATE EMPLOYEE ──────────────────────────────────────────────────────────
router.post("/", (req, res) => {
  const { name, age, department, salary, city } = req.body;

  if (!name || !age || !department || !salary || !city) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (isNaN(age) || age <= 0 || age > 120) {
    return res.status(400).json({ error: "Invalid age." });
  }
  if (isNaN(salary) || salary < 0) {
    return res.status(400).json({ error: "Invalid salary." });
  }

  const query =
    "INSERT INTO employees (name, age, department, salary, city) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [name, age, department, salary, city], (err, result) => {
    if (err) {
      console.error("Error creating employee:", err);
      return res.status(500).json({ error: "Failed to create employee." });
    }
    res.status(201).json({
      message: "Employee created successfully.",
      id: result.insertId,
    });
  });
});

// ─── UPDATE EMPLOYEE ──────────────────────────────────────────────────────────
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, department, salary, city } = req.body;

  if (!name || !age || !department || !salary || !city) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (isNaN(age) || age <= 0 || age > 120) {
    return res.status(400).json({ error: "Invalid age." });
  }
  if (isNaN(salary) || salary < 0) {
    return res.status(400).json({ error: "Invalid salary." });
  }

  const query =
    "UPDATE employees SET name=?, age=?, department=?, salary=?, city=? WHERE id=?";
  db.query(query, [name, age, department, salary, city, id], (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      return res.status(500).json({ error: "Failed to update employee." });
    }
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Employee not found." });
    res.json({ message: "Employee updated successfully." });
  });
});

// ─── DELETE EMPLOYEE ──────────────────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM employees WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ error: "Failed to delete employee." });
    }
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Employee not found." });
    res.json({ message: "Employee deleted successfully." });
  });
});

// ─── GET DISTINCT DEPARTMENTS (for filter dropdown) ───────────────────────────
router.get("/meta/departments", (req, res) => {
  db.query(
    "SELECT DISTINCT department FROM employees ORDER BY department",
    (err, results) => {
      if (err)
        return res.status(500).json({ error: "Failed to fetch departments." });
      res.json(results.map((r) => r.department));
    }
  );
});

module.exports = router;
