import React, { useState, useEffect, useCallback } from "react";
import { fetchEmployees, fetchDepartments, deleteEmployee } from "../api/employeeApi";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 1 — Salary Grade
// A if salary > 80000 | B if salary > 50000 | C otherwise
// ─────────────────────────────────────────────────────────────────────────────
function getSalaryGrade(salary) {
  const s = Number(salary);
  if (s > 80000) return "A";
  if (s > 50000) return "B";
  return "C";
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 2 — Bonus & Total Salary
// Bonus = 10% of salary | Total = salary + bonus
// ─────────────────────────────────────────────────────────────────────────────
function getBonus(salary) {
  return Number(salary) * 0.1;
}

function getTotalSalary(salary) {
  return Number(salary) + getBonus(salary);
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 3 — Employee Category by Age
// <25 → Junior | 25–40 → Mid-level | >40 → Senior
// ─────────────────────────────────────────────────────────────────────────────
function getCategory(age) {
  const a = Number(age);
  if (a < 25) return "Junior";
  if (a <= 40) return "Mid-level";
  return "Senior";
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 4 & 5 — Analytics + Dept Count (computed from employees array)
// ─────────────────────────────────────────────────────────────────────────────
function computeAnalytics(employees) {
  if (employees.length === 0) return null;
  const salaries = employees.map((e) => Number(e.salary));
  return {
    total: employees.length,
    avg: salaries.reduce((a, b) => a + b, 0) / salaries.length,
    highest: Math.max(...salaries),
    lowest: Math.min(...salaries),
  };
}

function computeDeptCount(employees) {
  return employees.reduce((acc, emp) => {
    const dept = emp.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
}

// ─────────────────────────────────────────────────────────────────────────────
// Grade badge style
// ─────────────────────────────────────────────────────────────────────────────
const GRADE_STYLES = {
  A: { backgroundColor: "#dcfce7", color: "#15803d", borderColor: "#86efac" },
  B: { backgroundColor: "#fef9c3", color: "#a16207", borderColor: "#fde047" },
  C: { backgroundColor: "#fee2e2", color: "#b91c1c", borderColor: "#fca5a5" },
};

const CATEGORY_STYLES = {
  Junior:    { backgroundColor: "#ede9fe", color: "#6d28d9" },
  "Mid-level": { backgroundColor: "#dbeafe", color: "#1d4ed8" },
  Senior:    { backgroundColor: "#ffedd5", color: "#c2410c" },
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters & sorting
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("ASC");

  // Modal state
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);

  // ── Load employees ──────────────────────────────────────────────────────────
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (deptFilter) params.department = deptFilter;
      if (sortBy) { params.sortBy = sortBy; params.order = order; }

      const res = await fetchEmployees(params);
      setEmployees(res.data);
    } catch (err) {
      setError("Could not fetch employees. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [search, deptFilter, sortBy, order]);

  // ── Load departments for filter dropdown ────────────────────────────────────
  const loadDepartments = useCallback(async () => {
    try {
      const res = await fetchDepartments();
      setDepartments(res.data);
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);
  useEffect(() => { loadDepartments(); }, [loadDepartments]);

  // ── Success message auto-hide ───────────────────────────────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ── Delete employee ─────────────────────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteEmployee(id);
      showSuccess(`"${name}" deleted.`);
      loadEmployees();
      loadDepartments();
    } catch {
      setError("Failed to delete employee.");
    }
  };

  // ── After Add / Edit ────────────────────────────────────────────────────────
  const handleAddSuccess = (msg) => {
    setShowAdd(false);
    showSuccess(msg);
    loadEmployees();
    loadDepartments();
  };

  const handleEditSuccess = (msg) => {
    setEditId(null);
    showSuccess(msg);
    loadEmployees();
  };

  // ── Toggle sort ─────────────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setOrder("ASC");
    }
  };

  const sortArrow = (field) => {
    if (sortBy !== field) return <span className="sort-neutral">⇅</span>;
    return order === "ASC"
      ? <span className="sort-active">↑</span>
      : <span className="sort-active">↓</span>;
  };

  // ── Format currency ─────────────────────────────────────────────────────────
  // NEW — Indian Rupee format (e.g. ₹8,50,000)
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

  // ── Reset filters ───────────────────────────────────────────────────────────
  const handleReset = () => {
    setSearch("");
    setDeptFilter("");
    setSortBy("");
    setOrder("ASC");
  };

  // ── Dept color badge ────────────────────────────────────────────────────────
  const DEPT_COLORS = {
    Engineering: "#dbeafe",
    Marketing:   "#fce7f3",
    HR:          "#d1fae5",
    Finance:     "#fef3c7",
    Design:      "#ede9fe",
    Management:  "#ffedd5",
  };
  const deptStyle = (dept) => ({
    backgroundColor: DEPT_COLORS[dept] || "#f3f4f6",
    color: "#374151",
  });

  // ── Derived data (computed from current employees state, no backend needed) ─
  const analytics = computeAnalytics(employees);
  const deptCount = computeDeptCount(employees);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="container">

      {/* ── HEADER ── */}
      <header className="app-header">
        <div>
          <h1>Employee Management</h1>
          <p className="subtitle">Manage your team — add, edit, search and sort.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Add Employee
        </button>
      </header>

      {/* ── ALERTS ── */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error      && <div className="alert alert-error">{error}</div>}

      {/* ─────────────────────────────────────────────────────────────────────
          FEATURE 4 — Analytics Section
          Shown only when there is at least one employee loaded
      ───────────────────────────────────────────────────────────────────── */}
      {analytics && !loading && (
        <div className="analytics-section">
          <h2 className="section-title">📊 Analytics</h2>
          <div className="analytics-grid">
            <div className="analytic-card">
              <span className="analytic-label">Total Employees</span>
              <span className="analytic-value">{analytics.total}</span>
            </div>
            <div className="analytic-card">
              <span className="analytic-label">Average Salary</span>
              <span className="analytic-value analytic-green">{fmt(analytics.avg)}</span>
            </div>
            <div className="analytic-card">
              <span className="analytic-label">Highest Salary</span>
              <span className="analytic-value analytic-blue">{fmt(analytics.highest)}</span>
            </div>
            <div className="analytic-card">
              <span className="analytic-label">Lowest Salary</span>
              <span className="analytic-value analytic-orange">{fmt(analytics.lowest)}</span>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────
              FEATURE 5 — Department-wise Employee Count
          ─────────────────────────────────────────────────────────────── */}
          <div className="dept-count-section">
            <h3 className="dept-count-title">Department Breakdown</h3>
            <div className="dept-count-list">
              {Object.entries(deptCount)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, count]) => (
                  <div key={dept} className="dept-count-item">
                    <span className="dept-count-badge" style={deptStyle(dept)}>
                      {dept}
                    </span>
                    <div className="dept-count-bar-wrap">
                      <div
                        className="dept-count-bar"
                        style={{ width: `${(count / analytics.total) * 100}%` }}
                      />
                    </div>
                    <span className="dept-count-num">
                      {count} {count === 1 ? "employee" : "employees"}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOOLBAR ── */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          <select
            className="select-input"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="toolbar-right">
          <button
            className={`btn btn-sort ${sortBy === "salary" ? "active" : ""}`}
            onClick={() => handleSort("salary")}
          >
            Salary {sortArrow("salary")}
          </button>
          <button
            className={`btn btn-sort ${sortBy === "age" ? "active" : ""}`}
            onClick={() => handleSort("age")}
          >
            Age {sortArrow("age")}
          </button>
          {(search || deptFilter || sortBy) && (
            <button className="btn btn-ghost" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── STATS BAR (kept from original) ── */}
      <div className="stats-bar">
        <span>
          <strong>{employees.length}</strong>{" "}
          employee{employees.length !== 1 ? "s" : ""} found
        </span>
        {employees.length > 0 && (
          <span>
            Avg Salary:{" "}
            <strong>
              {fmt(employees.reduce((s, e) => s + Number(e.salary), 0) / employees.length)}
            </strong>
          </span>
        )}
      </div>

      {/* ── TABLE ── */}
      {loading ? (
        <div className="loading-spinner-wrap">
          <div className="spinner"></div>
          <p>Loading employees…</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No employees found</h3>
          <p>Try adjusting your search or filters, or add a new employee.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th className="sortable" onClick={() => handleSort("age")}>
                  Age {sortArrow("age")}
                </th>
                <th>Department</th>
                {/* ── FEATURE 3 header ── */}
                <th>Category</th>
                <th className="sortable" onClick={() => handleSort("salary")}>
                  Salary {sortArrow("salary")}
                </th>
                {/* ── FEATURE 2 headers ── */}
                <th>Bonus</th>
                <th>Total Salary</th>
                {/* ── FEATURE 1 header ── */}
                <th>Grade</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => {
                // Compute derived values once per row
                const grade     = getSalaryGrade(emp.salary);
                const bonus     = getBonus(emp.salary);
                const total     = getTotalSalary(emp.salary);
                const category  = getCategory(emp.age);

                return (
                  <tr key={emp.id} className="emp-row">
                    <td className="row-num">{idx + 1}</td>
                    <td className="emp-name">{emp.name}</td>
                    <td>{emp.age}</td>
                    <td>
                      <span className="dept-badge" style={deptStyle(emp.department)}>
                        {emp.department}
                      </span>
                    </td>

                    {/* ── FEATURE 3 — Employee Category ── */}
                    <td>
                      <span
                        className="category-badge"
                        style={CATEGORY_STYLES[category]}
                      >
                        {category}
                      </span>
                    </td>

                    {/* Original salary cell */}
                    <td className="salary-cell">{fmt(emp.salary)}</td>

                    {/* ── FEATURE 2 — Bonus ── */}
                    <td className="bonus-cell">{fmt(bonus)}</td>

                    {/* ── FEATURE 2 — Total Salary ── */}
                    <td className="total-salary-cell">{fmt(total)}</td>

                    {/* ── FEATURE 1 — Salary Grade ── */}
                    <td>
                      <span
                        className="grade-badge"
                        style={GRADE_STYLES[grade]}
                      >
                        {grade}
                      </span>
                    </td>

                    <td>{emp.city}</td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-edit"
                        onClick={() => setEditId(emp.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(emp.id, emp.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODALS ── */}
      {showAdd && (
        <AddEmployee
          onSuccess={handleAddSuccess}
          onCancel={() => setShowAdd(false)}
        />
      )}
      {editId && (
        <EditEmployee
          employeeId={editId}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditId(null)}
        />
      )}
    </div>
  );
}

export default EmployeeList;
